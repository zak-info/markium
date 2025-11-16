# Backend Delivery API Endpoints Documentation

This document describes the required backend endpoints for testing delivery company credentials.

## Yalidine Test Endpoint

**Endpoint:** `POST /delivery/test-yalidine`

**Purpose:** Verify Yalidine API credentials by calling Yalidine API with the provided credentials.

### Request

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <user-token>
```

**Body:**
```json
{
  "api_id": "string",
  "api_token": "string"
}
```

### Backend Implementation

The backend should:
1. Receive `api_id` and `api_token` from the request
2. Call Yalidine API: `GET https://api.yalidine.app/v1/wilayas/`
3. Include headers:
   - `X-API-ID: <api_id>`
   - `X-API-TOKEN: <api_token>`
4. Return structured response based on the result

### Response

**Success Response (200):**
```json
{
  "success": true,
  "message": "Credentials are valid",
  "data": [
    {
      "id": 1,
      "name": "Adrar",
      "ar_name": "أدرار",
      "longitude": "0.0",
      "latitude": "0.0"
    }
    // ... more wilayas
  ]
}
```

**Error Response - Invalid Credentials (401):**
```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": "The API ID or Token is incorrect"
}
```

**Error Response - Server Error (500):**
```json
{
  "success": false,
  "message": "Server error",
  "error": "Yalidine API is unavailable"
}
```

### Example Implementation (Node.js/Express)

```javascript
const axios = require('axios');

router.post('/delivery/test-yalidine', async (req, res) => {
  try {
    const { api_id, api_token } = req.body;

    // Validate inputs
    if (!api_id || !api_token) {
      return res.status(400).json({
        success: false,
        message: 'Missing credentials',
        error: 'API ID and API Token are required',
      });
    }

    // Call Yalidine API
    const response = await axios.get('https://api.yalidine.app/v1/wilayas/', {
      headers: {
        'X-API-ID': api_id,
        'X-API-TOKEN': api_token,
      },
    });

    // Success
    if (response.status === 200) {
      return res.json({
        success: true,
        message: 'Credentials are valid',
        data: response.data,
      });
    }

    // Unexpected response
    return res.status(response.status).json({
      success: false,
      message: 'Unexpected response',
      error: `Status: ${response.status}`,
    });

  } catch (error) {
    // Invalid credentials
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        error: 'The API ID or Token is incorrect',
      });
    }

    // Server error
    if (error.response?.status === 500) {
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: 'Yalidine API is unavailable',
      });
    }

    // Other errors
    return res.status(500).json({
      success: false,
      message: 'Connection error',
      error: error.message,
    });
  }
});
```

---

## Future Endpoints

The following endpoints follow the same pattern as Yalidine:

### ZR Express
**Endpoint:** `POST /delivery/test-zrexpress`

### Maystro
**Endpoint:** `POST /delivery/test-maystro`

### Ecotrack
**Endpoint:** `POST /delivery/test-ecotrack`

---

## Important Notes

1. **Security:** Always validate and sanitize inputs before forwarding to external APIs
2. **Rate Limiting:** Implement rate limiting to prevent abuse
3. **Logging:** Log all test attempts for debugging and audit purposes
4. **Authentication:** Ensure user is authenticated before allowing credential testing
5. **CORS:** The backend handles CORS issues by proxying requests to Yalidine API
