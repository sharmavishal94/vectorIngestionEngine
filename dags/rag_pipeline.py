from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime
import requests
import json

def process_and_chunk_documents(**context):
    """
    Task to call the RAG Engine for each document associated with the lead.
    """
    conf = context.get('dag_run').conf
    lead_id = conf.get('lead_id')
    
    if not lead_id:
        print("No lead_id provided in configuration.")
        return

    # 1. Fetch document paths from Postgres (via a simulated query or actual DB hook)
    # For now, let's assume we call the rag-engine directly with some mock text
    # In a real scenario, you'd use a PostgresHook to get the 'file_path'
    
    print(f"Triggering RAG Engine for Lead: {lead_id}")
    
    # 2. Call the RAG Engine (Python FastAPI)
    try:
        response = requests.post(
            "http://rag-engine:8000/chunk",
            json={
                "text": "This is a sample document content that would be read from the lead's uploaded files.",
                "chunk_size": 200,
                "chunk_overlap": 20
            }
        )
        response.raise_for_status()
        chunks = response.json().get('chunks', [])
        print(f"Successfully created {len(chunks)} chunks for lead {lead_id}")
        
        # 3. Here you would save chunks/embeddings back to Postgres
        
    except Exception as e:
        print(f"Failed to call RAG Engine: {e}")
        raise

with DAG(
    'process_lead_rag',
    start_date=datetime(2026, 1, 1),
    schedule=None, # Only triggered via API
    catchup=False
) as dag:

    run_rag_pipeline = PythonOperator(
        task_id='run_rag_pipeline',
        python_callable=process_and_chunk_documents
    )
