# 🌱 AgriSmart Server

AgriSmart Server is the backend infrastructure for the **AgriSmart** platform, an AI-powered agriculture solution designed to empower farmers with real-time data, community support, and intelligent farm management tools.

This API handles authentication, market data analysis, community interactions, farm planning, and AI-driven insights to support the AgriSmart client application.

🔗 **Client Repository:** [AgriSmart Client](https://github.com/themahabur/AgriSmart)  
🚀 **Live Application:** [AgriSmart Live](https://agri-smart-silk.vercel.app/)

---

## 🚀 Features

- **🔐 User Authentication**: Secure manual login (JWT) and Google OAuth integration.
- **🌾 Farm Management**: Create, update, and manage farm profiles and tasks.
- **📊 Market Intelligence**: Real-time tracking and fetching of market prices for crops.
- **🤖 AI Integration**: AI-powered suggestions and historical data analysis (likely leveraging Gemini).
- **📚 Knowledge Hub**: A repository of agricultural articles with like and bookmark functionality.
- **💬 Community & Social**: Discussion forums, comments system, post interactions, and private messaging.
- **📈 Dashboard & Activity**: Comprehensive dashboard stats and recent user activity tracking.
- **📝 Tasks & Planning**: Farm task management system for efficient operations.

---

## 🛠 Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: `jsonwebtoken`, `bcryptjs`, `google-auth-library`
- **Utilities**: `axios`, `dotenv`, `node-cron`
- **Deployment**: Configured for deployment on Vercel.

---

## 📋 Prerequisites

Ensure you have the following installed locally:

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- A [MongoDB](https://www.mongodb.com/atlas/database) Atlas connection string or local MongoDB instance.

---

## ⚙️ Installation & Setup

1.  **Clone the Repository** (if not already done):
    ```bash
    git clone https://github.com/themahabur/AgriSmart-Server.git
    cd agri-smart-server
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    Create a `.env` file in the root directory and add the following variables:

    ```env
    PORT=5000
    DB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/agrismart?retryWrites=true&w=majority
    JWT_SECRET=your_super_secret_jwt_key
    GOOGLE_CLIENT_ID=your_google_oauth_client_id
    NODE_ENV=development
    ```

4.  **Run the Server**:
    *   **Development Mode**:
        ```bash
        npm run dev
        ```
    *   **Production Start**:
        ```bash
        npm start
        ```

    The server will start at `http://localhost:5000` (or your defined PORT).

---

## 🔌 API Endpoints Usage

The base URL for the API is `http://localhost:5000/api`.

### 👤 User Management
*   `POST /api/users/register` - Register a new user
*   `POST /api/users/login` - Login user
*   `GET /api/users/profile` - Get user profile

### 🌾 Farm & Tasks
*   `GET /api/farms/:email` - Get farms by user email
*   `POST /api/farms` - Create a new farm
*   `PUT /api/farms/:id` - Update farm details
*   `GET /api/farm-tasks/:email` - Get tasks for a user
*   `POST /api/farm-tasks` - Create a farm task

### 🏪 Market
*   `GET /api/market` - Get market data
*   `POST /api/market/update` - Trigger market data update

### 📚 Knowledge Hub
*   `GET /api/knowledge-hub` - Get all articles
*   `GET /api/knowledge-hub/slug/:slug` - Get article by slug
*   `POST /api/knowledge-hub/:id/like` - Like an article
*   `POST /api/knowledge-hub` - Create content (Protected)

### 🤖 AI Features
*   `POST /api/ai-suggestions` - Get AI-driven farming suggestions
*   `GET /api/ai-history` - View history of AI interactions

### 💬 Community
*   `GET /api/community` - Get community posts
*   `POST /api/messages` - Send a message

*(Note: This is a summary. Please refer to the route files in `src/router` for full details.)*

---

## 📂 Project Structure

```
├── src
│   ├── config        # Database configuration
│   ├── controller    # specific business logic for requests
│   ├── middleware    # Auth and other middleware
│   ├── module        # Mongoose Data Models
│   ├── router        # API Route definitions
│   └── utils         # Helper functions (JWT, etc.)
├── server.js         # Entry point
└── package.json      # Dependencies and scripts
```

---

## 🤝 Contributing

Contributions are welcome!
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/NewFeature`).
3.  Commit your changes (`git commit -m 'Add NewFeature'`).
4.  Push to the branch (`git push origin feature/NewFeature`).
5.  Open a Pull Request.

---
