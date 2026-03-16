# AI Document Chatbot

An intelligent document-based chatbot built with **FastAPI**, **LangChain**, **FAISS**, and a modern web frontend. This application allows users to upload PDF documents and ask questions about them using Retrieval-Augmented Generation (RAG).

## Features

- 📄 **PDF Document Upload**: Drag-and-drop or browse to upload PDF documents.
- 💬 **Interactive Chat Interface**: A modern, dark-themed chat UI built with HTML/CSS/JS.
- 🧠 **Retrieval-Augmented Generation (RAG)**: Extracts meaning from your documents to provide accurate answers.
- ⚡ **Local Embeddings**: Uses `FastEmbed` and `FAISS` for fast, local vector search and embedding generation.
- 🚀 **FastAPI Backend**: High-performance, asynchronous Python backend.

## Project Structure

```
├── app/
│   ├── api/            # API routing (upload, chat)
│   ├── config/         # Environment variables and settings
│   ├── ingestion/      # PDF loading, text chunking, and embedding generation
│   ├── rag/            # Document retrieval and answer generation logic
│   ├── utils/          # General helper functions
│   ├── vectorstore/    # FAISS Vector database management
│   └── main.py         # FastAPI application entry point
├── data/
│   ├── documents/      # Uploaded PDF files
│   └── vectorstore/    # Local FAISS index files
├── frontend/
│   ├── index.html      # Main chatbot interface
│   ├── script.js       # Frontend logic and API integration
│   └── styles.css      # Styling for the UI
├── .env                # Configuration variables
├── requirements.txt    # Python dependencies
└── README.md           # Project documentation
```

## Tech Stack

- **Backend:** Python, FastAPI, Uvicorn
- **AI/RAG:** LangChain, FAISS (Vector DB), FastEmbed (Local Embeddings), PyPDF
- **Frontend:** HTML5, CSS3, Vanilla JavaScript

## Prerequisites

- **Python:** Version 3.10, 3.11, or 3.12 is recommended.
  *Note: Python 3.13 may not be fully supported by `onnxruntime` and `fastembed`.*
- **Visual C++ Redistributable (Windows):** Required for `onnxruntime` if using local FastEmbed on Windows. You can download it from [Microsoft](https://aka.ms/vs/17/release/vc_redist.x64.exe).

## Installation

1. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Ensure you have an `.env` file in the root directory:
   ```env
   EMBEDDING_MODEL=BAAI/bge-small-en-v1.5
   VECTOR_DB_PATH=data/vectorstore
   DOCUMENT_PATH=data/documents
   ```

## Running the Application

1. Start the FastAPI server (this serves both the API and the frontend):
   ```bash
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. Open your web browser and navigate to:
   [http://localhost:8000](http://localhost:8000)

## Usage

1. Open the web interface.
2. Drag and drop a PDF file into the designated upload zone in the sidebar or click to browse.
3. Wait for the upload and processing to complete (the document will be text-chunked and embedded).
4. Use the chat input box at the bottom to ask questions about your uploaded documents.

---
*Developed using modern agentic full-stack practices.*
