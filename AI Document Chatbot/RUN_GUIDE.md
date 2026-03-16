# How to Run the AI Document Chatbot Project

This guide walks you through the step-by-step process of running the **Frontend**, **Backend**, and **Database** of the AI Document Chatbot project.

By design, this full-stack application is consolidated and managed by the **FastAPI Backend**, which also serves the **Frontend UI**, while the **Database** (FAISS Vector Store) is generated and managed locally on the fly.

---

## Prerequisites

Before starting, ensure you have the following installed to run the project smoothly:
1. **Python 3.10+** (Python 3.10, 3.11, or 3.12 recommended. *Python 3.13 may not be fully supported by some ML dependencies).*
2. **Visual C++ Redistributable (Windows Users Only):** Required for local embedding capabilities (`onnxruntime`). Download from [Microsoft](https://aka.ms/vs/17/release/vc_redist.x64.exe).

---

## Step 1: Initialize the Environment & Install Dependencies

Like any standard Python project, you must set up an isolated environment to prevent version conflicts.

1. **Open your terminal/command prompt** and navigate to your main project folder:
   ```bash
   cd "path\to\AI Document Chatbot"
   ```

2. **Create a Virtual Environment:**
   Run the following command to create an isolated workspace (`venv`):
   ```bash
   python -m venv venv
   ```

3. **Activate the Virtual Environment:**
   Depending on your operating system, run the activation command:
   * **Windows:** `.\venv\Scripts\activate`
   * **macOS/Linux:** `source venv/bin/activate`

   *(Once activated, you should see `(venv)` preceding your terminal command line.)*

4. **Install the Required Packages:**
   With the virtual environment active, install all the necessary code tools (like FastAPI, LangChain, FAISS, etc.):
   ```bash
   pip install -r requirements.txt
   ```

---

## Step 2: Configure the Project Settings (Backend Config)

The project relies on some basic settings like connection strings and the embedding model of choice.

1. In the root directory (where `requirements.txt` is), make sure there is a file named **`.env`**.
2. If it's not present, create one and paste the following baseline configuration inside:
   ```env
   EMBEDDING_MODEL=BAAI/bge-small-en-v1.5
   VECTOR_DB_PATH=data/vectorstore
   DOCUMENT_PATH=data/documents
   ```

*(This tells the application to use a local, fast model and sets up the folders used for the database and files.)*

---

## Step 3: Start the Backend server (Which also serves the Frontend)

This project is built using a modern architecture where the **Python FastAPI Backend** is not only responsible for API interactions, but it is also configured to serve the **HTML/CSS/JS Frontend GUI** locally to the browser.

1. From the activated terminal, run the following command. This starts the backend HTTP server:
   ```bash
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   * *`--reload` enables live-reload when making code changes.*
   * *`--port 8000` is the specific door you will enter through your browser.*

2. You should see logs indicating:
   `Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)`
   `Application startup complete.`

---

## Step 4: Access the Frontend Web Interface

With the backend server actively running, the frontend is instantly accessible!

1. Open your favorite web browser (Chrome, Edge, Firefox, etc.).
2. Go to the address bar and navigate to:
   **[http://localhost:8000](http://localhost:8000)**
3. You should immediately see the modern AI Document Chatbot user interface.

---

## Step 5: Database Creation & Management (FAISS Vector Store)

In this project, the **Database** is not a traditional SQL server like MySQL. It uses **FAISS**, a high-performance, local vector database designed specifically for AI embeddings. 

**This database creates and updates itself locally as you use the application!**

1. **How to Use It:** Simply drag and drop a PDF file into the frontend browser interface or use the browse button to upload.
2. **What Happens Behind the Scenes:** 
   * The backend extracts text from the PDF.
   * Built-in machine learning models split it into "chunks" and locally index those chunks as mathematical embeddings (vectors).
   * It then actively saves this index structure into the configured `data/vectorstore` directory.
   * This is your local Artificial Intelligence Database!
   
You can now ask questions in the frontend text box, and the system dynamically pulls facts out of this locally constructed FAISS vector database to answer you.
