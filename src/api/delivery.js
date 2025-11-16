import axios, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

/**
 * Test Yalidine API credentials via backend
 * @param {string} apiId - Yalidine API ID
 * @param {string} apiToken - Yalidine API Token
 * @returns {Promise<Object>} - Response with success status and wilayas data
 */
export async function testYalidineCredentials(apiId, apiToken) {
  try {
    // Call backend to verify credentials with Yalidine API
    const response = await axios.post(endpoints.delivery.testYalidine, {
      api_id: apiId,
      api_token: apiToken,
    });

    if (response.status === 200 && response.data?.success) {
      return {
        success: true,
        message: 'Credentials are valid',
        data: response.data?.data,
      };
    }

    return {
      success: false,
      message: response.data?.message || 'Unexpected response from server',
      error: response.data?.error || `Status code: ${response.status}`,
    };
  } catch (error) {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      return {
        success: false,
        message: 'Invalid credentials',
        error: 'The API ID or Token is incorrect. Please check your credentials.',
      };
    }

    // Handle 500 Internal Server Error
    if (error.response?.status === 500) {
      return {
        success: false,
        message: 'Server error',
        error: 'The Yalidine API is currently unavailable. Please try again later.',
      };
    }

    // Handle backend returned error
    if (error.response?.data) {
      return {
        success: false,
        message: error.response.data.message || 'Test failed',
        error: error.response.data.error || error.message,
      };
    }

    // Handle network or other errors
    return {
      success: false,
      message: 'Connection error',
      error: error.message || 'Unable to connect to server',
    };
  }
}

/**
 * Test ZR Express API credentials (placeholder for future implementation)
 * @param {string} apiId - ZR Express API ID
 * @param {string} apiToken - ZR Express API Token
 * @returns {Promise<Object>} - Response with success status
 */
export async function testZRExpressCredentials(apiId, apiToken) {
  // TODO: Implement ZR Express API test
  return {
    success: false,
    message: 'Not implemented',
    error: 'ZR Express API test is not yet implemented',
  };
}

/**
 * Test Maystro API credentials (placeholder for future implementation)
 * @param {string} apiId - Maystro API ID
 * @param {string} apiToken - Maystro API Token
 * @returns {Promise<Object>} - Response with success status
 */
export async function testMaystroCredentials(apiId, apiToken) {
  // TODO: Implement Maystro API test
  return {
    success: false,
    message: 'Not implemented',
    error: 'Maystro API test is not yet implemented',
  };
}

/**
 * Test Ecotrack API credentials (placeholder for future implementation)
 * @param {string} apiId - Ecotrack API ID
 * @param {string} apiToken - Ecotrack API Token
 * @returns {Promise<Object>} - Response with success status
 */
export async function testEcotrackCredentials(apiId, apiToken) {
  // TODO: Implement Ecotrack API test
  return {
    success: false,
    message: 'Not implemented',
    error: 'Ecotrack API test is not yet implemented',
  };
}

/**
 * Generic function to test delivery company credentials
 * @param {string} companyId - Company identifier (yalidine, zrexpress, maystro, ecotrack)
 * @param {string} apiId - API ID
 * @param {string} apiToken - API Token
 * @returns {Promise<Object>} - Response with success status
 */
export async function testDeliveryCredentials(companyId, apiId, apiToken) {
  switch (companyId) {
    case 'yalidine':
      return testYalidineCredentials(apiId, apiToken);
    case 'zrexpress':
      return testZRExpressCredentials(apiId, apiToken);
    case 'maystro':
      return testMaystroCredentials(apiId, apiToken);
    case 'ecotrack':
      return testEcotrackCredentials(apiId, apiToken);
    default:
      return {
        success: false,
        message: 'Unknown delivery company',
        error: `Company ${companyId} is not supported`,
      };
  }
}
