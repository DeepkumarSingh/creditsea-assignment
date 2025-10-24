# CreditSea Assignment - Credit Report Processor

A full-stack MERN application that processes XML credit report data from Experian, stores it in MongoDB, and presents it through a React frontend.

## Features

- XML credit report file upload and processing
- Detailed credit report visualization
- MongoDB data persistence
- RESTful API endpoints
- Responsive React frontend
- Error handling and validation

## Tech Stack

- **Frontend**: React, Material-UI
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Testing**: Jest

## Project Structure

```
creditsea/
├── backend/              <- Express backend
│   ├── controllers/      <- Route controllers
│   ├── middleware/       <- Express middleware
│   ├── models/          <- Mongoose models
│   ├── routes/          <- API routes
│   └── utils/           <- Utility functions
└── frontend/            <- React frontend
    ├── public/          <- Static files
    └── src/             <- React source code
        └── components/  <- React components
```

## Getting Started

### Prerequisites

- Node.js 
- MongoDB
- npm 

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd creditsea
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

4. Create a `.env` file in the backend directory with your MongoDB connection string:
   ```
   MONGO_URI=mongodb://localhost:27017/creditsea
   ```
    or
   Simply connect with your mongodb atlas database as connection string:
   mongodb+srv://<username>:<password>@cluster0.8y4dfjj.mongodb.net/?appName=Cluster0

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. In a new terminal, start the frontend:
   ```bash
   cd frontend
   npm start
   ```

3. Access the application at `http://localhost:3000`

## API Endpoints

- `POST /api/upload` - Upload and process XML file
- `GET /api/reports` - Get all credit reports
- `GET /api/reports/:id` - Get specific credit report

## Testing

Run backend tests:
```bash
cd backend
npm test
```

## Author

**Deep Kumar**
