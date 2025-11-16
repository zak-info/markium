# Backend Delivery API Endpoints

## Overview
The frontend now requires backend proxy endpoints to test delivery company credentials due to CORS restrictions.

## Required Endpoint: Test Yalidine Credentials

### Endpoint
```
POST /delivery/test-yalidine
```

### Request Body
```json
{
  "api_id": "string",
  "api_token": "string"
}
```

### Backend Implementation
The backend should:
1. Receive the `api_id` and `api_token` from the request body
2. Make a GET request to: `https://api.yalidine.app/v1/wilayas/`
3. Include these headers in the request:
   ```
   X-API-ID: <api_id>
   X-API-TOKEN: <api_token>
   ```
4. Return the response to the frontend

### Response Format

#### Success (200 OK)
```json
{
  "success": true,
  "message": "Credentials are valid",
  "data": [
    // Array of wilayas data from Yalidine API
  ]
}
```

#### Invalid Credentials (401 Unauthorized)
```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": "The API ID or Token is incorrect. Please check your credentials."
}
```

#### Server Error (500 Internal Server Error)
```json
{
  "success": false,
  "message": "Server error",
  "error": "The Yalidine API is currently unavailable. Please try again later."
}
```

### Example Backend Implementation (Node.js/Express)
```javascript
app.post('/delivery/test-yalidine', async (req, res) => {
  try {
    const { api_id, api_token } = req.body;

    // Validate input
    if (!api_id || !api_token) {
      return res.status(400).json({
        success: false,
        message: 'Missing credentials',
        error: 'API ID and API Token are required'
      });
    }

    // Make request to Yalidine API
    const response = await axios.get('https://api.yalidine.app/v1/wilayas/', {
      headers: {
        'X-API-ID': api_id,
        'X-API-TOKEN': api_token
      }
    });

    // Return success
    return res.status(200).json({
      success: true,
      message: 'Credentials are valid',
      data: response.data
    });

  } catch (error) {
    // Handle 401 - Invalid credentials
    if (error.response?.status === 401) {
      return res.status(200).json({
        success: false,
        message: 'Invalid credentials',
        error: 'The API ID or Token is incorrect. Please check your credentials.'
      });
    }

    // Handle 500 - Server error
    if (error.response?.status === 500) {
      return res.status(200).json({
        success: false,
        message: 'Server error',
        error: 'The Yalidine API is currently unavailable. Please try again later.'
      });
    }

    // Handle other errors
    return res.status(500).json({
      success: false,
      message: 'Connection error',
      error: error.message || 'Unable to connect to Yalidine API'
    });
  }
});
```

## Future Endpoints (Placeholders)

These endpoints are prepared on the frontend but not yet implemented:

- `POST /delivery/test-zrexpress`
- `POST /delivery/test-maystro`
- `POST /delivery/test-ecotrack`

All should follow the same pattern as the Yalidine endpoint.

## Notes
- The frontend expects all responses to be in JSON format with `success`, `message`, and optional `error`/`data` fields
- The wilayas data is only used for testing credentials validity and is not stored
- CORS should be enabled for these endpoints
