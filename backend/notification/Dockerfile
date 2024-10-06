# Use an official Python runtime as the base image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    g++ \
    python3-dev \
    libgdal-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install GDAL
RUN export CPLUS_INCLUDE_PATH=/usr/include/gdal \
    && export C_INCLUDE_PATH=/usr/include/gdal \
    && pip install GDAL==`gdal-config --version`

# Define environment variables
ENV GOOGLE_ACCOUNT_EMAIL=Nasagogogogo@gmail.com
ENV GOOGLE_ACCOUNT_PASSWORD=tjlfenbpqvvrbnzn

# Make sure the entrypoint script is executable
RUN chmod +x /app/entrypoint.sh

# Set the entrypoint script as the entrypoint for the container
ENTRYPOINT ["/app/entrypoint.sh"]