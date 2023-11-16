# Base Image - Use official Node.js Alpine image from the Dockerhub
FROM node:14-alpine

# Create a app directory in Docker
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files to Docker app directory
COPY package*.json ./

# Install NPM packages in Docker
RUN npm install

# Copy all other files to Docker app directory
COPY . .

CMD [ "node", "index.js" ]