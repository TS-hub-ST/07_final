# Movie Review App

This project is a simple movie review application built with a Node.js backend, a Next.js frontend, and a MySQL database. The application allows users to add movie reviews, view all reviews in a table, and delete existing reviews. The project is containerized using Docker and can be deployed automatically using Jenkins.

## Features

- Add new movie reviews with:
  - Movie name
  - Detail / description
  - Cover image URL
  - Rating
  - Release year

- Display all movie reviews in a responsive table
- Delete any review directly from the UI
- Backend API built with Express
- Frontend built with Next.js
- MySQL database with sample movie records
- Dockerized services using Docker Compose
- Jenkins pipeline for automated build and deployment

## Project Structure

```text
root
│
├── 01_api/               # Backend (Node.js + Express)
│   ├── index.js
│   ├── package.json
│   ├── Dockerfile
│   └── ...
│
├── 02_frontend/          # Frontend (Next.js)
│   ├── app/page.js
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
│   └── ...
│
├── init.sql              # Database initialization (creates movie table)
├── docker-compose.yml    # Docker services configuration
├── Jenkinsfile           # CI/CD pipeline
└── README.md
```

## Technologies Used

### Backend

- Node.js
- Express
- MySQL
- mysql2

### Frontend

- Next.js (App Router)
- React
- CSS (custom global styles)

### DevOps

- Docker
- Docker Compose
- Jenkins
- phpMyAdmin

## Development Workflow Overview

The typical workflow for this project is:

1. Develop and test locally (backend and frontend with Node.js and Next.js).
2. Dockerize the application using Dockerfiles and `docker-compose.yml`.
3. Use Jenkins (running on port 8080) to automatically:
   - Build Docker images
   - Start containers with Docker Compose
   - Run health checks
   - Verify that the deployment is successful


## Local Development (Without Docker)

### Requirements

- Node.js (v18+ recommended)
- MySQL
- Git

### 1. Clone the repository

```bash
git clone https://github.com/TS-hub-ST/07_final
```

### 2. Set up the database

Create a database named `last_dit312` and run `init.sql` manually, or execute the SQL content inside it in your MySQL client.

### 3. Backend setup

```bash
cd 01_api
npm install
```

Create a `.env.local` file in `01_api`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=last_dit312
DB_USER=root
DB_PASSWORD=yourpassword
PORT=3002
```

Start the backend:

```bash
node index.js
```

API will be available at:

- http://localhost:3002/health
- http://localhost:3002/movies

### 4. Frontend setup

```bash
cd ../02_frontend
npm install
```

Create a `.env.local` file in `02_frontend`:

```env
NEXT_PUBLIC_API_HOST=http://localhost:3002
```

Start the frontend:

```bash
npm run dev
```

Frontend will be available at:

- http://localhost:3000

## Running With Docker (Docker Compose)

This project includes a Docker Compose configuration that starts:

- MySQL database
- phpMyAdmin
- Backend API (Express)
- Frontend (Next.js)

### 1. Environment file


```env
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_DATABASE=last_dit312
MYSQL_USER=attractions_user
MYSQL_PASSWORD=your_db_password
MYSQL_PORT=3306
PHPMYADMIN_PORT=8888
API_PORT=3002
DB_PORT=3306
FRONTEND_PORT=3000
NODE_ENV=production
API_HOST=http://api:3002
```

### 2. Start all services

From the project root:

```bash
docker compose up --build -d
```

### 3. Access services

- Frontend:     http://localhost:3000
- Backend API:  http://localhost:3002
- phpMyAdmin:   http://localhost:8888
- MySQL:        localhost:3306 (from host)

### 4. Stop services

```bash
docker compose down
```

If I also want to remove volumes (clear database):

```bash
docker compose down -v
```

## Database Information

The database schema and sample data are defined in `init.sql` and are automatically applied when MySQL starts (via Docker).

### Table: movie

| Column       | Type         | Description               |
|--------------|--------------|---------------------------|
| id           | int, PK, AI  | Primary key               |
| name         | varchar(191) | Movie name                |
| detail       | varchar(191) | Short description/review  |
| coverimage   | varchar(191) | URL of cover image        |
| rating       | double       | Movie rating              |
| release_year | double       | Year of release           |

12 sample movie records are inserted on first run.

## API Endpoints

Base URL (local Docker): `http://localhost:3002`

