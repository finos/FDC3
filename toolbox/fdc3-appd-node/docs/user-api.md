# User API Documentation

The User API provides endpoints for managing users in the system. It supports user authentication, authorization, CRUD operations, and user approval workflows.

## Authorization Roles

The following roles have different levels of access to the API endpoints:

| Endpoint | Method | Path | Authorized Roles | Description |
|----------|--------|------|------------------|-------------|
| User Login | POST | `/users/login` | All users | Authenticate user and get token |
| Get User by ID | GET | `/users/id/:userId` | All authenticated users | Retrieve user details by ID |
| Approve User | PATCH | `/users-approve` | admin | Approve or reject user registration requests|
| Bulk Delete Users | DELETE | `/users/bulk` | admin | Delete multiple users by email |
| Create User | POST | `/v1/users` | Public | Submit a request to register new user |
| Get All Users | GET | `/v1/users` | admin | Retrieve all users |
| Get User by Email | GET | `/v1/users/{email}` | All authenticated users | Retrieve user details by email |
| Update User by Email | PATCH | `/v1/users/{email}` | admin, editor | Update user details by email |
| Delete User by Email | DELETE | `/v1/users/{email}` | admin | Delete user by email |

## Endpoint Details

### User Login

- **Path**: `/users/login`
- **Method**: POST
- **Authorization**: None required
- **Description**: Authenticate user and generate access token
- **Request Body**:

  ```json
  {
    "email": "user@example.com",
    "password": "userPassword"
  }
  ```

- **Success Response**:
  - Status: 200
  - Returns: User details and authentication token
- **Error Cases**:
  - 400: Email doesn't exist
  - 400: Invalid password
  - 500: Server error

### Get User by ID

- **Path**: `/users/id/:userId`
- **Method**: GET
- **Authorization**: Requires authentication
- **Description**: Retrieve user details by MongoDB ObjectId
- **Features**:
  - Password excluded from response
  - MongoDB ObjectId validation
- **Response Fields**:
  - _id
  - name
  - email
  - role (user, admin, editor, desktopAgent)
  - status (active, inactive)
  - age
  - createdAt
  - updatedAt

### User Approval

- **Path**: `/users-approve`
- **Method**: PATCH
- **Authorization**: admin only
- **Description**: Approve or reject user registrations
- **Request Body**:

  ```json
  {
    "email": "user@example.com",
    "approval": "accepted" | "rejected"
  }
  ```

- **Actions**:
  - Accept: Sets status to "active"
  - Reject: Deletes the user
- **Transaction Support**: Yes
- **Error Cases**:
  - 400: Missing email or approval
  - 400: Invalid approval value
  - 404: User not found
  - 500: Transaction/Server error

### Bulk Delete Users

- **Path**: `/users/bulk`
- **Method**: DELETE
- **Authorization**: admin only
- **Description**: Delete multiple users by their email addresses
- **Request Body**:

  ```json
  {
    "emails": ["user1@example.com", "user2@example.com"]
  }
  ```

- **Features**:
  - Transaction support
  - Batch deletion
  - Deletion count in response
- **Error Cases**:
  - 400: Invalid email list
  - 500: Transaction/Server error

### Create User (Sign Up)

- **Path**: `/v1/users`
- **Method**: POST
- **Authorization**: None required
- **Description**: Register a new user in the system. Users are created with inactive status by default and are required to be approved by an admin before they can login.
- **Request Body**:

  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "strongP@ssw0rd123",
    "role": "user"  // Optional, defaults to "user"
  }
  ```

- **Success Response**:
  - Status: 201
  - Returns:

    ```json
    {
      "_id": "60d3b41ef3g2c4d5e6f7a8b9",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "user",
      "status": "inactive",
      "token": "jwt_token_string"
    }
    ```

- **Error Cases**:
  - 400: Missing required fields
  - 409: User with email already exists
  - 500: Server error
- **Features**:
  - Password hashing
  - Transaction support
  - Initial status set to "inactive"
  - JWT token generation

### Get All Users

- **Path**: `/v1/users`
- **Method**: GET
- **Authorization**: admin only
- **Description**: Retrieve all users
- **Response Fields**:
  - count: Number of users
  - users: Array of user objects (excluding passwords)
- **Error Cases**:
  - 401: Unauthorized
  - 403: Forbidden
  - 500: Server error

### Get User by Email

- **Path**: `/v1/users/{email}`
- **Method**: GET
- **Authorization**: Requires authentication
- **Description**: Retrieve user details by email
- **Response Fields**:
  - _id
  - name
  - email
  - role
  - status
  - age
  - createdAt
  - updatedAt
- **Error Cases**:
  - 404: User not found
  - 500: Server error

### Update User by Email

- **Path**: `/v1/users/{email}`
- **Method**: PATCH
- **Authorization**: admin, editor
- **Description**: Update user details by email
- **Request Body**:

  ```json
  {
    "name": "John Smith",
    "role": "editor",
    "age": 35,
    "status": "active"
  }
  ```

- **Success Response**:
  - Status: 200
  - Returns: Updated user details
- **Error Cases**:
  - 400: Invalid updates
  - 404: User not found
  - 500: Server error

### Delete User by Email

- **Path**: `/v1/users/{email}`
- **Method**: DELETE
- **Authorization**: admin only
- **Description**: Delete user by email
- **Success Response**:
  - Status: 200
  - Returns: Deleted user details
- **Error Cases**:
  - 404: User not found
  - 500: Server error

## Common Features Across Endpoints

1. **Authentication**:
   - Most endpoints require Bearer token authentication
   - Token generated during login
   - Token validation on protected routes

2. **Error Handling**:
   - 400: Bad Request / Validation Errors
   - 401: Unauthorized (missing/invalid token)
   - 403: Forbidden (insufficient role)
   - 404: Resource Not Found
   - 500: Server Error

3. **Transaction Support**:
   - Used in critical operations (approval, bulk delete)
   - Automatic rollback on failure
   - Ensures data consistency

4. **Response Format**:

   ```json
   // Success Response
   {
     "message": "Operation successful",
     "data": { ... }
   }

   // Error Response
   {
     "error": "Error message",
     "details": "Detailed error information"
   }
   ```

5. **Security Features**:
   - Password hashing (bcrypt)
   - Role-based access control
   - Token-based authentication
   - Password excluded from responses

## Best Practices

1. Always include authentication token in protected routes
2. Use appropriate content-type headers (application/json)
3. Handle all possible error responses
4. Validate input data before processing
5. Use transactions for critical operations

## User Roles and Permissions

- **admin**: Full access to all endpoints
- **editor**: Limited administrative access
- **user**: Basic access to non-administrative features
- **desktopAgent**: Special role for desktop applications, Desktop agent, or Launchers.

## Data Models

### User Schema

| Field | Type | Description |
|-------|------|-------------|
| id | MongoDB ObjectId | Unique identifier |
| name | string | User's full name |
| email | string | Unique email address |
| password | string | Bcrypt hashed password |
| role | enum | One of: 'user', 'admin', 'editor', 'desktopAgent' |
| status | enum | One of: 'active', 'inactive' |
| age | number | User's age |
| createdAt | date | Timestamp of creation |
| updatedAt | date | Timestamp of last update |
