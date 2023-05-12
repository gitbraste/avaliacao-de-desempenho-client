import style from "./styles.module.scss";
import LogoBrasterapica from "../../assets/images/Logo.png";
import { Link } from "react-router-dom";

export  function Header (){
    return (
        <header className={style.container}>
          <nav>
            <Link to="/"><img src={LogoBrasterapica} alt="Brasterápica Logo"/></Link>
          </nav>
        </header>
    )
}