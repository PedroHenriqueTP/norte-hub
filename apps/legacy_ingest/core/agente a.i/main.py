import sys
import os
import queue
import time
import asyncio
import tempfile
import sounddevice as sd
import numpy as np
from faster_whisper import WhisperModel
from interpreter import interpreter
import edge_tts
import torch

os.environ['PYGAME_HIDE_SUPPORT_PROMPT'] = "hide"
import pygame

import warnings
warnings.filterwarnings("ignore")

from skills_loader import load_skills

# =======================
# Configuration
# =======================
LLM_MODEL = "ollama/llama3"
LLM_API_BASE = "http://localhost:11434/v1"
TTS_VOICE = "pt-BR-AntonioNeural"
VAD_SAMPLE_RATE = 16000
VAD_BLOCK_SIZE = 512

print("=== Starting Agent AI Infrastructure ===")

# =======================
# VAD Setup (Silero)
# =======================
print("Loading Silero VAD...")
vad_model, utils = torch.hub.load(
    repo_or_dir='snakers4/silero-vad',
    model='silero_vad',
    force_reload=False,
    trust_repo=True
)
(get_speech_timestamps, save_audio, read_audio, VADIterator, collect_chunks) = utils
vad_iterator = VADIterator(vad_model)

# =======================
# STT Setup (Faster-Whisper)
# =======================
print("Loading Faster-Whisper (STT)...")
stt_model = WhisperModel("base", device="cpu", compute_type="int8") # Use "cuda" and "float16" if GPU available!

# =======================
# Open Interpreter Setup
# =======================
print("Configuring Open Interpreter...")
interpreter.llm.model = LLM_MODEL
interpreter.llm.api_base = LLM_API_BASE
interpreter.auto_run = True

# Load dynamic skills into the system prompt
custom_skills = load_skills()
interpreter.system_message += f"\n\n{custom_skills}"

# =======================
# Audio Output (TTS)
# =======================
pygame.mixer.init()

async def speak(text):
    print(f"\n[Agent Voice]: {text}\n")
    communicate = edge_tts.Communicate(text, TTS_VOICE)
    
    tmp_path = tempfile.mktemp(suffix=".mp3")
    await communicate.save(tmp_path)
    
    # Play MP3 via Pygame
    pygame.mixer.music.load(tmp_path)
    pygame.mixer.music.play()
    while pygame.mixer.music.get_busy():
        pygame.time.Clock().tick(10)
    
    # Clean up
    pygame.mixer.music.unload()
    try:
        os.remove(tmp_path)
    except:
        pass


# =======================
# Listening Loop
# =======================
audio_queue = queue.Queue()

def audio_callback(indata, frames, time, status):
    # Put raw audio bytes into queue
    audio_queue.put(bytes(indata))

async def main_loop():
    print("\n=== Agent is Ready! Speak to interact. (Press Ctrl+C to stop) ===")
    
    stream = sd.RawInputStream(
        samplerate=VAD_SAMPLE_RATE, 
        blocksize=VAD_BLOCK_SIZE,
        dtype='int16',
        channels=1,
        callback=audio_callback
    )
    
    with stream:
        while True:
            speech_buffer = bytearray()
            is_speaking = False
            
            # 1. Listen for voice activity
            while True:
                chunk = audio_queue.get()
                audio_np = np.frombuffer(chunk, dtype=np.int16).astype(np.float32) / 32768.0
                tensor = torch.from_numpy(audio_np)
                
                speech_dict = vad_iterator(tensor, return_seconds=True)
                
                if speech_dict:
                    if 'start' in speech_dict:
                        sys.stdout.write("Listening... ")
                        sys.stdout.flush()
                        is_speaking = True
                        
                    if 'end' in speech_dict:
                        sys.stdout.write("Done.\n")
                        is_speaking = False
                        # Add a little padding to the end chunk
                        speech_buffer.extend(chunk)
                        break 
                
                if is_speaking:
                    speech_buffer.extend(chunk)
            
            # Simple threshold check to ignore extremely short noises
            if len(speech_buffer) < VAD_SAMPLE_RATE: # < 0.5s approx 
                continue
                
            print("[Processing Speech...]")
            # 2. Transcription
            audio_np = np.frombuffer(speech_buffer, dtype=np.int16).astype(np.float32) / 32768.0
            segments, info = stt_model.transcribe(audio_np, beam_size=5, language="pt")
            
            transcription = ""
            for segment in segments:
                transcription += segment.text + " "
                
            transcription = transcription.strip()
            
            if not transcription:
                continue
                
            print(f"\n[You]: {transcription}\n")
            print("[Thinking...]")
            
            # Pause listening so it doesn't hear its own execution sounds
            stream.stop()
            
            try:
                # 3. Execution via Open Interpreter
                response_messages = interpreter.chat(transcription, display=True)
                
                # 4. Voice Output
                if response_messages:
                    for msg in reversed(response_messages):
                        if msg['role'] == 'assistant' and msg['type'] == 'message' and isinstance(msg.get('content'), str):
                            await speak(msg['content'])
                            break
            except Exception as e:
                print(f"Error during agent execution: {e}")
                
            # Clear old audio chunks before resuming
            while not audio_queue.empty():
                audio_queue.get()
                
            vad_iterator.reset_states()
            stream.start()

if __name__ == "__main__":
    # Prevent Windows loop bug
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        
    try:
        asyncio.run(main_loop())
    except KeyboardInterrupt:
        print("\nAgent stopped.")
