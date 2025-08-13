# 🍽️ Recipe Book Backend

This is the **backend** for the Recipe Book application — a platform where users can **sign up, log in, add recipes, like recipes, and manage their own submissions**.  
The backend provides secure **RESTful APIs** for authentication, recipe management, and user interactions.

---

## ✨ Features

### 🔐 Authentication
- **User registration & login** with JWT-based authentication.
- Passwords securely hashed using `bcrypt`.
- Protected routes accessible only to logged-in users.

### 📜 Recipe APIs
- **Add a Recipe** (authenticated users only).
- **Edit a Recipe** (only by the recipe's owner).
- **Delete a Recipe** (only by the recipe's owner).
- **Get All Recipes** with author details and like count.
- **Get My Recipes** — only recipes created by the logged-in user.

### ❤️ Likes System
- **Like a recipe**.
- **Unlike a recipe**.
- Keep track of total likes per recipe.

---


