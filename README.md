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
FE_PORT=5173
DB_HOST=db
DB_PORT=5432
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=hotel_bookings
JWT_SECRET=your_jwt_secret_key_very_secret_and_long
```

2. Build the Application
Navigate back to the project root directory (where docker-compose.yml is located):

```
cd ..
```

To build the Docker images, run database migrations, and start all services, execute:
```
docker-compose up --build
```

## Running the Frontend APP

The app will be running on `http://localhost:5173/` (or change the port to FE_PORT set on .env)

To request the backend API correctly, you need to create a `/frontend/.env` file with the configurations:
```
VITE_API_BASE_URL=http://localhost:3001 (the same port you set to backedn api on root .env)
```
![image](https://github.com/user-attachments/assets/6efc7dd7-2940-4db6-844b-e7d5e7b827d9)
![image](https://github.com/user-attachments/assets/4d7a7fec-1d37-47a9-a443-ae6993575fd9)


## Back-End

Once the API is running, you can test and explore the endpoints using the interactive Scalar documentation:

Open your browser and go to: http://localhost:3001/docs (or whatever the PORT you've set on environment)
![image](https://github.com/user-attachments/assets/0bf5cce5-b2af-4f2e-a330-8e9ca9b12daf)

To run the authenticated endpoint you must set some env variables on ./api/.env:

```
SEED_USERNAME=user
SEED_USERPASSWORD=password
SEED_USEREMAIL=email
```

And run the Users Seeds on the API Docs

### Testing

You can run the Unit Tests just running the script below, inside `api` folder:
```
yarn test
```
