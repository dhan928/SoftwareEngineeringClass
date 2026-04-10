# Ollama Setup Guide

This guide explains how to set up Ollama for local LLM inference in the LLM Inference Application.

## Prerequisites

- Windows 10/11, macOS, or Linux
- At least 4GB RAM (8GB+ recommended)
- For GPU acceleration: NVIDIA or AMD GPU with appropriate drivers

## Installation

### Windows

1. **Download Ollama**
   - Go to [ollama.ai](https://ollama.ai)
   - Click "Download" and select Windows
   - Download the `.exe` file

2. **Install Ollama**
   - Run the downloaded installer
   - Follow the installation wizard
   - Ollama will start automatically after installation

3. **Verify Installation**
   - Open PowerShell and run:
   ```powershell
   ollama --version
   ```

### macOS

1. **Download Ollama**
   - Go to [ollama.ai](https://ollama.ai)
   - Download the macOS version

2. **Install**
   - Open the `.dmg` file
   - Drag Ollama to Applications folder

3. **Verify**
   ```bash
   ollama --version
   ```

### Linux

```bash
curl -fsSL https://ollama.ai/install.sh | sh
ollama --version
```

## Running Ollama

### Start Ollama Server

**Windows (PowerShell):**
```powershell
ollama serve
```

**macOS/Linux:**
```bash
ollama serve
```

This will start Ollama on `http://localhost:11434`

## Downloading Models

Once Ollama is running, download a model. Here are popular options:

### Lightweight Models (Good for CPU)
- **Mistral** (7B, ~5GB)
  ```
  ollama pull mistral
  ```
  
- **Neural Chat** (7B, ~5GB)
  ```
  ollama pull neural-chat
  ```

### Medium Models (Good for GPU or high-end CPU)
- **Llama2** (7B, ~4GB)
  ```
  ollama pull llama2
  ```

- **Orca** (7B, ~4GB)
  ```
  ollama pull orca-mini
  ```

### Larger Models (Better quality, needs more resources)
- **Llama2 13B** (~8GB)
  ```
  ollama pull llama2:13b
  ```

- **Mistral 8x7B** (~49GB, MOE model)
  ```
  ollama pull mistral:latest
  ```

## Configuration

The LLM Inference app is configured to use Ollama. Default settings:

- **Ollama URL**: `http://localhost:11434`
- **Default Model**: `mistral` (can be changed)
- **Temperature**: 0.7 (creativity level)
- **Max Tokens**: 512

### Override Configuration

Set environment variables before starting the backend:

**Windows (PowerShell):**
```powershell
$env:OLLAMA_URL = "http://localhost:11434"
$env:OLLAMA_MODEL = "mistral"
$env:OLLAMA_TEMPERATURE = "0.7"
```

**macOS/Linux (Bash):**
```bash
export OLLAMA_URL="http://localhost:11434"
export OLLAMA_MODEL="mistral"
export OLLAMA_TEMPERATURE="0.7"
```

## Recommended Setup for Development

### For Fast Testing (Limited Resources)
```bash
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Pull a lightweight model
ollama pull mistral

# Terminal 3: Start backend
cd backend
node src/index.js

# Terminal 4: Start frontend
cd frontend
python -m http.server 5500
```

### For Better Quality Responses (More Resources)
```bash
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Pull a better model
ollama pull llama2

# Then in backend config or environment:
set OLLAMA_MODEL=llama2
```

## Testing the Integration

Once everything is running:

1. Open http://127.0.0.1:5500 in your browser
2. Sign up or log in
3. Start a new chat conversation
4. Ask a question like "What is machine learning?"
5. Watch as Ollama generates a response

## Troubleshooting

### "Failed to fetch" error
- Make sure Ollama is running (`ollama serve`)
- Verify Ollama is accessible at `http://localhost:11434`
- Check firewall settings

### Slow responses
- The first request to a model is slower (loading into memory)
- Switch to a smaller model: `ollama pull mistral`
- Increase system RAM or use GPU acceleration

### Out of Memory errors
- Close other applications
- Switch to a smaller model
- Increase virtual memory/swap space

### Model won't download
- Check internet connection
- Ensure you have enough disk space (~5-50GB depending on model)
- Try: `ollama pull mistral` again

## Useful Ollama Commands

```bash
# List downloaded models
ollama list

# Test a model directly
ollama run mistral "What is Python?"

# Remove a model to save space
ollama rm mistral

# See running models
ollama ps

# Stop all models
ollama stop
```

## Performance Tips

1. **First request latency**: The first request loads the model into memory (can take 5-10 seconds). Subsequent requests are faster.

2. **GPU Acceleration**: Ollama automatically uses GPU if available (NVIDIA/AMD)

3. **Model Selection**:
   - **Fast but basic**: mistral, neural-chat
   - **Balanced**: llama2, orca
   - **Slow but quality**: llama2:13b, mistral:8x7b

4. **Memory Usage**:
   - 7B models: ~5-8GB RAM
   - 13B models: ~10-15GB RAM
   - 70B models: Need GPU or very high RAM

## Next Steps

1. Start Ollama server
2. Pull a model (e.g., `ollama pull mistral`)
3. Start the LLM Inference backend
4. Open the web interface and test!

For more information, visit [ollama.ai](https://ollama.ai) or check their [GitHub](https://github.com/ollama/ollama).
