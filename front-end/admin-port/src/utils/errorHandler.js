// utils/errorHandler.js
export function getApiError(error) {
  // If it's already a string error message
  if (typeof error === 'string') {
    return error;
  }

  // If it's an Error object with a message
  if (error?.message) {
    return error.message;
  }

  // If it's an axios/fetch API response error
  if (error?.response?.data) {
    const responseData = error.response.data;
    
    // Handle different response formats
    if (typeof responseData === 'string') {
      return responseData;
    }
    if (responseData.message) {
      return responseData.message;
    }
    if (responseData.error) {
      return responseData.error;
    }
  }

  // Default fallback
  return 'Something went wrong. Please try again.';
}