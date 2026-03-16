from langchain_community.embeddings import FastEmbedEmbeddings
from app.config.settings import EMBEDDING_MODEL

def get_embeddings():
    embeddings = FastEmbedEmbeddings(
        model_name=EMBEDDING_MODEL
    )
    return embeddings
