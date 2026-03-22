from airflow import DAG
from airflow.providers.common.sql.operators.sql import SQLExecuteQueryOperator
from datetime import datetime

with DAG('ingest_customer_data', start_date=datetime(2026, 1, 1), schedule='@daily', catchup=False) as dag:

    # 1. Create Raw Landing Tables
    create_tables = SQLExecuteQueryOperator(
        task_id='create_raw_tables',
        conn_id='postgres_default',
        sql="""
            CREATE SCHEMA IF NOT EXISTS raw;
            CREATE TABLE IF NOT EXISTS raw.web_users (email TEXT, signup_date DATE, device_id TEXT);
            CREATE TABLE IF NOT EXISTS raw.crm_contacts (email TEXT, full_name TEXT, phone TEXT);
        """
    )

    # 2. Mock Ingestion (In real life, use PythonOperator or Airbyte here)
    load_mock_data = SQLExecuteQueryOperator(
        task_id='load_data',
        conn_id='postgres_default',
        sql="""
            INSERT INTO raw.web_users VALUES ('jane@example.com', '2026-03-01', 'web-123');
            INSERT INTO raw.crm_contacts VALUES ('jane@example.com', 'Jane Doe', '+1-555-0101');
        """
    )

    create_tables >> load_mock_data