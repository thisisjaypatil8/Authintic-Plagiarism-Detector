# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /code

# Copy the requirements file into the container
COPY ./requirements.txt /code/requirements.txt

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the rest of your app's source code from your host to your container
COPY . /code/

# Expose the port the app runs on
EXPOSE 5001

# Run app.py when the container launches
CMD ["gunicorn", "--bind", "0.0.0.0:5001", "app:app"]