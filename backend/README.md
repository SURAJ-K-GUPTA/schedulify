# Schedulify

## How to Use

1. Clone the repository:
   ```sh
   git clone https://github.com/SURAJ-K-GUPTA/schedulify.git
   ```
2. Navigate to the project directory:
   ```sh
   cd schedulify
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Set up environment variables by creating a `.env` file in the root directory and adding:
   ```sh
   JWT_SECRET="your_jwt_secret"
   MONGO_URI="your_mongodb_uri"
   EMAIL_USER="your_email@example.com"
   EMAIL_PASS="your_email_password"
   ```

## How to Run

1. Start the MongoDB server if it's not running.
2. Run the application:
   ```sh
   npm run dev
   ```
3. The server should be running at `http://localhost:8080` by default.

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
