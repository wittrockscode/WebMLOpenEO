# node-backend

## Usage

### With Docker

1. Make sure Docker is installed on your system.
2. Navigate to the root of this project in your terminal.
3. Run the following command to build the Docker image:
   ```bash
   docker build -t node-backend .
4. Run the following command to run the application:
    ```bash
    docker run -p 3000:3000 --name node-backend node-backend
### Without Docker

1. Make sure node.js is installed on your system.
2. Navigate to the root of this project in your terminal.
3. Run the following command to install all dependencies:
   ```bash
   npm install
3. Run the following command to run the application:

   ```bash
   npm start