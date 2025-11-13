# Use official Node.js LTS
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application
COPY . .

# Expose the port (matches your .env PORT)
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
