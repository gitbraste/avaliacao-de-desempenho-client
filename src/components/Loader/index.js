import LoaderIcon from "../../assets/images/loader.svg";
import style from "./styles.module.scss";

export function Loader(){
    return (
        <div className={style.container}>
            <img src={LoaderIcon} alt="Loader Icon" />
        </div>
    )
}