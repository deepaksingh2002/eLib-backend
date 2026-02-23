# eLibServer

A TypeScript + Express backend for an eBook platform with JWT auth, MongoDB storage, and Cloudinary file hosting for book covers and PDF files.

## Tech Stack
- Node.js
- TypeScript
- Express 5
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Multer (multipart upload)
- Cloudinary (file hosting)

## Prerequisites
- Node.js 18+
- npm
- MongoDB connection string
- Cloudinary account credentials

## Environment Variables
Create a `.env` file in the project root.

Required variables:
- `PORT`
- `MONGO_CONNECTION_STRING`
- `NODE_ENV`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `FRONTEND_DOMAIN`

> Note: `.env.sample` exists but currently does not include `JWT_SECRET`. Add it in your local `.env`.

## Installation
```bash
npm install
```

## Running the Server
Development:
```bash
npm run dev
```

Build:
```bash
npm run build
```

Production:
```bash
npm start
```

Default server URL:
- `http://localhost:3000` (unless `PORT` is set)

## API Base URL
- `/api/v1`

## Endpoints
### Health
- `GET /`
  - Response: welcome message.

### Users
- `POST /api/v1/users/register`
  - Body (JSON):
    - `name`
    - `email`
    - `password`
  - Response: `{ accessToken }`

- `POST /api/v1/users/login`
  - Body (JSON):
    - `email`
    - `password`
  - Response: `{ accessToken }`

### Books
- `POST /api/v1/books` (Auth required)
  - Headers:
    - `Authorization: Bearer <token>`
  - Content-Type: `multipart/form-data`
  - Fields:
    - `title` (text)
    - `description` (text)
    - `genre` (text)
    - `coverImage` (file)
    - `file` (PDF file)

- `PATCH /api/v1/books/:bookId` (Auth required)
  - Headers:
    - `Authorization: Bearer <token>`
  - Content-Type: `multipart/form-data`
  - Supports updating text fields and/or replacing files.

- `GET /api/v1/books`
  - Returns all books (author name populated).

- `GET /api/v1/books/:bookId`
  - Returns one book by id.

- `DELETE /api/v1/books/:bookId` (Auth required)
  - Deletes the book if owned by the authenticated user.

## Authentication
Pass JWT token in header:
```http
Authorization: Bearer <accessToken>
```

## Project Structure
```text
src/
  app.ts
  index.ts
  config/
  middlewares/
  user/
  books/
public/
  data/uploads/    # temporary multer upload storage
```

## Notes
- Book cover and PDF files are uploaded to Cloudinary.
- Temporary local uploads are deleted after successful upload.
- Global error responses include `errorStack` only when `NODE_ENV=development`.
