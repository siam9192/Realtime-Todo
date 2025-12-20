# Collaborative Task Manager

## Table of Contents
- [Live Links & Demo Login](#live-links--demo-login)
- [Used Technologies](#used-technologies)
- [Setup Instructions](#setup-instructions)
- [API Contract](#api-contract)
- [Architecture Overview & Design Decisions](#architecture-overview--design-decisions)
- [Socket.IO Integration](#socketio-integration)
- [Testing](#testing)
- [Bonus Challenges](#bonus-challenges)
- [Extra Features Implemented](#extra-features-implemented)
- [Trade-offs & Assumptions](#trade-offs--assumptions)

---

## Live Links & Demo Login

### Live Applications
- **Frontend:** [https://task-manager-client.up.railway.app](https://task-manager-client.up.railway.app)
- **Backend:** [https://task-manager-server.up.railway.app](https://task-manager-server.up.railway.app)

### Demo Accounts
If you prefer not to create a new account, you can use the following demo credentials:

- **Demo User 1**
  - Username: `demouser1`
  - Password: `123456`
- **Demo User 2**
  - Username: `demouser2`
  - Password: `123456`

---

## Used Technologies

| Category           | Technologies |
|-------------------|--------------|
| Frontend          | React, TypeScript, Vite, Tailwind CSS, DaisyUI, React Router DOM, React Query, Socket.IO Client |
| Backend           | Node.js, Express.js, TypeScript, Prisma ORM, PostgreSQL, Socket.IO |
| Authentication    | JWT (Access & Refresh Tokens) |
| Validation        | Zod |
| Testing           | Jest |
| DevOps / Deployment | Railway |
| Tools             | Git, GitHub, Prettier |

---

## Setup Instructions

### Clone the Repository
```bash
git clone https://github.com/siam9192/Collaborative-TaskManager.git

```
### Backend

#### Setup Environment Variables

Create a `.env` file in the root folder of the project and update it with your own values:

```bash
ENVIRONMENT="Development" # or "Production"
DATABASE_URL=your_postgres_db_url
JWT_ACCESS_TOKEN_SECRET=your_access_token_secret
JWT_REFRESH_TOKEN_SECRET=your_refresh_token_secret
JWT_ACCESS_TOKEN_EXPIRE=2d
JWT_REFRESH_TOKEN_EXPIRE=30d
CLIENT_ORIGIN="client url"

```
```bash
cd project-name/backend

# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Start the backend server
npm run dev
```

### Frontend
```bash
cd ../frontend
npm install
npm run dev 
```

#### Setup Environment Variables

Create a `.env` file in the root folder of the project and update it with your own values:


```bash

# Application environment: Development or Production
VITE_ENVIRONMENT="Development"

# Backend API URLs
VITE_BACKEND_BASE_URL_DEV="local server URL for development"
VITE_BACKEND_BASE_URL_PROD="deployed server URL for production" # Optional for development

# Backend Socket.IO URLs
VITE_BACKEND_SOCKET_BASE_URL_DEV="local server URL for development"
VITE_BACKEND_SOCKET_BASE_URL_PROD="deployed server URL for production" # Optional for development

```
## API Contract

This document describes the API endpoints for the project.

| Method | Endpoint                       | Description                              |
| ------ | ------------------------------ | ---------------------------------------- |
| POST   | `/api/auth/login`              | Login user                               |
| POST   | `/api/auth/register`           | Register new user                        |
| GET    | `/api/auth/accesstoken`        | Get new access token using refresh token |
| GET    | `/api/users/me`                | Get current logged-in user               |
| GET | `/api/users/visible` | Get users whose account status is **active** (accessible only to authenticated users) |
| PUT    | `/api/users/me`                | Update current user profile              |
| GET    | `/api/tasks/created`           | Get all tasks created by the user        |
| GET    | `/api/tasks/assigned`          | Get all tasks assigned to the user       |
| GET    | `/api/tasks/overdue`           | Get all overdue tasks                    |
| POST   | `/api/tasks`                   | Create a new task                        |
| PUT    | `/api/tasks/:id`               | Update task                              |
| DELETE | `/api/tasks/:id`               | Delete task                              |
| GET    | `/api/notifications`           | Get current user notifications           |
| PATCH  | `/api/notifications/mark-read` | Mark all unread notifications as read    |

## Architecture Overview & Design Decisions

#### Backend

- **Prisma ORM with PostgreSQL**: PostgreSQL was chosen as the database because Prisma is highly recommended for this assessment, and I am currently most comfortable working with PostgreSQL using Prisma.
- **Backend Request Flow**:  
  Receive request → Authorize user for protected routes → Validate request body using Zod (where required) → Controller → Service (business logic) → Repository (database CRUD operations) → Service returns result → Controller → Response sent to the client via HTTP or Socket.IO where applicable.

  This layered architecture keeps controllers thin and maintainable while centralizing business logic in services and database operations in repositories.
- **JWT Authentication**: Uses access and refresh tokens to securely authenticate users on each request.

#### Frontend

- **Protected Routes**:  
  Fetch current user → Verify authentication status → Allow or restrict access to protected pages accordingly.
  
- **How Real-Time Task CRUD Works**:  
  Send a CRUD HTTP request to the server → After successful processing, the server emits Socket.IO events based on the operation (e.g., `task:created`, `task:assigned`, `task:updated`, `task:unassigned`, `task:deleted`, `notification:new`) → Clients listen to these       events and trigger appropriate actions such as refetching data or updating the UI in real time.

## Socket.IO Integration

Socket.IO is used in this project to provide **real-time updates** for tasks and notifications. The workflow is designed to ensure that only authenticated users receive relevant updates and that connections are properly managed. Here's how it works step by step:

1. **Authenticate User**  
   When a user connects to the Socket.IO server, their authentication token is verified. This ensures that only valid and logged-in users can establish a socket connection. Unauthorized users are denied access to real-time events.

2. **Save Connection Info**  
   Once authenticated, the user's connection information (such as their `socket.id`) is stored in a global variable  using a **Setter function**. This store keeps track of all active user connections. The stored connections can later be accessed from anywhere in the backend using a **Getter function**, making it easy to target specific users when emitting events.

3. **Emit Events**  
   Whenever a task is created, updated, or deleted, the backend emits real-time events to the relevant connected users. By checking the stored connection information, the server can ensure that each user receives updates only for tasks that concern them. This allows for live updates in the frontend without needing to refresh the page or poll the server continuously.

4. **Cleanup**  
   When a user disconnects (e.g., closes the browser or loses connection), their socket connection information is removed from the global store using a **removal function**. This keeps the in-memory store clean and prevents unnecessary memory usage or attempts to send events to disconnected users.

5. **Benefits**  
   - Ensures secure real-time communication by authenticating users before connection.  
   - Efficiently manages multiple user connections in a centralized store.  
   - Provides instant updates to the frontend, improving user experience for task management and notifications.


## Testing

The following services and logic are covered with unit tests in backend:

- **Task Service**
  - `createTask`
  - `updateTask`
- **Task Update Effects**
  - `resolveTaskUpdateEffects` (logic only)
- **User Service**
  - `createUser`
  - `updateUser`

#### How to Run Tests

Run all tests using the following command:

```bash
npm run jtest
```

## Bonus Challenges
- **Task Status Update Logs:**  
  Every time a user updates a task, the change is saved as a log in the database. This allows tracking of task history and changes over time.  
  **Note:** Currently, there is no API endpoint to fetch these logs, so they are stored for internal tracking or future use.
  
## Extra Features Implemented
- **Flexible Task Assignment:** Users can create tasks without assigning them to anyone initially. They can later assign or remove users through the update form.  
- **Controlled Task Updates:** Assigned users can update almost all properties of a task, while unassigned users are restricted from making any updates.  
- **Logout Functionality:** Users can securely log out, ensuring their sessions are safely terminated.  

## Trade-offs & Assumptions
- Currently, user socket connections are stored in an in-memory variable. This works well for small-scale applications, but for larger-scale apps, this approach may consume a lot of memory. To handle a large number of concurrent connections efficiently, a proper caching mechanism (like Redis) would be recommended.
