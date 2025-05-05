# Base image with Node.js
FROM node:23-alpine

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Build TypeScript files
RUN npm run build

# Expose the desired port
EXPOSE 4000

# Command to run the app
CMD ["node", "dist/index.js"]
