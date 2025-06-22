# Use a Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN yarn run build

# Expose the port the app runs on
EXPOSE 3001

# Default command (will be overridden by docker-compose for dev)
CMD ["sh", "-c", "yarn run migration:run && yarn run start:prod"]