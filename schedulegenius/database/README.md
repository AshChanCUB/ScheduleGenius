# Final-Project-ScheduleGenius

## Introduction
This repository contains the configuration files and instructions for setting up a PostgreSQL database using Docker and Kubernetes. This setup is ideal for development and testing environments.

## Prerequisites
Before you begin, ensure you have the following installed:
- Docker with Kubernetes enabled
- kubectl (Kubernetes command-line tool)


## Initial Setup

### 1. Start Kubernetes Cluster

### 2. Change the hostPath in postgres-pv.yaml to the /data/postgres on your machine

Ex: 
```bash
  hostPath:
    path: /mnt/c/Users/dm7ross/final-project-schedulegenius/data/postgres
```


### 2. Apply Kubernetes Configurations
```bash
kubectl apply -f hostpath-storageclass.yaml
kubectl apply -f postgres-pv.yaml
kubectl apply -f postgres-pvc.yaml
kubectl apply -f postgres-deployment.yaml
kubectl apply -f postgres-service.yaml
```

## Running with Docker Compose

### First-Time Use
To start the PostgreSQL database for the first time, navigate to the directory containing docker-compose.yml and run:

```bash
docker-compose up -d
```

### Subsequent Uses
To start the services after the initial setup, run the same command:

```bash
docker-compose up -d
```
### Connect to database on local machine
default password is postgres

```bash
psql -h localhost -p 5433 -U postgres
```

### Stopping the Services
```bash
docker-compose down
```

To remove volume containers
```bash
docker-compose down -v
```

## Data Persistence
Data in PostgreSQL is persisted through Docker volumes and Kubernetes PVs. These ensure that your data remains intact across container restarts and even after the containers themselves are removed.

## Troubleshooting
If you encounter any issues, check the logs of your Docker containers or Kubernetes pods:
```bash
docker logs [container_id]
kubectl logs [pod_name]
```