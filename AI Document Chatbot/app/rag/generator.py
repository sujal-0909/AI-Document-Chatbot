from app.rag.retriever import retrieve_documents

def generate_answer(query):
    docs = retrieve_documents(query)
    context = "\n\n".join([doc.page_content for doc in docs])
    answer = f"""
Relevant information from documents:

{context}

User Question:
{query}
"""
    return answer
