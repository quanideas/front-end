import axios from 'axios';
import Cookies from 'js-cookie';
import { handleAuthError } from './HandleAuthError';

// Create an axios instance with default configurations
const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_PROJECT_DATA_URL,
  withCredentials: true, // Include cookies in all requests
});

// Add interceptor to automatically attach Authorization header
API.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Add interceptor to handle errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      handleAuthError(error.response);
    }
    return Promise.reject(error);
  }
);

// Utility function for GET requests
const getData = (endpoint, options = {}) => {
  return API.get(endpoint, options).then((response) => response.data);
};

// Utility function for POST requests
const postData = (endpoint, data, options = {}) => {
  return API.post(endpoint, data, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  }).then((response) => response.data);
};

// Utility function for PUT requests
const putData = (endpoint, data, options = {}) => {
  return API.put(endpoint, data, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  }).then((response) => response.data);
};

// Utility function for DELETE requests
const deleteData = (endpoint, options = {}) => {
  return API.delete(endpoint, options).then((response) => response.data);
};

export { getData, postData, putData, deleteData };
