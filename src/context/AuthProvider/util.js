import api from "../../services/api";

export function setUserLocalStorage(token){
    localStorage.setItem("u", token);
}

export function getUserLocalStorage(){
    const data = localStorage.getItem("u");

    if(!data){
        return null;
    };

    return data;
}

export async function LoginRequest(register) {
    try{
        const request = await api.post("/login", register);

        return request.data;
    }catch(e){
        return null
    }
}