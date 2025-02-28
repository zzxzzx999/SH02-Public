services:
    backend:
        image: ${DOCKER_USERNAME}/gordon-foley:backend
    build:
        context: 
        dockerfile: DockerFile
    container_name: backend
    ports:
        - "8000:8000"
    enviroment:
        - DB_NAME=${DB_NAME}
        - DB_USER=${DB_USER}
        - BD_PASSWORD=${DB_PASSWORD}
        - DB_HOST = ${DB_HOST}
    depends_on:
        -DB_HOST
    command: [
        "sh",
        "-c",
        "python manage.py makemigrations 
        && pyhton manage.py migrate
        && python populate.py
        && gunicorn --bind 0.0.0:8000 name?"
    ]

frontend:
    image: ${DOCKER_USERNAME}/gordon-foley:frontend
    container_name: frontend
    build:
        context: ?
        dockerfile: DockerFile
        args:
            REACT_APP_BACKEND_URL: ${BACKEND_URL}
            REACT_APP_FRONTEND_URL: ${FRONTEND_URL}
    ports:
        - "3000:80"
    depends_on:
        - backend

db:
    image: postgres:15
    restart: unless-stopped
    container_name: backend_db
    ports:
        - 5432
    
    environment:
        - POSTGRES_DB=${DB_NAME}
        - POSTGRES_USER=${DB_USER}
        - POSTGRES_PASSWORD=${DB_PASSWORD}
    healthcheck:
        - test: {"CMD", "pg_isready", "-q", "-d", "${DB_NAME}", "-U", "{DB_USER}"}
        - interval : 5s
        - timeout: 5s
        - retries: 5

    volumes:
        - postgres_data:/var/lib/postgresql/postgres_data