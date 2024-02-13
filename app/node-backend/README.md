# node-backend

## Usage

### With Docker

1. Make sure Docker is installed on your system.
2. Navigate to the ``/WebMLOpenEO/app/node-backend`` in your terminal.
3. Run the following command to build the Docker image:
   ```bash
   docker build -t node-backend .
4. Run the following command to run the application:
    ```bash
    docker run -p 3000:3000 --name node-backend node-backend
### Without Docker

1. Make sure node.js is installed on your system.
2. Navigate to ``/WebMLOpenEO/app/node-backend`` in your terminal.
3. Run the following command to install all dependencies:
   ```bash
   npm install
4. Run the following command to run the application:

   ```bash
   npm start

## Testing

### Test all

1. Make sure node.js is installed on your system.
2. Navigate to ``/WebMLOpenEO/app/node-backend`` in your terminal.
3. Run the following command to install all dependencies:
   ```bash
   npm install
4. Run the following command to test the application:

   ```bash
   npm test

> Attention! As this app is heavily dependent on the R-backend, 6 out of 14 tests will fail if the R-backend is not accessible. To start it, please refer to its README.

### Single Test

1. Make sure node.js is installed on your system.
2. Navigate to ``/WebMLOpenEO/app/node-backend`` in your terminal.
3. Run the following command to install all dependencies:
   ```bash
   npm install
4. Run the following command to execute a single test "xyz.test.js":

   ```bash
   npm test <xyz>