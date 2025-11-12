# WeLoveMovies API (Backend)

This is the backend server for the **WeLoveMovies** application, a project built as part of a backend development curriculum.

This project implements a RESTful API to handle data requests for movies, theaters, and reviews. It is built with **Node.js**, **Express**, and **Knex.js**, connecting to a **PostgreSQL** database.

## 🚀 Live Links
- **Frontend Github:**  https://github.com/Ying-Fiona-Zhou/starter-movie-front-end
- **Backend API (Deployed):** <https://welovemovies-end.onrender.com>
- **Frontend Application (Deployed):** <https://welovemovies-front-s9t5.onrender.com>

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Query Builder:** Knex.js
- **Deployment:** Render

## 📡 API Endpoints

The API provides the following main routes:

### 🎬 Movies

- `GET /movies` – Retrieves a list of all movies.
- `GET /movies/:movieId` – Retrieves the details for a single movie.
- `GET /movies/:movieId/theaters` – Retrieves all theaters playing a specific movie.
- `GET /movies/:movieId/reviews` – Retrieves all reviews for a specific movie.

### 🎭 Theaters

- `GET /theaters` – Retrieves a list of all theaters (including the movies playing at each).

### ✍️ Reviews

- `PUT /reviews/:reviewId` – Updates a specific review.
- `DELETE /reviews/:reviewId` – Deletes a specific review.

## 🏁 Getting Started Locally

To run this project on your local machine:

### 1. Clone the Repository
```bash
git clone https://github.com/Ying-Fiona-Zhou/Welovemovies_end.git
cd Welovemovies_end
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Environment Variables

Create a .env file in the project root and add:
```bash
DATABASE_URL="postgresql://postgres@localhost/postgres"
# If needed, you can also specify:
# PORT=5001
```

### 4. Run Database Migrations and Seeds
```bash
# Run migrations (creates the table structure)
npx knex migrate:latest

# Run seeds (adds sample data to the tables)
npx knex seed:run
```

### 5. Start the Development Server
```bash
# Starts the server with nodemon for auto-reloading
npm run start:dev
```