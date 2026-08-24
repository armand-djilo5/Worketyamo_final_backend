# Worketyamo API

Worketyamo is a Node.js REST API for publishing internship and training offers and managing applications submitted for those offers.

The project follows a small, incremental backend approach:

- Express handles the HTTP API and routing.
- Prisma defines and accesses the MongoDB data model.
- Zod validates incoming data.
- JWT protects administrator operations.
- Cloudinary stores optional CV uploads.
- Nodemailer sends an email notification when a request is submitted.
- The phone and WhatsApp utilities normalize Cameroon phone numbers and build applicant contact links.

## Project Chronology

The implementation was built in these stages:

1. Prisma and the first database models were initialized, with administrator authentication and routes.
2. Offer creation, listing, update, deletion, validation, and admin authorization were added.
3. Request creation and management were added, together with Cameroon phone validation and WhatsApp links.
4. Email notification service was added for new applications.
5. Statistics endpoints were added for dashboard totals, grouping, top offers, and request history.
6. Cloudinary and Multer were added for optional CV uploads.

## Requirements

- Node.js with npm. Node.js 22 LTS is recommended.
- A MongoDB database.
- Cloudinary credentials if CV uploads are needed.
- An SMTP account if email notifications are needed.

## Installation

Clone the repository, enter the project directory, and install dependencies:

```bash
npm install
```

Create a `.env` file in the project root. Use your own values and never commit this file:

```env
PORT=3000
DATABASE_URL="your-mongodb-connection-string"

JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"

CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-sender@gmail.com"
EMAIL_PASS="your-gmail-app-password"
EMAIL_ADMIN="recipient@example.com"
DASHBOARD_URL="http://localhost:3000"
```

For Gmail, use a Google App Password rather than the normal account password. The App Password requires 2-Step Verification.

Generate the Prisma client and synchronize the MongoDB database:

```bash
npx prisma generate
npx prisma db push
```

This project uses MongoDB, so use `prisma db push` rather than SQL migration commands such as `prisma migrate dev`.

## Running the API

Development mode uses Nodemon:

```bash
npm run dev
```

Normal start:

```bash
npm start
```

The default local address is:

```text
http://localhost:3000
```

## API Overview

All API routes are prefixed with `/api`.

### Administrator authentication

| Method | Endpoint | Authentication |
| --- | --- | --- |
| POST | `/api/admin/signup` | Public |
| POST | `/api/admin/login` | Public |
| POST | `/api/admin/logout` | Refresh token |
| POST | `/api/admin/refresh` | Refresh token |

Login returns an access token. Use it for protected requests:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Offers

| Method | Endpoint | Authentication |
| --- | --- | --- |
| GET | `/api/offers` | Public |
| GET | `/api/offers/:id` | Admin |
| POST | `/api/offers` | Admin |
| GET | `/api/admin/offers` | Admin |
| PUT | `/api/offers/:id` | Admin |
| DELETE | `/api/offers/:id` | Admin |

Offer types are:

```text
STAGE
FORMATION
```

Example offer body:

```json
{
  "type": "STAGE",
  "title": "Web Development Internship",
  "domaine": "Development",
  "description": "Learn web development with our team.",
  "duration": "3 months"
}
```

### Requests

| Method | Endpoint | Authentication |
| --- | --- | --- |
| POST | `/api/requests` | Public |
| GET | `/api/requests` | Admin |
| GET | `/api/requests/:id` | Admin |
| PUT | `/api/requests/:id` | Admin |
| DELETE | `/api/requests/:id` | Admin |

Request creation uses `multipart/form-data` because a CV can be uploaded. The text fields are:

```text
offerId
fullName
email
phone
message
```

The optional file field is:

```text
cv
```

Accepted CV formats are PDF, DOC, and DOCX. The maximum file size is 5 MB. A request must reference an existing active offer. Its type is copied from that offer, and a notification email is sent after successful creation.

Example:

```bash
curl -X POST http://localhost:3000/api/requests \
  -F "offerId=YOUR_OFFER_UUID" \
  -F "fullName=John Doe" \
  -F "email=john@example.com" \
  -F "phone=612345678" \
  -F "message=I would like to apply for this offer." \
  -F "cv=@./cv.pdf"
```

Request statuses are:

```text
EN_ATTENTE
ACCEPTEE
REFUSEE
```

### Statistics

| Method | Endpoint | Authentication |
| --- | --- | --- |
| GET | `/api/stats` | Admin |
| GET | `/api/history` | Admin |

`/api/stats` returns total requests, request counts by status and type, active offers, acceptance rate, and the offer with the most requests. `/api/history` returns request counts grouped by year and month.

## Data Model

The Prisma schema contains three main models:

- `admin`: administrator credentials, role, phone, and refresh token.
- `offer`: internship or training offer details and active state.
- `request`: applicant information, selected offer, status, optional CV URL, and treatment dates.

The `offer` to `request` relationship is one-to-many. Deleting an offer cascades to its requests.

The generated Prisma client is located in `generated/prisma/` and is imported by `src/lib/prisma.js`.

## Source Structure

```text
server.js                         Application entry point
src/app.js                        Express application and route registration
src/routes/                       HTTP route definitions
src/controllers/                  Request handling and business flow
src/services/                     Email notification service
src/middleware/                   Admin authentication and file uploads
src/validators/                   Zod input schemas
src/utils/                        Phone and WhatsApp helpers
src/config/                       Cloudinary configuration
src/lib/prisma.js                 Prisma client instance
prisma/schema.prisma              MongoDB data model
generated/prisma/                 Generated Prisma client
```

## Verification Checklist

After configuration, verify the project in this order:

1. Run `npm run dev` and confirm the server listens on port 3000.
2. Create an administrator with `/api/admin/signup`.
3. Log in with `/api/admin/login` and copy the returned access token.
4. Create an offer with `/api/offers` using the token.
5. Submit a request with `/api/requests`, first without a CV and then with a small PDF.
6. Confirm the request exists in MongoDB and the email notification appears in the configured inbox.
7. Call `/api/stats` and `/api/history` with the admin token.
8. Update the request status and confirm `treatedAt` and the WhatsApp link are returned.

## Current Test Script

The `npm test` script is currently a placeholder and exits with an error. Verification is currently performed through the API with tools such as Postman or `curl`, together with Prisma and JavaScript syntax checks.

## Security Notes

- Keep `.env` out of version control.
- Never return administrator passwords in API responses.
- Use strong, separate JWT secrets.
- Use an SMTP App Password where required.
- Restrict Cloudinary and database credentials to the environments that need them.
