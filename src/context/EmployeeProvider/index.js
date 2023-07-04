import {createContext, useState } from "react";

export const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  const [ employee, setEmployee ] = useState({});
  const [ assessment, setAssessment ] = useState({});

  return (
    <EmployeeContext.Provider value={{ employee, setEmployee, assessment, setAssessment }}>
      {children}
    </EmployeeContext.Provider>
  );
};
