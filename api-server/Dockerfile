# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install deps
COPY package*.json ./
RUN npm install

# Copy rest of code
COPY . .

# Expose port 
EXPOSE 3000

# Start server
CMD ["node", "app.js"]
