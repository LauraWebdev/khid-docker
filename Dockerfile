# Use the official Node.js image as the base image
FROM node:22

# Set working directory
WORKDIR /usr/src/app/server

# Copy and install backend dependencies
COPY ./server/package.json ./server/package-lock.json ./
RUN npm install
COPY ./server ./

# Build and install Vue frontend
WORKDIR /usr/src/app/ui
COPY ./ui/package.json ./ui/package-lock.json ./
RUN npm install
COPY ./ui ./
RUN npm run build

# Move built Vue frontend to backend's public directory
WORKDIR /usr/src/app
RUN mkdir -p server/public
RUN cp -r ui/dist/* server/public

# Set working directory back to root
WORKDIR /usr/src/app

# Expose the backend server port
EXPOSE 8080

# Set the entry point to start the backend server
CMD ["node", "server/app.js"]