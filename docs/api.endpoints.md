## Endpoint APIs

### Auth APIs

```javascript
/**
 * @route POST /auth/login
 * @description Login with username and password
 * @body {email, password}
 * @access Public
 */
```

### User APIs

```javascript
/**
 * @route POST /users
 * @description Register a new user
 * @body {name, email, password}
 * @access Public
 */
```

```javascript
/**
 * @route GET /users/me
 * @description Get current user info
 * @access Login required
 */
```

```javascript
/**
 * @route PUT /users/me
 * @description Update a user profile
 * @body {name}
 * @access Login required
 */
```

```javascript
/**
 * @route PUT /users/changepassword
 * @description Change password
 * @body {email, currentPassword, newPassword}
 * @access Login required
 */
```

### Movie APIs

```javascript
/**
 * @route GET /movies/:movieType
 * @description Get all movies of a specific type with pagination (Popular, incoming, top rated) allow search by name
 * @access Public
 */
```

```javascript
/**
 * @route GET /movies/favorite/:userId?page=1&limit=10
 * @description Get all FAVORITE movies of an user with pagination
 * @access Login required
 */
```

```javascript
/**
 * @route GET /movies/:id
 * @description Get a single film
 * @access Public
 */
```

```javascript
/**
 * @route GET /movies/:id/comments
 * @description Get comments of a post
 * @access Public
 */
```

### Comment APIs

```javascript
/**
 * @route POST /comments
 * @description Create a new comment
 * @body {content, movieId}
 * @access Login required
 */
```

```javascript
/**
 * @route GET /comments/:id
 * @description Get detail of a comment
 * @access Login required
 */
```

```javascript
/**
 * @route PUT /comments/:id
 * @description Update a comment
 * @access Login required
 */
```

```javascript
/**
 * @route DELETE /comments/:id
 * @description Delete a comment
 * @access Login required
 */
```

### Reaction APIs

```javascript
/**
 * @route POST /reactions
 * @description Save a reaction to film
 * @body {movieId, emoji: 'like' or 'dislike'}
 * @access Login required
 */
```
