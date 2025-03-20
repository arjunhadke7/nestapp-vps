# Use a Node.js base image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install NestJS CLI globally (Important)
RUN npm install -g @nestjs/cli

# Copy the rest of the application code
COPY . .

# Build the NestJS app
RUN npm run build

# Expose port (match what's in docker-compose)
EXPOSE 3006

# Start the application
CMD ["npm", "run", "start:prod"]