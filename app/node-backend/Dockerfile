FROM node:18

# Copy app code source our local folder into the docker /app working directory
COPY . /app

# Set the /app directory as working directory
WORKDIR /app

# Install app dependencies
RUN npm install

# Expose app on a given port
EXPOSE 3000

# Start app
ENTRYPOINT ["npm", "start"]