### GET /movies

Returns all movie records.

Response example:

```json
[
  {
    "id": 1,
    "name": "Inception",
    "detail": "A mind-bending sci-fi thriller about dreams within dreams.",
    "coverimage": "https://example.com/inception.jpg",
    "rating": 8.8,
    "release_year": 2010
  }
]
```

### POST /movies

Creates a new movie review.

Request body example:

```json
{
  "name": "Inception",
  "detail": "A sci-fi thriller",
  "coverimage": "https://example.com/inception.jpg",
  "rating": 8.8,
  "release_year": 2010
}
```

### DELETE /movies/:id

Deletes a movie review by its ID.

## Jenkins Deployment

Jenkins is used to automate build and deployment using the `Jenkinsfile` in the repository.  
Typical Jenkins URL on your machine:

- Jenkins: http://localhost:8080

### What Jenkins does in this project

The pipeline defined in `Jenkinsfile` has these main stages:

1. Checkout  
   - Pulls the latest code from the Git repository.  
   - Prints build number and short commit hash.

2. Validate  
   - Runs `docker compose config` to validate the `docker-compose.yml` file.

3. Prepare Environment  
   - Reads credentials from Jenkins (for MySQL root and user passwords).  
   - Generates a `.env` file in the project root with values such as:
     - `MYSQL_ROOT_PASSWORD`
     - `MYSQL_DATABASE=last_dit312`
     - `MYSQL_USER=attractions_user`
     - `MYSQL_PASSWORD`
     - `API_PORT=3002`
     - `FRONTEND_PORT=3000`
     - `API_HOST` (used by the frontend to connect to the API)

4. Deploy  
   - Runs `docker compose down` (and optionally `down -v` if you choose to clear volumes).  
   - Builds fresh Docker images: `docker compose build --no-cache`.  
   - Starts all services in the background: `docker compose up -d`.

5. Health Check  
   - Waits a short time for containers to start.  
   - Checks running containers with `docker compose ps`.  
   - Calls `http://localhost:3002/health` repeatedly until it succeeds or times out.  
   - Calls `http://localhost:3002/movies` to verify the API endpoint is working.

6. Verify Deployment  
   - Prints container status.  
   - Prints the last 20 lines of logs from all services.  
   - Shows URLs:
     - Frontend: http://localhost:3000
     - API: http://localhost:3002
     - phpMyAdmin: http://localhost:8888

### Jenkins Parameters and Environment

The pipeline defines:

- `CLEAN_VOLUMES` (boolean): if true, `docker compose down -v` is used and the database is cleared.  
- `API_HOST`: the URL the frontend should use to connect to the API. For example:
  - `http://192.168.56.1:3002`

Jenkins also needs credentials:

- `MYSQL_ROOT_PASSWORD` (string credential)  
- `MYSQL_PASSWORD` (string credential for the database user)

These are injected into the `.env` file during the "Prepare Environment" stage.

## How to Use Jenkins With This Project (Summary)

1. Install Jenkins and open it at http://localhost:8080.
2. Install required plugins (Git, Docker, etc.).
3. Configure Jenkins credentials:
   - `MYSQL_ROOT_PASSWORD`
   - `MYSQL_PASSWORD`
4. Create a new Pipeline job:
   - Point it to your Git repository (the one containing this project and Jenkinsfile).
5. Run the Pipeline:
   - Jenkins will clone the repo, generate `.env`, build Docker images, start containers, and run health checks.
6. After a successful build:
   - Frontend: http://localhost:3000
   - API: http://localhost:3002
   - phpMyAdmin: http://localhost:8888

Whenever I push new changes to the repository, Jenkins can automatically re-deploy the updated version by re-running the pipeline.

## Author

Thant Sin Linn
6610301