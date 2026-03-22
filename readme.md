# Project 
- Status: New

This Project is an attmpt to create my own Ingestion Engine
1. It runs using postgres to store Vector Embedding.
2. Using Airflow DAGs for scheduling


# Below are the commands



docker-compose up -d
docker ps -a
docker-compose down --volumes --remove-orphans
docker compose exec postgres psql -U airflow -d data_cloud

\dt *.*


# vectorIngestionEnginr
