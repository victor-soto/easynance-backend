# Base image
FROM node:20-slim

# Create app directory
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY --chown=node package*.json ./

# Install app dependencies
RUN npm ci

# Bundle app source
COPY --chown=node . .

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
