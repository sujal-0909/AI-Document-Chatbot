import os
from dotenv import load_dotenv

load_dotenv()

EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "BAAI/bge-small-en-v1.5")
VECTOR_DB_PATH = os.getenv("VECTOR_DB_PATH", "data/vectorstore")
DOCUMENT_PATH = os.getenv("DOCUMENT_PATH", "data/documents")
