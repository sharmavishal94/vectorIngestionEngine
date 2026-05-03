# Project 

Status: In-Progress

This Project is an attmpt to do multiple things at a time.
1. Create my Own Mini CRM.
2. Create my own Ingestion Engine to ingest data from multiple sources.
3. Create a RAG system to query the data.
4. Create Agentic Experience around the same to make agents that can perform tasks.
  - Create my Own Orchestration Layer.
  - Create my Own Tooling Layer.
  - Create my Own Memory Layer.
  - Create my Own Knowledge Base Layer.
  - Create my Own Prompt Management Layer.
5. Observability using Otel
6. Deploy using Kubernetes 

# Tech Stack

CRM - Next.js + FastAPI
Ingestion Engine - Python + FastAPI + Airflow DAGs
Database - Postgres + pgvector for Vector Embedding.

# Below are the commands

docker-compose up -d
docker ps -a
docker-compose down
docker-compose down --volumes --remove-orphans 
- My data will also go.

To Run Postgres
docker compose exec postgres psql -U airflow -d data_cloud

\dt *.*

# CRM (Next.js, `app` schema)

Contacts are stored in Postgres schema **`app`** (not `raw`). `raw.*` remains the Airflow landing zone.

- **Docker:** `docker compose up -d crm` then open [http://localhost:3000](http://localhost:3000).
- **Local dev:** `cd crm && cp .env.example .env.local && npm install && npm run dev` (needs Postgres up; use `DATABASE_URL` pointing at `localhost:5432`).
- **Fresh Postgres volume:** `./db/init` runs on first init. Existing volumes:  
  `docker compose exec -T postgres psql -U airflow -d data_cloud -f /docker-entrypoint-initdb.d/01-app-schema.sql`  
  (or rely on CRM server startup, which runs the same DDL via `instrumentation`).

docker-compose up -d --build crm
docker-compose restart rag-engine
docker-compose logs rag-engine


# vectorIngestionEngine

UXhVCVaCZeTEGNUF

docker exec -it my_data_cloud-airflow-webserver-1 cat /opt/airflow/simple_auth_manager_passwords.json.generated


https://github.com/godatadriven/data-pipelines-with-airflow-2nd-ed/tree/master








# Pending Features
Check Git Project Tracker.
https://github.com/users/sharmavishal94/projects/2

I need to change the architecture.
AI Agent and RAG needs to go Separate Service.

# Logging

docker logs my_data_cloud-rag-engine-1 | tail -n 20


docker exec my_data_cloud-crm-1 wget -qO- --post-data '{"message": "Hello"}' --header="Content-Type: application/json" http://rag-engine:8000/agent/chat

