# Use an official Python runtime as a parent image

FROM python:3.12-slim

# Set the working directory inside the container
WORKDIR /gap_project

# Copy the project files into the container
COPY . /gap_project/

# Install system dependencies (for PostgreSQL support, uncomment if needed)
RUN apt-get update && apt-get install -y gcc libpq-dev

# Install Python dependencies from requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 8000 for Django (instead of 80)
EXPOSE 8000

# Set environment variables (if needed)
# Adjust with your actual settings module
ENV DJANGO_SETTINGS_MODULE=myproject.settings  
# Ensures logs are printed directly in Docker logs
ENV PYTHONUNBUFFERED=1  

# Run migrations and start Django server
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
