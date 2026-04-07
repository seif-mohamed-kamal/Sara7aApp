# SARA7A APP

## Backend RESTful API for Anonymous Messaging Platform

---

## OVERVIEW

Sara7a App enables users to receive anonymous messages securely with support for authentication, email verification, file uploads, and token-based security.

The project follows a modular architecture with clear separation of concerns, making it scalable and maintainable.

---

## FEATURES

* JWT Authentication (Access & Refresh Tokens)
* Send anonymous messages with optional attachments
* Receive and manage messages
* Email confirmation and password reset (OTP and link)
* Token rotation system
* File upload (profile image, cover images, message attachments)
* Redis integration for token/session handling
* Request validation middleware
* Encryption and hashing utilities

---

## AUTHENTICATION SYSTEM

Uses Access and Refresh Tokens.

Token logic is handled inside:

* `common/utils/security/token.security.js`

### Flow

1. User signs up or logs in
2. Server generates tokens
3. Protected routes require:

```bash
Authorization: Bearer <token>
```

---

## API ENDPOINTS

### AUTH MODULE (/auth)

| Method | Endpoint                         | Description                 |
| ------ | -------------------------------- | --------------------------- |
| POST   | /auth/signup                     | Register user               |
| POST   | /auth/signup/gmail               | Signup using Google         |
| POST   | /auth/login                      | Login user                  |
| PATCH  | /auth/confirmEmail               | Confirm email using OTP     |
| PATCH  | /auth/resendOtp                  | Resend confirmation OTP     |
| POST   | /auth/forgetpassword             | Send OTP for password reset |
| PATCH  | /auth/verify-forget-password-otp | Verify OTP                  |
| PATCH  | /auth/reset-password             | Reset password              |

---

### USER MODULE (/user)

| Method | Endpoint                       | Description               |
| ------ | ------------------------------ | ------------------------- |
| GET    | /user/                         | Get logged-in profile     |
| GET    | /user/share-profile/:userId    | Public profile            |
| GET    | /user/rotate-token             | Generate new access token |
| PATCH  | /user/upload/profile-picture   | Upload profile image      |
| PATCH  | /user/upload/cover-picture     | Upload cover images       |
| PATCH  | /user/update-password          | Update password           |
| POST   | /user/logout                   | Logout user               |
| POST   | /user/foreget-password-by-link | Send reset link           |
| POST   | /user/reset-password-by-link   | Reset password via link   |
| DELETE | /user/delete-unconfirmed-users | Delete unconfirmed users  |

---

### MESSAGE MODULE (/message)

| Method | Endpoint             | Description                               |
| ------ | -------------------- | ----------------------------------------- |
| POST   | /message/:recieverId | Send message (anonymous or authenticated) |
| GET    | /message/list        | Get all messages                          |
| GET    | /message/:messageId  | Get single message                        |
| DELETE | /message/:messageId  | Delete message                            |

---

## FOLDER STRUCTURE

```bash
code/
└── src/
    ├── common/
    │   ├── enums/
    │   ├── service/
    │   └── utils/
    │       ├── mailer/
    │       ├── multer/
    │       ├── response/
    │       └── security/
    │
    ├── DB/
    │   ├── model/
    │   ├── repository/
    │   ├── connection.db.js
    │   └── redis.connection.db.js
    │
    ├── middleware/
    │   ├── auth.middleware.js
    │   ├── validation.middleware.js
    │
    ├── modules/
    │   ├── auth/
    │   ├── user/
    │   └── message/
    │
    ├── app.bootstrap.js
    └── main.js
```

---

## ARCHITECTURE

### Modular Structure

Each feature is isolated into its own module (auth, user, message)

---

## SOLID PRINCIPLE

Single Responsibility Principle is applied:

* Each file handles one clear responsibility (controller, service, validation, middleware)

---

## TECH STACK

* Node.js
* Express.js
* MongoDB
* Mongoose
* Redis
* JWT
* Multer
* NodeMailer
* JOI

---

## RUN PROJECT

```bash
npm i
npm run start:dev --------> for development
npm run start:prod --------> for production

```

---

## ENVIRONMENT VARIABLES

```env
PORT=3000
DB_URI=your_mongodb_uri
JWT_SECRET=your_secret
REDIS_URL=your_redis_url
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

---

## NOTES

* Supports OTP and link-based password reset
* Messages support attachments
* Token system includes rotation and security handling
* Scalable and production-ready structure

---

## AUTHOR

ENG/Seif Mohamed
