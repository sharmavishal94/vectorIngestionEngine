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

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_classic.agents import AgentExecutor, create_tool_calling_agent
from langchain_classic.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_classic.tools import Tool
import os

# Initialize components
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-pro",
    temperature=0,
    google_api_key=os.getenv("GOOGLE_API_KEY", "your-placeholder-key")
)

# Example dummy tool (to demonstrate agent functionality)
def get_leads_summary(query: str):
    """Summarizes status of data ingestion and CRM leads."""
    return "All leads successfully chunked! Airflow pipeline is currently active."

tools = [
    Tool(
        name="CRM_Summarizer",
        func=get_leads_summary,
        description="Useful for summarizing CRM data or pipeline status."
    )
]

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful CRM and Data Assistant. Use tools when needed to answer questions."),
    MessagesPlaceholder(variable_name="chat_history", optional=True),
    ("user", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad"),
])

# Build the Agent
agent = create_tool_calling_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []

@app.post("/agent/chat")
async def agent_chat(request: ChatRequest):
    """
    Handle a conversational query using a LangChain agent.
    """
    api_key = os.getenv("GOOGLE_API_KEY")
    if api_key == "your-placeholder-key" or not api_key:
        return {"response": "The agent is reachable, but the Google API Key is not configured. Please add `GOOGLE_API_KEY` to your docker-compose.yaml or environment."}

    try:
        # In a real setup, parse history into LangChain messages
        # agent_executor.invoke handles input key map
        result = agent_executor.invoke({
            "input": request.message,
            "chat_history": [] 
        })
        return {"response": result["output"]}
    except Exception as e:
        print(f"Agent error: {e}")
        error_str = str(e)
        if "API key not valid" in error_str or "API_KEY_INVALID" in error_str:
            return {"response": "The agent is reachable, but the Google API Key provided is invalid."}
        return {"response": "I'm having internal thoughts... (Agent error occurred)"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
