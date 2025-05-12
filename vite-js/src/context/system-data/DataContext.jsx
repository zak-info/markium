
import React, { createContext, useEffect, useState } from "react";
import { useUserPermissions } from "src/api/users";
import { useValues } from "src/api/utils";
import { USER_STORAGE_KEY } from "src/auth/context/jwt/auth-provider";

export const DataContext = createContext();

export const DataContextProvider = ({ children }) => {
  const { data } = useValues();  // ✅ Hook is OK
//   const { permissions } = useUserPermissions();  // ✅ Hook is OK

  const [SystemData, setSystemData] = useState(null);

  useEffect(() => {
    if (!SystemData && data) {
      setSystemData(data);
    }
  }, [data]);

//   useEffect(() => {
//     const storedUser = localStorage.getItem(USER_STORAGE_KEY);
//     if (storedUser) {
//       try {
//         const user = JSON.parse(storedUser);
//         const updatedUser = { ...user, permissions };
//         localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
//       } catch (err) {
//         console.error("Failed to update user permissions in localStorage:", err);
//       }
//     }
//   }, [permissions]);

  const globalPurge = () => {
    setSystemData({});
  };

  return (
    <DataContext.Provider
      value={{
        SystemData,
        globalPurge,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
