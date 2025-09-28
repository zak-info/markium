import { paths } from 'src/routes/paths';

// API
// ----------------------------------------------------------------------


// root@172.233.43.164
// BETest@15371

// export const HOST_API = 'http://172.105.83.136:8044/api';
// export const STORAGE_API = 'http://172.105.83.136:8044/storage';
// export const HOST_API = 'http://172.233.43.164:8000/api';
// export const STORAGE_API = 'http://172.233.43.164:8000/storage';
export const HOST_API = 'http://127.0.0.1:8000/api'; 
export const STORAGE_API = 'http://127.0.0.1:8000/storage';
// export const HOST_API = 'https://be.zaity.co/api';
// export const STORAGE_API = 'https://be.zaity.co/storage';
export const ASSETS_API = import.meta.env.VITE_ASSETS_API;

export const FIREBASE_API = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APPID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const AMPLIFY_API = {
  userPoolId: import.meta.env.VITE_AWS_AMPLIFY_USER_POOL_ID,
  userPoolWebClientId: import.meta.env.VITE_AWS_AMPLIFY_USER_POOL_WEB_CLIENT_ID,
  region: import.meta.env.VITE_AWS_AMPLIFY_REGION,
};

export const AUTH0_API = {
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  callbackUrl: import.meta.env.VITE_AUTH0_CALLBACK_URL,
};

export const SUPABASE_API = {
  url: import.meta.env.VITE_SUPABASE_URL,
  key: import.meta.env.VITE_SUPABASE_ANON_KEY,
};

export const MAPBOX_API = import.meta.env.VITE_MAPBOX_API;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.dashboard.root; // as '/dashboard'
