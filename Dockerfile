# Use the official Node.js image as the base image
FROM node:22

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (for both backend and frontend dependencies)
COPY package.json package-lock.json ./

# Install root-level dependencies (if any)
RUN npm install

# Copy and install backend dependencies
COPY ./server/package.json ./server/package-lock.json ./server/
RUN npm install --prefix ./server

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
EXPOSE 3000

# Set the entry point to start the backend server
CMD ["node", "server/app.js"]