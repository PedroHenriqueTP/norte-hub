# Goal Description
The objective is to establish the infrastructure for a local, real-time agentic AI assistant. The system must use an audio interface (VAD, Faster-Whisper for STT, Kokoro/TTS for voice output) and orchestrate actions using Open Interpreter. It will access local environments (File System, Shell, Obsidian) via MCP/Direct OS access, load dynamic skills from a `/skills` directory, and integrate external media generation hooks.

## User Review Required

> [!WARNING]
> **Architecture Decision: Docker vs. Local Run**
> Since the agent (via Open Interpreter) needs to interact with your *local* Windows environment (Shell, File System, Obsidian) and your *local* audio devices (Microphone/Speakers), running the main python script **inside a Docker container** on Windows WSL2 is highly problematic. Audio forwarding from Windows to Docker is complex and unreliable, and the agent's shell access would be restricted to the Linux container rather than your host Windows machine.
> 
> **My Proposal (Hybrid Approach):**
> 1. Use `docker-compose.yml` to host the heavy AI models (Ollama).
> 2. Run the `main.py` orchestrator natively on your Windows environment using a Python virtual environment. This gives the agent direct native access to your files, powershell, and audio devices natively with minimal latency.
> 
> *Do you agree with this hybrid approach?*

## Proposed Changes

### Docker Infrastructure
#### [NEW] [docker-compose.yml](file:///c:/Users/ACER/Desktop/agente%20a.i/docker-compose.yml)
Will define a service to run **Ollama** locally, exposing port 11434. This serves as the LLM backend for Open Interpreter without cluttering your global installation, if you choose to use it via docker. (I can also include an optional local faster-whisper API server if you want to offload it from the python script, but running it in Python is usually faster for real-time VAD).

### Application Core
#### [NEW] [main.py](file:///c:/Users/ACER/Desktop/agente%20a.i/main.py)
The Real-Time Agentic Loop. Responsibilities:
- **Audio & VAD**: Uses `silero-vad` (or `webrtcvad`) and `sounddevice` to listen continuously without a wake word.
- **STT**: Uses `faster-whisper` Python library to transcribe detected voice chunks.
- **Agent/Orchestrator**: Uses `open-interpreter`. We will connect it to the local Ollama instance or the LLM of your choice.
- **TTS**: Integrate Kokoro-TTS (via ONNX) or edge-tts for low latency synthesized speech output.
- **Router**: Audio in -> Text -> Open Interpreter logic -> Text out -> Audio out.

#### [NEW] [requirements.txt](file:///c:/Users/ACER/Desktop/agente%20a.i/requirements.txt)
Dependencies including `faster-whisper`, `open-interpreter`, `sounddevice`, `numpy`, `silero-vad`, etc.

#### [NEW] [setup.ps1](file:///c:/Users/ACER/Desktop/agente%20a.i/setup.ps1)
A helper script to automatically create a python environment, install dependencies, and start the system.

### Skills & Context
#### [NEW] [skills/deploy_project.py](file:///c:/Users/ACER/Desktop/agente%20a.i/skills/deploy_project.py)
An example skill template defining how Open Interpreter should execute deployment tasks.
#### [NEW] [skills/generate_media.py](file:///c:/Users/ACER/Desktop/agente%20a.i/skills/generate_media.py)
An example skill acting as a hook for local Suno-API or Audiocraft, showing how the assistant can intercept a "create a lo-fi beat" command and execute the correct local script.
#### [NEW] [skills_loader.py](file:///c:/Users/ACER/Desktop/agente%20a.i/skills_loader.py)
A utility explicitly imported by `main.py` to read the `/skills` folder and format them as part of the dynamic System Prompt for Open Interpreter.

### Storage Paths
#### [NEW] [assets/](file:///c:/Users/ACER/Desktop/agente%20a.i/assets/)
A folder for output artifacts (e.g., generated `.wav` files).

## Open Questions

1. **Model Selection**: For the local Open Interpreter brain, do you plan to use a specific model in Ollama (e.g., `llama3:8b`, `qwen2.5-coder`)? 
2. **MCP Details**: Do you already have specific MCP servers (Model Context Protocol) running that you want Open Interpreter to connect to, or should Open Interpreter use its native computer-control capabilities to fulfill the File System/Shell/Obsidian tasks?
3. **TTS**: Kokoro is great, but its local Python integration requires downloading its models. Another quick and free option is `edge-tts` (Microsoft Edge's voice API) which is very light and high-quality but requires internet. Which do you prefer for the initial setup?

## Verification Plan
1. Create the scaffolding and provide the user with the setup script.
2. Ensure the `docker-compose.yml` can spin up Ollama properly.
3. Validate that `main.py` parses the `/skills` folder and sets the context.
4. User will run the loop and confirm audio input triggers the STT and subsequently Open Interpreter.
