import axios from 'axios';
import Cookies from 'js-cookie';
import { handleAuthError } from './HandleAuthError';

// Create an instance of axios with default configuration
const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_USER_DATA_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in every request
});

// Add an interceptor to automatically attach the Authorization header
API.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Add an interceptor to handle errors from the server
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      handleAuthError(error.response);
    }
    return Promise.reject(error);
  }
);

/**
 * Utility function for GET requests
 * @param {string} endpoint - The API endpoint to call
 * @param {object} [options={}] - Optional axios request options
 * @returns {Promise<any>} - The response data
 */
const getData = (endpoint, options = {}) => {
  return API.get(endpoint, options).then((response) => response.data);
};

/**
 * Utility function for POST requests
 * @param {string} endpoint - The API endpoint to call
 * @param {object} data - The data to send in the body of the request
 * @param {object} [options={}] - Optional axios request options
 * @returns {Promise<any>} - The response data
 */
const postData = (endpoint, data, options = {}) => {
  return API.post(endpoint, data, options).then((response) => response.data);
};

/**
 * Utility function for PUT requests
 * @param {string} endpoint - The API endpoint to call
 * @param {object} data - The data to send in the body of the request
 * @param {object} [options={}] - Optional axios request options
 * @returns {Promise<any>} - The response data
 */
const putData = (endpoint, data, options = {}) => {
  return API.put(endpoint, data, options).then((response) => response.data);
};

/**
 * Utility function for DELETE requests
 * @param {string} endpoint - The API endpoint to call
 * @param {object} [options={}] - Optional axios request options
 * @returns {Promise<any>} - The response data
 */
const deleteData = (endpoint, options = {}) => {
  return API.delete(endpoint, options).then((response) => response.data);
};

export { getData, postData, putData, deleteData };