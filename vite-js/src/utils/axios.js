import axios from 'axios';
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    // Check for 401 status and redirect to login
    if (error.response?.status === 401) {
      // Assuming you're using React Router v6
      window.location.href = '/auth/jwt/login'; // Replace with your login route
    }
    return Promise.reject((error.response && error.response.data) || 'Something went wrong');
  }
);

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const settings = localStorage.getItem('settings');
    if (settings !== null) {
      const getLang = JSON.parse(settings);
      config.headers['Accept-Language'] = getLang?.themeDirection === 'rtl' ? 'ar-AR' : 'en-US';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ----------------------------------------------------------------------

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosInstance.get(url, { ...config });
  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    login: '/auth/login',
    register: '/api/auth/register',
  },
  clauses: {
    list: '/contract',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  utils: { values: '/values' },
  company: {
    list: '/company',
  },
  maintenance: {
    list: '/maintenance',
  },
  cars: {
    list: '/car',
    under_maintainance: '/maintenance/pending',
  },
  drivers: {
    list: '/driver',
  },
};
