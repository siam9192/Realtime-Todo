#  Collaborative Task Manager


## Table of Contents

- [Setup Instructions](#setup-instructions)
- [API Contract](#api-contract)
- [Architecture Overview & Design Decisions](#architecture-overview--design-decisions)
- [Socket.IO Integration](#socketio-integration)
- [Bonus Challenges](#bonus-challenges)
- [Extra Features Implemented](#extra-features-implemented)
- [Trade-offs & Assumptions](#trade-offs--assumptions)

- [Trade-offs & Assumptions](#trade-offs--assumptions)

---

## Setup Instructions

### Backend

#### Setup environment variables:

Create a .env file in the root folder:


```bash
# Update the .env file with your own values:
ENVIRONMENT="Development" # or "Production"
DATABASE_URL=your_postgres_db_url
JWT_ACCESS_TOKEN_SECRET=your_access_token_secret
JWT_REFRESH_TOKEN_SECRET=your_refresh_token_secret
JWT_ACCESS_TOKEN_EXPIRE=2d
JWT_REFRESH_TOKEN_EXPIRE=30d
CLIENT_ORIGIN=http://localhost:5173
```
```bash
# Clone the repository
git clone https://github.com/yourusername/project-name.git
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

#### Setup environment variables:

Create a .env file in the root folder:


```bash
# Update the .env file with your own values

VITE_ENVIRONMENT="Development" # or "Production"

VITE_BACKEND_BASE_URL_DEV="http://localhost:5000/api"
VITE_BACKEND_BASE_URL_PROD="https://your-deployed-backend-url.com/api" (optional for development mode)

CLIENT_ORIGIN="http://localhost:5173" # replace with your frontend URL

```
## API Contract

This document describes the API endpoints for the project.

| Method | Endpoint                       | Description                              |
| ------ | ------------------------------ | ---------------------------------------- |
| POST   | `/api/auth/login`              | Login user                               |
| POST   | `/api/auth/register`           | Register new user                        |
| GET    | `/api/auth/accesstoken`        | Get new access token using refresh token |
| GET    | `/api/users/me`                | Get current logged-in user               |
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

- **Node.js + Express**: Provides REST API endpoints for the application.
- **Prisma ORM with PostgreSQL**: I choose PostgreSQL as database because prisma is Highly Recommended in this assesment and at present i feal comfortable with prostgresql in prisma.
- **Service Layer**: Contains business logic, keeping controllers thin and maintainable,respository for database CRUD operations.
- **JWT Authentication**: Uses access and refresh tokens with every request  for secure user authentication 


#### Frontend

- **React + Vite + Tailwind + DaisyUI**: Lightweight and fast frontend setup with modern styling.  
- **React Query**: Efficiently manages server state, caching, and data fetching.  
- **Socket.IO Client**: Enables real-time updates for tasks and notifications, keeping the UI in sync without manual refresh.


## How Socket.IO Works

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
     
## Bonus Challenges
- **Task Status Update Logs:**  
  Every time a user updates a task, the change is saved as a log in the database. This allows tracking of task history and changes over time.  
  **Note:** Currently, there is no API endpoint to fetch these logs, so they are stored for internal tracking or future use.
  
### Extra Features Implemented
- **Flexible Task Assignment:** Users can create tasks without assigning them to anyone initially. They can later assign or remove users through the update form.  
- **Controlled Task Updates:** Assigned users can update almost all properties of a task, while unassigned users are restricted from making any updates.  
- **Logout Functionality:** Users can securely log out, ensuring their sessions are safely terminated.  

### Trade-offs & Assumption
- Currently, user socket connections are stored in an in-memory variable. This works well for small-scale applications, but for larger-scale apps, this approach may consume a lot of memory. To handle a large number of concurrent connections efficiently, a proper caching mechanism (like Redis) would be recommended.

