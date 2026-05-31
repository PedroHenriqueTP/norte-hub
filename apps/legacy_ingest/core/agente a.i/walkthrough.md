# Infraestrutura do Assistente de IA Concluída

A estrutura fundamental do se Assistant ("The Brain") foi criada com a abordagem híbrida. Todos os arquivos de integração (Voice-to-Action) já se encontram na sua pasta local.

## O Que Foi Implementado

### 1. Camada Docker (Ollama)
Foi gerado o arquivo [docker-compose.yml](file:///c:/Users/ACER/Desktop/agente%20a.i/docker-compose.yml) para rodar o Ollama.
* **Propósito**: Executar os LLMs em isolamento sem conflitar com seu sistema. A porta `11434` será exposta para o host.

### 2. Ambiente Windows Local
Como scripts em Python precisam de acesso ao microfone/alto-falante, desenvolvemos um script utilitário de setup.
* [setup.ps1](file:///c:/Users/ACER/Desktop/agente%20a.i/setup.ps1): Cria o ambiente virtual (`venv`), instala as dependências do [requirements.txt](file:///c:/Users/ACER/Desktop/agente%20a.i/requirements.txt) (`faster-whisper`, `open-interpreter`, `sounddevice`, `silero-vad`, etc.) e provisiona as pastas necessárias.

### 3. Loop Central de Orquestração
O arquivo principal [main.py](file:///c:/Users/ACER/Desktop/agente%20a.i/main.py) é o motor de execução. O fluxo dele é:
1. **Silero VAD + SoundDevice**: Escuta continuamente seu microfone sem necessidade de "Wake Word". Ele corta o som assim que você para de falar.
2. **Faster-Whisper**: Converte a rajada de áudio cortada em texto com altíssima rapidez.
3. **Open Interpreter**: Recebe o texto e se conecta ao seu Ollama local para determinar as ações a serem tomadas no seu SO.
4. **Edge-TTS + PyGame**: O Interpreter devolve a resposta falada e a sua máquina reproduz instantaneamente utilizando vozes neurais da Microsoft via Edge API.

### 4. Sistema de Embutir "Skills" Dynamicos
O módulo [skills_loader.py](file:///c:/Users/ACER/Desktop/agente%20a.i/skills_loader.py) varre todos os arquivos dentro do diretório `/skills`, injetando as automações diretamente no Prompt Sistêmico do Interpreter ("System Message").
Criamos dois ganchos iniciais:
* [skills/deploy_project.py](file:///c:/Users/ACER/Desktop/agente%20a.i/skills/deploy_project.py): Exemplo de script de deploy.
* [skills/generate_media.py](file:///c:/Users/ACER/Desktop/agente%20a.i/skills/generate_media.py): Exemplo de como interceptar comandos para o Audiocraft/Suno-API local.

## Como Executar e Testar

> [!IMPORTANT]
> **Pré-requisitos Necessários Antes de Rodar**
> 
> 1. Inicie o Docker e suba o Ollama rodando no terminal (dentro da pasta do projeto):
>    ```powershell
>    docker-compose up -d
>    ```
> 2. Puxe um modelo inicial para o Ollama interagir (recomendamos o llama3):
>    ```powershell
>    docker exec -it local_llm_brain ollama run llama3
>    ```

1. Na raiz do seu diretório `agente a.i`, abra o **PowerShell** como Administrador (apenas a primeira vez para rodar script local de política, se necessário) e execute:
   ```powershell
   .\setup.ps1
   ```
2. Após o setup ser finalizado e a `venv` estar ativada, inicie a escuta:
   ```powershell
   python main.py
   ```
3. O terminal mostrará `"Listening... "` assim que você começar a falar! O assistente deve responder tanto no terminal da IDE quanto de forma falada.

> [!TIP]
> Caso queira que o script interprete código sem lhe pedir permissão contínua em tela negra do Interpreter, o parâmetro `interpreter.auto_run = True` já está ativado no seu código-fonte, garantindo experiência hands-free.
