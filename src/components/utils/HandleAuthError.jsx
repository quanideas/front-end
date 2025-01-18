import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let isAuthErrorToastShown = false;

/**
 * Handles authentication errors by displaying a toast notification and redirecting to the login page.
 * 
 * @param {Object} response - The response object from an HTTP request.
 * @param {number} response.status - The HTTP status code of the response.
 */
export function handleAuthError(response) {
  if (response.status === 401) {
    if (!isAuthErrorToastShown) {
      isAuthErrorToastShown = true; 
      toast.error('Session expired. Redirecting to login...', {
        position: 'top-center',
        autoClose: 3000,
        onClose: () => {
          isAuthErrorToastShown = false;
        },
      });

      setTimeout(() => {
        Cookies.remove('token');
        Cookies.remove('refreshToken');
        window.location.href = '/login';
      }, 3000);
    }
  }
}
