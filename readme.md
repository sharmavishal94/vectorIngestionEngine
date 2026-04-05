# Project 
- Status: New

This Project is an attmpt to create my own Ingestion Engine
1. It runs using postgres to store Vector Embedding.
2. Using Airflow DAGs for scheduling

# Below are the commands

docker-compose up -d
docker ps -a
docker-compose down
docker-compose down --volumes --remove-orphans 
- My data will also go.

To Run Postgres
docker compose exec postgres psql -U airflow -d data_cloud

\dt *.*

## CRM (Next.js, `app` schema)

Contacts are stored in Postgres schema **`app`** (not `raw`). `raw.*` remains the Airflow landing zone.

- **Docker:** `docker compose up -d crm` then open [http://localhost:3000](http://localhost:3000).
- **Local dev:** `cd crm && cp .env.example .env.local && npm install && npm run dev` (needs Postgres up; use `DATABASE_URL` pointing at `localhost:5432`).
- **Fresh Postgres volume:** `./db/init` runs on first init. Existing volumes:  
  `docker compose exec -T postgres psql -U airflow -d data_cloud -f /docker-entrypoint-initdb.d/01-app-schema.sql`  
  (or rely on CRM server startup, which runs the same DDL via `instrumentation`).


# vectorIngestionEngine



UXhVCVaCZeTEGNUF

docker exec -it my_data_cloud-airflow-webserver-1 cat /opt/airflow/simple_auth_manager_passwords.json.generated


https://github.com/godatadriven/data-pipelines-with-airflow-2nd-ed/tree/master


docker-compose up -d --build crm