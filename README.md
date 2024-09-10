# INDIRA - AI Assistant for Indorelawan

## Introduction

This project is a chatbot that helps users find activities, ask about an activity details, and choose the best activity based on their focuses and commitments. It is designed to be used in Indorelawan, a platform that connects people with activities and opportunities in Indonesia.

**THIS IS A POC. THINGS MAY NOT WORKING AS EXPECTED.**

## Features

- Fetches activities from Indorelawan API
- Allow using embeddings to store activities (WIP)
- Use Groq as an AI inference engine
- Use LangChain as a framework for building the chatbot

## Getting Started

### Prerequisites

Before you can start using the AI assistant, you need to have the following:

1. Node.js and npm installed on your system.
2. [A Groq API key from Groq.ai.](https://console.groq.com/keys)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/dennypradipta/indira.git
```

2. Install the dependencies:

```bash
cd indira
npm install
```

3. Create a `.env` file in the root directory of the project and add the following variables:

```bash
GROQ_API_KEY=gsk_your-api-key
MODEL_NAME=llama-3.1-70b-versatile
TEMPERATURE=0.1
MAX_TOKENS=300
MAX_RETRIES=3
STREAMING=true
ACTIVITY_URL=https://api.festivalrelawan.com/api/activity/ai
BASE_URL=https://www.indorelawan.org
SESSION_SECRET=aku-anak-sehat-tubuhku-kuat
PORT=3001
NODE_ENV=development
EMBEDDING_MODEL='Xenova/all-MiniLM-L6-v2'
FETCH_DATA_INTERVAL="* */1 * * *"
```

4. Start the server:

```bash
npm run dev
```

5. Open your API tester (e.g., Postman, Bruno, etc) and send a POST request to `http://localhost:3001/chat` with the following JSON body:

```json
{
  "question": "Saya pengen ikut aktivitas, tapi bingung mau ikut yang mana"
}
```

The response will be a Markdown-formatted response from the AI assistant.
