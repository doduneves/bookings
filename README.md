# Hotel Bookings API

This is a NestJS-based RESTful API for managing hotel bookings and rooming lists, using a PostgreSQL database.

## Getting Started
Follow these simple steps to set up and run the API.

1. Configure Environment Variables
Navigate into the api directory:

```
cd api
```

Create a .env file if it doesn't exist:
```
touch .env
```

Open .env and add your database and application configuration:

```
PORT=3001
DB_HOST=db
DB_PORT=5432
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=hotel_bookings
JWT_SECRET=your_jwt_secret_key_very_secret_and_long
```

2. Build and Run the Application
Navigate back to the project root directory (where docker-compose.yml is located):

```
cd ..
```

To build the Docker images, run database migrations, and start all services, execute:
```
docker-compose up --build
```

3. Access API Documentation

Once the API is running, you can test and explore the endpoints using the interactive Scalar documentation:

Open your browser and go to: http://localhost:3001/docs