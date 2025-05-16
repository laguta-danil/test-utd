FROM node:20-alpine

WORKDIR /app

# Install netcat for database connection checking
RUN apk add --no-cache netcat-openbsd

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Make the entrypoint script executable
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

CMD ["./docker-entrypoint.sh"] 