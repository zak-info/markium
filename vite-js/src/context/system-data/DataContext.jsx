import React, { createContext, useEffect, useState } from "react";
import { useValues } from "src/api/utils";

// Create a context with an initial value
export const DataContext = createContext();

export const DataContextProvider = ({ children }) => {
    const { data } = useValues();  // ✅ Hook is called at the top level

    const [SystemData, setSystemData] = useState(null);

    useEffect(() => {
        if (!SystemData && data) {
            setSystemData(data);
        }
    }, [data, SystemData]);  // ✅ Runs when `data` changes

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
