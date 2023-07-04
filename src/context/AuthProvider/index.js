import { createContext, useEffect, useState } from "react";
import { LoginRequest, getUserLocalStorage, setUserLocalStorage, } from "./util";
import api from "../../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});

  useEffect(()=>{
    const ValidateToken = async () =>{
      const localToken = getUserLocalStorage();
   
      if(localToken){
        await api.post("/decode", {"token": localToken}).then((response)=>
          setUser(response.data.data)
        );
      };
    }
    ValidateToken();
  },[]);

  const Authenticate = async(user) => {
   const response = await LoginRequest(user);

   setUser(user);
   setUserLocalStorage(response.token);
  }

  const Logout = () => {
    setUser([]);
    setUserLocalStorage("");
  }

  return (
    <AuthContext.Provider value={{ user, Authenticate, Logout }}>
      {children}
    </AuthContext.Provider>
  );
};
