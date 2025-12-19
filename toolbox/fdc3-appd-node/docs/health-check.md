# Health Check API Documentation

The Health Check API provides endpoints to monitor the service's health, readiness, and performance metrics.

## Available Endpoints

### Basic Health Check

- **Path**: `/v1/health`
- **Method**: GET
- **Description**: Quick check to verify if the service is running.
- **Response**:

  ```json
  {
    "status": "healthy",
    "timestamp": "2024-03-14T12:00:00.000Z",
    "uptime": 123.45,
    "service": "user-service"
  }
  ```

### Detailed Health Check

- **Path**: `/v1/health/detailed`
- **Method**: GET
- **Description**: Provides comprehensive information about the service's health, including memory usage and database connection status.
- **Response**:

  ```json
  {
    "status": "healthy",
    "timestamp": "2024-03-14T12:00:00.000Z",
    "uptime": 123.45,
    "service": "user-service",
    "memory": {
      "usage": {
        "heapUsed": 12345678,
        "heapTotal": 23456789,
        "external": 1234567
      },
      "free": 11111111
    },
    "database": {
      "status": "connected",
      "healthy": true
    }
  }
  ```

### Liveness Probe

- **Path**: `/v1/health/live`
- **Method**: GET
- **Description**: Used by container orchestration systems to determine if the service needs to be restarted.
- **Response**:

  ```json
  {
    "status": "alive",
    "timestamp": "2024-03-14T12:00:00.000Z"
  }
  ```

### Readiness Probe

- **Path**: `/v1/health/ready`
- **Method**: GET
- **Description**: Used by container orchestration systems to determine if the service can receive traffic.
- **Response**:

  ```json
  {
    "status": "ready",
    "timestamp": "2024-03-14T12:00:00.000Z"
  }
  ```

## Response Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Service is healthy and functioning normally |
| 503 | Service is unavailable or not ready to handle requests |

## Use Cases

- **Basic Health Check**: Quick service status verification, load balancer health checks.
- **Detailed Health Check**: System monitoring, resource usage tracking, database connection status.
- **Liveness Probe**: Kubernetes liveness checks, service restart decisions.
- **Readiness Probe**: Kubernetes readiness checks, traffic routing decisions.

## Monitoring Best Practices

1. Implement automated checks every 30-60 seconds.
2. Set up alerts for repeated health check failures.
3. Log health check failures for debugging.
4. Track health check metrics over time.
