# the-movie-app-be

Welcome to our movie application, where we dive deep into the world of cinema and bring you concise and comprehensive summaries of your favorite films.

The Movie App is a website project, where we will build the API list and database based on The Movie Database.

Users can see the list of popular, now-playing, and top-rated films all over the world. They also can find their exciting films by searching and filtering their favorite genres.

Besides that users can add a movie to their favorite list, leave comments, and vote for films after enjoying them.

## User Stories

### Authentication

-   [x] As a user, I can register for a new account with name, email and password.
-   [x] As a user, I can sign in with my email and password.

### Users

-   [x] As a user, I can get my current profile info (stay signed in with refreshing page).
-   [x] As a user, I can update my profile info (name)

### Comments

-   [x] As a user, I can see a list of comments on a film.
-   [x] As a user, I can write comments on a film.
-   [x] As a user, I can update my comments.
-   [x] As a user, I can delete my comments.

### Rating

-   [x] As a user, I can rate to a film (up to 10 stars).
-   [x] As a user, I can see a list of my rated movies.

### Favorite

-   [x] As a user, I can add a film to my favorite movie list.
-   [x] As a user, I can see a list of my favorite movies.

### Movies

-   [x] As a user, I can see a list of popular, now-playing, and top-rated films.
-   [x] As a user, I can search a film by name and filter them by genre.
-   [x] As a user, I can see the film detail.
-   [x] As a user, I can see the official trailer of a film.

## Endpoint APIs

Please refer [API Endpoints](docs/api.endpoints.md) in document for more info mation

## Installation

-   Please refer `.env.example` and add a new `.env` file in the same root.
-   Run: `npm install` to install all packages and dependencies.
-   Run: `npm run dev`
    The server is running on the port you set in `.env` for now.
