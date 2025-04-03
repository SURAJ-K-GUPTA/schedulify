# Schedulify

Schedulify is a web application that allows users to schedule emails to be sent at a specified time using **Agenda** and **Nodemailer**.

## Project Structure

```
Schedulify/
├── backend/   # Node.js backend with Express Agenda and Nodemailer
├── frontend/  # React frontend
```

---

## Backend Setup

### Prerequisites
- Node.js installed
- MongoDB instance (local or cloud)

### Installation
1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the backend root folder and add:
   ```sh
   JWT_SECRET="your_jwt_secret"
   MONGO_URI="your_mongodb_uri"
   EMAIL_USER="your_email@example.com"
   EMAIL_PASS="your_email_password"
   ```
4. Start the backend server:
   ```sh
   npm start
   ```
   The backend should be running on `http://localhost:8080`.

---

## Frontend Setup

### Prerequisites
- Node.js installed

### Installation
1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the frontend root folder and add:
   ```sh
   VITE_API_URL=http://localhost:8080
   ```
4. Start the frontend application:
   ```sh
   npm start
   ```
   The frontend should be running on `http://localhost:5173`.

---

## API Endpoints

### Schedule an Email
**Endpoint:** `POST /api/schedule`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer your_jwt_token"
  }
  ```
- **Request Body:**
  ```json
  {
    "email": "recipient@example.com",
    "subject": "Email Subject",
    "emailBody": "Your email content here",
    "time": "in 1 hour"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Email scheduled successfully",
    "jobId": "unique_job_id"
  }
  ```

### Register a New User
**Endpoint:** `POST /api/auth/register`
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- **Response:**
  ```json
  {
    "token": "jwt_token"
  }
  ```

### Authenticate a User
**Endpoint:** `POST /api/auth/login`
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- **Response:**
  ```json
  {
    "token": "jwt_token"
  }
  ```

---

## Run Both Backend and Frontend Together
If you want to run both frontend and backend simultaneously, you can use **concurrently**:
1. Install concurrently:
   ```sh
   npm install -g concurrently
   ```
2. Run both services:
   ```sh
   concurrently "cd backend && npm start" "cd frontend && npm start"
   ```

Now your backend and frontend will run together!

---

## License
MIT

