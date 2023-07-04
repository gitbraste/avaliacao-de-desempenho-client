import { useContext } from "react";
import { EmployeeContext } from "../context/EmployeeProvider";

export const useEmployee = () =>{
    const context = useContext(EmployeeContext);
    
    return context;
}