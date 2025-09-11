# PDF Invoice Extractor Dashboard

This is a full-stack application built for the Flowbit Private Limited internship assignment. It allows users to upload PDF invoices, view them in the browser, and use the Gemini AI API to extract structured data. The extracted data can then be edited and managed with full CRUD functionality.

The project is structured as a monorepo using pnpm workspaces, with a Next.js frontend and a Node.js (Express) backend.

## Live Links

- **Web Application:** https://flowbit-assignment-web.vercel.app/
- **API Endpoint:** https://flowbit-assignment-api.vercel.app/

## Tech Stack

- **Monorepo:** pnpm workspaces
- **Frontend (apps/web):** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend (apps/api):** Node.js, Express, TypeScript
- **Database:** MongoDB Atlas
- **AI:** Google Gemini API (gemini-1.5-flash) and groq API (llama-3.1-8b-instant)
- **PDF Viewer:** react-pdf (utilizing pdf.js)
- **Deployment:** Vercel

## Core Features

- **PDF Viewer:** Upload local PDFs (≤25 MB) and render them in a zoomable, navigable viewer.
- **AI Data Extraction:** Extract key invoice data (vendor, invoice details, line items) with a single click using Gemini.
- **CRUD Operations:** Create, Read, Update, and Delete invoice records stored in MongoDB.
- **Invoice List & Search:** View all saved invoices in a table with real-time search by vendor name or invoice number.
- **Separate Frontend/Backend:** Clear separation of concerns between the Next.js client and the Node.js API.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- Node.js (v18 or later)
- pnpm package manager (`npm install -g pnpm`)
- MongoDB Atlas account and a connection string
- Google AI Studio account to get a Gemini API Key

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone [Link to your GitHub repo]
   cd [repo-name]
   ```
2. **Install dependencies from the root directory:**
   ```bash
   pnpm install
   ```
3. **Set up Environment Variables:**
   - Create a `.env` file in the `apps/api` directory (`apps/api/.env`) and add:
     ```env
     MONGODB_URI="your_mongodb_atlas_connection_string"
     LOCAL_MONGO_URI=mongodb://localhost:27017/
     NODE_ENV=development
     LOCAL_FRONTEND_URL=http://localhost:3000
     FRONTEND_URL=
     GEMINI_API_KEY="your_gemini_api_key"
     GROQ_API_KEY="your_groq_endpoint"
     BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"
     PORT=4000
     ```
   - Create a `.env.local` file in the `apps/web` directory (`apps/web/.env.local`) and add:
     ```env
     NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1"
     ```
     _(Note: The default port for the API is 4000)_
4. **Run the applications:**
   - From the root directory, start both the backend and frontend together:
     ```bash
     pnpm run dev
     ```
   - The API will be running at http://localhost:4000 and the web app at http://localhost:3000.

## API Documentation

The API provides the following REST endpoints.

### `POST /upload`

Uploads a PDF file and stores it.

- **Request:** `multipart/form-data` with a `file` field.
- **Success Response (201):**
  ```json
  {
    "fileId": "65f1c3b1d3e2a1b1c8f8d3a1",
    "fileName": "sample-invoice.pdf",
    "fileUrl": "https://<your-blob-storage>/sample-invoice.pdf"
  }
  ```

### `POST /extract`

Extracts data from an already uploaded PDF using an AI model.

- **Request Body:**
  ```json
  {
    "fileUrl": "https://<your-blob-storage>/sample-invoice.pdf",
    "model": "groq"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "vendor": {
      "name": "Innovate Tech Inc.",
      "address": "...",
      "taxId": "..."
    },
    "invoice": {
      "number": "INV-2025-001",
      "date": "Sep 10, 2025",
      "currency": "USD",
      "subtotal": 500.0,
      "taxPercent": 8,
      "total": 540.0,
      "poNumber": "PO-98765",
      "poDate": "Sep 01, 2025",
      "lineItems": [
        {
          "description": "Cloud Server Hosting",
          "unitPrice": 300,
          "quantity": 1,
          "total": 300
        }
      ]
    }
  }
  ```

### `GET /invoices`

Retrieves a list of all invoices. Supports searching via a query parameter.

- **Query Parameter:** `?q=<search_term>` (searches by `vendor.name` and `invoice.number`)
- **Success Response (200):**
  ```json
  [
    {
      "_id": "65f1c3b1d3e2a1b1c8f8d3a1",
      "fileName": "sample-invoice.pdf",
      "vendor": { "name": "Innovate Tech Inc." },
      "invoice": { "number": "INV-2025-001" },
      "createdAt": "2025-09-12T12:00:00.000Z"
    }
  ]
  ```

### `GET /invoices/:id`

Retrieves a single invoice by its ID.

- **Success Response (200):** A full invoice object.

### `PUT /invoices/:id`

Updates an existing invoice with new data.

- **Request Body:** A partial or full invoice object.
- **Success Response (200):** The updated invoice object.

### `DELETE /invoices/:id`

Deletes an invoice by its ID.

- **Success Response (200):**
  ```json
  {
    "message": "Invoice deleted successfully"
  }
  ```
