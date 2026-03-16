from app.vectorstore.vectordb import load_vectorstore

def retrieve_documents(query):
    db = load_vectorstore()
    results = db.similarity_search(query, k=3)
    return results