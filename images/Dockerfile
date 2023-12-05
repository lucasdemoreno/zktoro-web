FROM python:3.8

WORKDIR /usr/src/app

ARG SCRIPT_NAME
ENV SCRIPT_NAME $SCRIPT_NAME

COPY ./$SCRIPT_NAME/. .
COPY ./requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Run the script when the container launches
CMD ["python", "./+"$SCRIPT_NAME+".py"]
