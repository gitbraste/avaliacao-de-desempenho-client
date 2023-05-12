import { Header } from "../../components/Header";
import style from "./styles.module.scss";

export function ErrorPage() {
    return(
        <div className={style.container}>
            <div className={style.content}>
                <Header />
                <main className={style.mainContent}>
                    <section className={style.mainCard}>
                        <h1>Sistema de Avaliação Anual</h1>
                        <p>Ops, essa página não está disponível</p>
                    </section>
                </main>
            </div>
        </div>
    );
}