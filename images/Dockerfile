FROM python:3.8

WORKDIR /usr/src/app

ARG SCRIPT_NAME
ENV SCRIPT_NAME $SCRIPT_NAME

COPY ./$SCRIPT_NAME/. .
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Run the script when the container launches
CMD ["python", "./+"$SCRIPT_NAME+".py"]

#docker build --build-arg SCRIPT_NAME=08e82b83-daae-45dc-a358-e0584a9b80cd -t zktoro/08e82b83-daae-45dc-a358-e0584a9b80cd 08e82b83-daae-45dc-a358-e0584a9b80cd
  #await execa("docker", ["build", "-t", imageName, "docker-files/."]);
#docker build -t zktoro/08e82b83-daae-45dc-a358-e0584a9b80cd 08e82b83-daae-45dc-a358-e0584a9b80cd/.
#docker build -t zktoro/08e82b83-daae-45dc-a358-e0584a9b80cd 08e82b83-daae-45dc-a358-e0584a9b80cd/. --build-arg SCRIPT_NAME=08e82b83-daae-45dc-a358-e0584a9b80cd