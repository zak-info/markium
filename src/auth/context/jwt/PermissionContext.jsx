import { createContext, useContext, useEffect, useState } from 'react';

import { USER_STORAGE_KEY } from './auth-provider';
import { useUserPermissions } from 'src/api/users';

const PermissionContext = createContext();

export const PermissionProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);
  const {permissions:fetchedPermissions} = useUserPermissions(); // assumed custom hook

  useEffect(() => {
    if (
      fetchedPermissions &&
      JSON.stringify(fetchedPermissions) !== JSON.stringify(permissions)
    ) {
      setPermissions(fetchedPermissions);
      try {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const updatedUser = { ...user, permissions: fetchedPermissions };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      } catch (err) {
        console.error('Failed to update user permissions in localStorage:', err);
      }
    }
  }, [fetchedPermissions]);

  return (
    <PermissionContext.Provider value={{ permissions, setPermissions }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};
