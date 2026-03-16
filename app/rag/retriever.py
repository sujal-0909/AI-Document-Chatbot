from app.vectorstore.vectordb import load_vectorstore

def retrieve_documents(query):

    db = load_vectorstore()

    if db is None:
        return []

    docs = db.similarity_search(query, k=3)

    return docs