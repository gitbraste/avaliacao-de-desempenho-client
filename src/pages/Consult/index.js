import { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import api from "../../services/api";
import style from "./styles.module.scss";
import LoaderIcon from "../../assets/images/loader.svg";
import { ManagerConsult } from "../../components/ManagerConsult";
import { HRConsult } from "../../components/HRConsult";

export function Consult({ manager, onSetManager }) {
    const [register, setRegister] = useState("");
    const [assessment, setAssessment] = useState([]);

    const [isValid, setIsvalid] = useState(true);
    const [isCodeValid, setCodeIsvalid] = useState(true);
    const [isHR, setIsHR] = useState(false);

    const [showConsult, setShowConsult] = useState(false);
    const [showCodeField, setShowCodeField] = useState(false);
    const [showManagerField, setShowManagerField] = useState(true);
    const [thereIsEmployees, setThereIsEmployees] = useState(true);
    const [showLoader, setShowLoader] = useState(false);

    const [validCode, setValidCode] = useState(null);
    const [inputCode, setInputCode] = useState("");

    useEffect(() => {
        onSetManager(() => []);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleValidationCode = (e) => {
        setShowLoader(true);
        e.preventDefault();
        if (validCode === inputCode) {
            setShowCodeField(false);
            setShowConsult(true);
        } else {
            setCodeIsvalid(false);
        }
        setShowLoader(false);
    }

    const sendEmail = (data) => {
        const code = Math.random().toString().slice(2, 8);
        setValidCode(code);

        const sendEmail = {
            email: data[0].email,
            code: code
        };

        api.post(`/email`, sendEmail);
    }

    const getAssessment = (data) => {
        setAssessment(() => []);

        api.get(`/assessment/manager/${data[0].register}`)
            .then((response) => {
                if (response.data.length !== 0) {
                    setAssessment(response.data)
                    setShowManagerField(false);
                    setShowCodeField(true);
                    setShowLoader(false);
                    sendEmail(data);
                } else {
                    setThereIsEmployees(false);
                    setShowLoader(false);
                }
            });
    }

    const getManager = (e) => {
        e.preventDefault();
        setThereIsEmployees(true);
        onSetManager([]);
        setShowLoader(true);

        api.get(`/user/${register}`)
            .then((response) => {
                if (response.data.length === 0) {
                    setIsvalid(false);
                    setShowLoader(false);
                } else if (response.data[0].department === "21003") {
                    onSetManager(response.data)
                    sendEmail(response.data);
                    setIsvalid(true);
                    setShowLoader(false);
                    setShowManagerField(false);
                    setShowCodeField(true);
                    setIsHR(true);
                } else {
                    onSetManager(response.data)
                    getAssessment(response.data)
                    setIsvalid(true);
                }
            }).catch(() => {
                setIsvalid(false);
                setShowLoader(false);
            })
    }

    return (
        <div className={style.container}>
            <div className={style.content}>
                <Header />
                <main className={style.mainContent}>
                    <h1>Consultar Avaliações</h1>
                    {showManagerField &&
                        <>
                            <form className={style.form} onSubmit={(e) => getManager(e)} >
                                <section className={style.checkRegister}>
                                    <p>Digite sua matrícula: </p>
                                    <div className={style.checkRegister__content}>
                                        <input type="number" value={register} onChange={(e) => setRegister(e.target.value)} />
                                        <button>Buscar</button>
                                        {showLoader && <img src={LoaderIcon} alt="" />}
                                    </div>
                                </section>
                            </form>
                            {!isValid && <p className={style.alertMessage}>Matricula invalida</p>}
                            {!thereIsEmployees && <p className={style.alertMessage}>Você não tem avaliações para consultar!</p>}
                        </>
                    }
                    {showCodeField &&
                        <>
                            <form onSubmit={(e) => handleValidationCode(e)}>
                                <section className={style.checkRegister}>
                                    <div className={style.insertCodeField}>
                                        <p>Ensira o codigo de verificação enviado para o seu email cadastrado</p>
                                        <div className={style.checkRegister__content}>
                                            <input type="number" value={inputCode} onChange={(e) => setInputCode(e.target.value)} />
                                            <button>Buscar</button>
                                            {showLoader && <img src={LoaderIcon} alt="" />}
                                        </div>
                                    </div>
                                </section>
                            </form>
                            {!isCodeValid && <p className={style.alertMessage}>O código inserido é inválido</p>}
                        </>
                    }
                    { showConsult && isHR && < HRConsult manager={manager}/> }        
                    { showConsult && !isHR && <ManagerConsult manager={manager} currentAssessment={assessment}/> }
                </main>
            </div>
        </div>
    )
}
