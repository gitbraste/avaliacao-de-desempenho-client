import { Link } from "react-router-dom";
import { Header } from "../../components/Header";
import style from "./styles.module.scss";

export function Home (){
    return(
        <div className={style.container}> 
            <div className={style.content}>
                <Header />
                <main className={style.menu}>
                    <h1>Bem vindo ao Sistema de Avaliação de Desempenho</h1>
                    <div className={style.menuButtons}>
                        <Link to="/register">Realizar Avaliação</Link>
                        <Link to="/Consult">Consultar Avaliações</Link>
                    </div>
                </main>
            </div>
        </div>
    );
}