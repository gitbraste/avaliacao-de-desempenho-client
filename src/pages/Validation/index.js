import { useParams } from "react-router-dom";
import { Header } from "../../components/Header";
import style from "./styles.module.scss";
import { useEffect, useState } from "react";
import api from "../../services/api";

export function Validation() {
    const [isValidSucess, setIsValidSucess] = useState(true);
    const { code } = useParams("/validation/:code")
    
    useEffect(() => {
        api.get(`/assessment/${code}`)
            .then((response) => {
                const newData = {
                    date: `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')} ${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}:${new Date().getSeconds().toString().padStart(2, '0')}`,
                    email: response.data[0].email
                }

                api.put(`/assessment/update/${code}`, newData)
                    .then((response) => {
                        setIsValidSucess(true);
                    }).catch((error) => {
                        setIsValidSucess(false);
                    });
            });
    });

    return (
        <div className={style.container}>
            <div className={style.content}>
                <Header />
                <main className={style.mainContent}>
                    <section className={style.mainCard}>
                        <h1>Sistema de Avaliação Anual</h1>
                        {isValidSucess ?
                            <p>Avaliação Validada com Sucesso!</p>
                            :
                            <p>Houve um problema durante a validação!</p>
                        }
                    </section>
                </main>
            </div>
        </div>
    );
}