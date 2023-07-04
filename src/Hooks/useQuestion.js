import { useContext } from "react";
import { QuestionContext } from "../context/QuestionProvider";

export const useQuestion = () =>{
    const context = useContext(QuestionContext);
    
    return context;
}