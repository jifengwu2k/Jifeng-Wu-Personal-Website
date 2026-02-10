---
title: Running Local LLMs with Ollama
date: 2025-09-05
categories:
- ["Data Science, Multimedia, and Process Automation"]
---

Large Language Models (LLMs) have revolutionized AI, but cloud-based solutions often come with privacy concerns and usage limitations. Ollama provides an elegant solution by enabling you to run LLMs locally on your machine. This guide will walk you through the entire process from installation to interaction.

## What is Ollama?

Ollama is a lightweight, extensible framework that allows you to run various open-source LLMs on your local hardware. It handles model weights, configurations, and provides a simple API interface similar to OpenAI's.

## Installation Process

### Download Ollama

Open your terminal and execute the following command to download the latest version of Ollama:

```bash
wget https://ollama.com/download/ollama-linux-amd64.tgz
```

### Install Ollama

Extract the downloaded archive to your system directory:

```bash
sudo tar -C /usr -xzvf ollama-linux-amd64.tgz
```

## Starting the Ollama Service

Launch the Ollama service with this simple command:

```bash
ollama serve
```

Keep this terminal session active to maintain the service.

## Verifying Your Installation

Open a new terminal window and verify that Ollama is properly installed and running:

```bash
ollama -v
```

This command will display the installed version of Ollama, confirming successful installation.

## Finding the Right Model

Ollama supports numerous models with different capabilities and sizes. Browse the [Ollama Model Library](https://ollama.com/search) to explore available options.

### Downloading a Model

For this example, we'll download the gemma3:4b model:

```bash
ollama pull gemma3:4b
```

The download process may take considerable time depending on your Internet connection speed and the model size.

### Terminal-Based Conversation

Once your model is downloaded, you can start interacting with it directly through the terminal:

```bash
ollama run gemma3:4b
```

This command launches an interactive chat session with your model. Press `Ctrl-D` to exit the conversation when finished.

## Programmatic Access via Python API

Ollama provides an OpenAI-compatible API, making it easy to integrate with existing applications and scripts.

Install a client library:

```
pip install chat-completions-conversation
```

Use the client library:

```python
from chat_completions_conversation import ChatCompletionsConversation

conversation = ChatCompletionsConversation(
    api_key='',
    base_url='http://localhost:11434/v1',
    model='gemma3:4b'
)

conversation.send_and_receive_response('Hello, how are you?')
# Model returns a string
```