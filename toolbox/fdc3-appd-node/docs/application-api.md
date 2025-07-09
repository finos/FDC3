# Application API Documentation

The Application API provides endpoints for managing applications in the system. It supports CRUD operations, searching, versioning, and approval workflows for applications.

## Authorization Roles

The following roles have different levels of access to the API endpoints:

| Endpoint | Method | Path | Authorized Roles | Description |
|----------|--------|------|------------------|-------------|
| Update Application | PATCH | `/v2/apps/:appId` | admin, editor | Update application details |
| Delete Application | DELETE | `/v2/apps/:appId` | admin | Delete an application |
| Search Applications | POST | `/v1/apps/search` | All authenticated users | Search applications using multiple criteria |
| Initialize Apps | POST | `/v2/apps/initialize` | user, admin, editor, appDConsumer | Initialize sample applications (dev only) |
| Search by Intent | GET | `/v2/apps/intents/:intentName` | user, admin, editor, appDConsumer | Find applications by intent name |
| Approve Application | PATCH | `/applications/approve` | admin | Approve or reject application |
| Get Versions | GET | `/v2/apps/:appId/versions` | All authenticated users | Get all versions of an application |

## Endpoint Details

### Update Application

- **Path**: `/v2/apps/:appId`
- **Method**: PATCH
- **Authorized Roles**: admin, editor
- **Description**: Update specific fields of an application
- **Updatable Fields**:
  - title
  - description
  - version
  - categories
  - icons
  - screenshots
  - contactEmail
  - supportEmail
  - moreInfo
  - publisher
  - details
  - intents
- **Transaction Support**: Yes
- **Validation**: Checks for allowed update fields

### Delete Application

- **Path**: `/v2/apps/:appId`
- **Method**: DELETE
- **Authorized Roles**: admin only
- **Description**: Permanently delete an application
- **Transaction Support**: Yes

### Search Applications

- **Path**: `/v1/apps/search`
- **Method**: POST
- **Description**: Search applications using multiple criteria
- **Search Criteria**:
  - appId (partial match)
  - version
  - title (partial match)
  - description (partial match)
  - categories (array match)
- **Features**:
  - Case-insensitive search
  - Partial matching
  - Multiple criteria support
  - Validation warnings
  - Search criteria echo in response

### Initialize Applications

- **Path**: `/v2/apps/initialize`
- **Method**: POST
- **Description**: Initialize system with sample applications
- **Restrictions**: Not available in production environment
- **Purpose**: Development and testing

### Search by Intent

- **Path**: `/v2/apps/intents/:intentName`
- **Method**: GET
- **Description**: Find applications that support specific intents
- **Features**:
  - Case-insensitive intent name matching
  - Optional context filtering
  - Support for multiple contexts

### Application Approval

- **Path**: `/applications/approve`
- **Method**: PATCH
- **Description**: Approve or reject application submissions
- **Actions**:
  - Accept: Sets status to "active"
  - Reject: Deletes the application
- **Transaction Support**: Yes

### Version Management

- **Path**: `/v2/apps/:appId/versions`
- **Method**: GET
- **Description**: Retrieve all versions of an application
- **Features**:
  - Version sorting (descending)
  - Basic application info
  - Version history
  - Status tracking

## Common Features Across Endpoints

1. **Authentication**:
   - All endpoints require authentication via Bearer token

2. **Error Handling**:
   - 400: Bad Request / Validation Errors
   - 401: Unauthorized
   - 403: Forbidden (Role-based)
   - 404: Not Found
   - 500: Server Error

3. **Transaction Support**:
   - Critical operations are wrapped in transactions
   - Automatic rollback on failure

4. **Response Format**:
   - Consistent JSON response structure
   - Detailed error messages
   - Operation status messages
   - Validation warnings where applicable

5. **Data Validation**:
   - Input validation for all endpoints
   - Field-specific validation rules
   - Proper error messages for invalid inputs

## Best Practices

1. Always include authentication token
2. Check response for validation warnings
3. Handle all possible HTTP status codes
4. Use appropriate roles for different operations
5. Consider using search criteria for efficient queries

## User Roles and Permissions

- **admin**: Full access to all endpoints
- **editor**: Limited administrative access
- **user**: Basic access to non-administrative features
- **desktopAgent**: Special role for desktop applications

## Data Models

### Application Schema

| Field | Type | Description |
|-------|------|-------------|
| appId | string | Unique identifier for the application (letters, numbers, hyphens, and underscores only) |
| title | string | Application title (2-100 characters) |
| description | string | Detailed description of the application (up to 1000 characters) |
| version | string | Application version (format: major.minor.patch) |
| intents | array | List of intents supported by the application, each defined by the Intent schema |
| categories | array | Categories of the application, stored in uppercase |
| icons | array | List of icon objects, each with a `src` (URL) and `size` (e.g., '32x32') |
| screenshots | array | List of screenshot objects, each with a `src` (URL) and `label` (description) |
| contactEmail | string | Contact email for the application |
| supportEmail | string | Support email for the application |
| moreInfo | string | URL for additional information about the application |
| publisher | string | Name of the application publisher |
| details | object | Additional details, including a `url` for the application |
| status | enum | Application status, one of: 'active', 'inactive' (default: 'inactive') |

### Intent Schema

| Field | Type | Description |
|-------|------|-------------|
| name | string | Intent name, must start with a letter and can contain only letters, numbers, and dots |
| displayName | string | Display name for the intent, up to 100 characters |
| contexts | array | List of context strings in namespaced format (e.g., "org.fdc3.instrument") |
| customConfig | object | Custom configuration for the intent, must be a valid object |
