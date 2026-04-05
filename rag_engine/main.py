from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_text_splitters import RecursiveCharacterTextSplitter
from typing import List, Optional

app = FastAPI(title="RAG Engine", version="1.0.0")

class ChunkRequest(BaseModel):
    text: str
    chunk_size: int = 500
    chunk_overlap: int = 50

class ChunkResponse(BaseModel):
    chunks: List[str]

@app.get("/")
async def root():
    return {"message": "RAG Engine Active"}

@app.post("/chunk", response_model=ChunkResponse)
async def chunk_text(request: ChunkRequest):
    """
    Split long text into smaller chunks with overlap for better RAG context.
    """
    try:
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=request.chunk_size,
            chunk_overlap=request.chunk_overlap,
            length_function=len,
        )
        chunks = splitter.split_text(request.text)
        return ChunkResponse(chunks=chunks)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/embed")
async def generate_embeddings(text: str):
    """
    Placeholder for embedding generation (e.g., using OpenAI or local HuggingFace models).
    """
    # In a real implementation, you would call a model here.
    return {"message": f"Embedding logic for: {text[:50]}..."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
