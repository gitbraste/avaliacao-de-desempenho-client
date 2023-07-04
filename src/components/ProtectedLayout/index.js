import { useAuth } from "../../Hooks/useAuth";
import { Login } from "../../pages/Login";
import { Footer } from "../Footer";
import { Header } from "../Header";
import styles from "./styles.module.scss";

export function ProtectedLayout ({ children }){
  const { user } = useAuth();
  
  if (Object.keys(user).length === 0) {
    return <Login />
  }

  return (
    <div className={styles.container}>
        <Header 
          showUserIcon="true"
        />
        <div className={styles.content}>
            {children}
        </div>
        <Footer />
    </div>
  )

};
