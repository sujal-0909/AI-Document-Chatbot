from langchain_community.vectorstores import FAISS
from app.config.settings import VECTOR_DB_PATH
from app.ingestion.embedder import get_embeddings

def create_vectorstore(chunks):
    embeddings = get_embeddings()
    db = FAISS.from_documents(chunks, embeddings)
    db.save_local(VECTOR_DB_PATH)
    return db

def load_vectorstore():
    embeddings = get_embeddings()
    db = FAISS.load_local(
        VECTOR_DB_PATH,
        embeddings,
        allow_dangerous_deserialization=True
    )
    return db
