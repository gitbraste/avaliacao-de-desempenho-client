import style from "./styles.module.scss";
import LogoBrasterapica from "../../assets/images/Logo.png";
import { Link, useNavigate } from "react-router-dom";
import { SlLogin } from "react-icons/sl";
import { IconContext } from "react-icons";
import { useAuth } from "../../Hooks/useAuth";

export function Header({showUserIcon}) {
  const navigate = useNavigate();
  const {user, Logout} = useAuth();
  
  const handleLogout = () => {
    Logout();
    navigate("/login");
  }

  function getFirstName(str) {
    str = str.trim();
    const firstSpaceIndex = str.indexOf(' ');
  
    if (firstSpaceIndex === -1) {
      return str;
    }
  
    const firstWord = str.substring(0, firstSpaceIndex);
    return firstWord;
  }
  

  return (
    <header className={style.container}>
      <nav>
        <Link to="/">
          <img src={LogoBrasterapica} alt="Brasterápica Logo" />
        </Link>
        {(showUserIcon && Object.keys(user).length !== 0) &&
          <div>
            <p>Olá, {getFirstName(user.name)}</p>
            <IconContext.Provider value={{ size: "1.5em", color: "#195BA2" }}>
              <button>
                <SlLogin 
                  onClick={()=>handleLogout()}
                />
              </button>
            </IconContext.Provider>
          </div>
        }
      </nav>
    </header>
  );
}
