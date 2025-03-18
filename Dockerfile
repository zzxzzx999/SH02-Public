# Use an official Python runtime as a parent image
FROM python:3.12-alpine AS backend

# Set the working directory inside the container
WORKDIR /gap_project

# Copy the project files into the container
COPY gap_project /gap_project/

# Install system dependencies (for PostgreSQL support, uncomment if needed)
RUN apk update && apk add --no-cache gcc postgresql-dev

COPY gap_project/requirements.txt .

# run dependencies for postgresql db
RUN python -m venv /py && \
    /py/bin/pip install --upgrade pip && \
    apk add --update --upgrade --no-cache postgresql-client && \
    apk add --update --upgrade --no-cache --virtual .tmp\
    build-base postgresql-dev

# Install Python dependencies from requirements.txt
RUN pip install --no-cache-dir -r requirements.txt && apk del tpm

RUN pip install gunicorn

COPY . .
# Expose port 8000 for Django (instead of 80)
EXPOSE 8000

# Set environment variables (if needed)
# Adjust with your actual settings module
ENV DJANGO_SETTINGS_MODULE=gap_project.settings  
# Ensures logs are printed directly in Docker logs
ENV PYTHONUNBUFFERED=1  

# Run migrations and start Django server
CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && gunicorn --bind 0.0.0:8000 gap_project.wsgi:application"]
