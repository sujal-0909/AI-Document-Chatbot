import os
from fastapi import APIRouter, UploadFile, File
from app.ingestion.loader import load_pdf
from app.ingestion.chunker import chunk_documents
from app.vectorstore.vectordb import create_vectorstore
from app.config.settings import DOCUMENT_PATH
from app.rag.generator import generate_answer
from app.utils.helpers import ensure_directory

router = APIRouter()


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    ensure_directory(DOCUMENT_PATH)
    os.makedirs(DOCUMENT_PATH, exist_ok=True)

    file_location = os.path.join(DOCUMENT_PATH, file.filename)
    with open(file_location, "wb") as f:
        f.write(await file.read())

    documents = load_pdf(file_location)
    chunks = chunk_documents(documents)
    create_vectorstore(chunks)

    return {"message": "Document processed successfully"}


@router.get("/chat")
def chat(query: str):
    answer = generate_answer(query)
    return {"response": answer}