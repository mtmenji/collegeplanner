import React, { createContext, useState, useContext } from 'react';

const PlannerContext = createContext();

export const PlannerProvider = ({ children }) => {
    const [plannerName, setPlannerName] = useState('');

    return (
        <PlannerContext.Provider value={{ plannerName, setPlannerName }}>
            {children}
        </PlannerContext.Provider>
    );
};

export const usePlannerContext = () => useContext(PlannerContext);