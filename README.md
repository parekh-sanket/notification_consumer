Notification Consumer Service
This service consumes messages from Kafka and processes notifications. Follow the steps below to set up and run the application seamlessly.

1. Prepare Configuration
Before running the server, ensure your environment-specific configurations are in place:

Navigate to the config folder in the project directory.
Copy the appropriate configuration file (e.g., development.json) into the config folder.

2. Build and Run the Docker Container
Once the configuration is set, build and run the Docker container to start the server.

Automated Startup
Once the Docker container is running:

The application will connect to Kafka, MongoDB, and OpenSearch using the provided configurations.
Consumers will process Kafka messages and store or index data as required.