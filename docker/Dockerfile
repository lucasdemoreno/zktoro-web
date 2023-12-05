FROM python:3.8

WORKDIR /usr/src/app

COPY . .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Define the default script name as an environment variable
ENV SCRIPT_NAME=example.py

# Run the script when the container launches
CMD ["python", "./${SCRIPT_NAME}.py"]