import { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import api from "../../services/api";
import style from "./styles.module.scss";
import { useNavigate } from "react-router-dom";
import LoaderIcon from "../../assets/images/loader.svg";

export function Register({ manager, onSetManager, selectEmployee, onSetSelectEmployee }) {
    const [register, setRegister] = useState("");
    const [employees, setEmployees] = useState([]);

    const [isEmployeeSelected, setIsEmployeeSelected] = useState(false);
    const [isValid, setIsvalid] = useState(true);
    const [isCodeValid, setCodeIsvalid] = useState(true);
    const [thereIsEmployees, setThereIsEmployees] = useState(true);

    const [showEmployees, setShowEmployees] = useState(false);
    const [showManagerField, setShowManagerField] = useState(true);
    const [showCodeField, setShowCodeField] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    const [validCode, setValidCode] = useState(null);
    const [inputCode, setInputCode] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        onSetManager(() => []);
        onSetSelectEmployee(() => "");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getManager = () => {
        setShowLoader(true);
        setIsEmployeeSelected(false);
        api.get(`/user/${register}`)
            .then((response) => {
                onSetManager(response.data)
                getEmployes(response.data)
                setIsvalid(true);
            }).catch((error) => {
                setIsvalid(false);
                setShowLoader(false);
            });
    };

    const getEmployes = (data) => {
        const code = Math.random().toString().slice(2, 8);
        setValidCode(code);

        const sendEmail = {
            email: data[0].email,
            code: code
        };

        api.get(`/user/manager/${data[0].register}`)
            .then((response) => {
                if(response.data.length !== 0){
                    setShowManagerField(false);
                    setShowLoader(false);
                    setShowCodeField(true);
                    setEmployees(response.data)

                    api.post(`/email`, sendEmail)
                        .then(() => {
                            setShowCodeField(true);
                        }).catch((error) => {
                            console.log(error);
                        })
                }else{
                    setThereIsEmployees(false);
                    setShowLoader(false);
                }                   
            });
    };

    const handleValidationCode = (e) => {
        setShowLoader(true);
        e.preventDefault();

        if(validCode === inputCode){
            setShowCodeField(false)  
            setShowEmployees(true)
        }else{
            setCodeIsvalid(false);
        } 
        setShowLoader(false);
    };

    const handleSelectEmployee = (id) => {
        const employee = employees.find(employee => employee.register === id);
        setIsEmployeeSelected(false)
        onSetSelectEmployee(employee);
    };

    const handleRegister = (e) => {
        e.preventDefault();

        setThereIsEmployees(true);
        getManager();
    };

    const validation = () => {
        if (selectEmployee === undefined || selectEmployee === "") {
            setIsEmployeeSelected(true);
        } else {
            api.get(`/user/manager/${selectEmployee.register}`).then((response) => {
              if (response.data.length === 0) {
                onSetSelectEmployee((prevState) => ({ ...prevState, type_user: 0 }));
              } else {
                onSetSelectEmployee((prevState) => ({ ...prevState, type_user: 1 }));
              }
            });
        }
        navigate("/assessment");          
    };

    return (
        <div className={style.container}>
            <div className={style.content}>
                <Header />
                <main className={style.mainContent}>
                    <h1>Formulário de Avaliação Anual</h1>
                    {showManagerField &&
                        <form className={style.form} onSubmit={(e) => handleRegister(e)} >
                            <section className={style.checkRegister}>
                                <div className={style.insertManagerField}>
                                    <p>Digite sua matrícula: </p>
                                    <div className={style.insertManagerFieldContent}>
                                        <input type="number" value={register} onChange={(e) => setRegister(e.target.value)} />
                                        <button>Buscar</button>
                                        {showLoader && <img src={LoaderIcon} alt=""/>}
                                    </div>
                                </div>
                                {!thereIsEmployees && <p className={style.alertMessage}>Você não tem colaboradores para avaliar!</p>}
                                {!isValid && <p className={style.alertMessage}>Matricula invalida</p>}
                            </section>
                        </form>
                    }
                    {showCodeField &&
                        <>
                            <form onSubmit={(e) => handleValidationCode(e)}>
                                <section className={style.checkRegister}>
                                    <div className={style.insertCodeField}>
                                        <p>Ensira o codigo de verificação enviado para o seu email cadastrado</p>
                                        <div className={style.insertManagerFieldContent}>
                                            <input type="number" value={inputCode} onChange={(e) => setInputCode(e.target.value)} />
                                            <button>Buscar</button>
                                            {showLoader && <img src={LoaderIcon} alt=""/>}
                                        </div>
                                    </div>
                                </section>
                            </form>
                            {!isCodeValid && <p className={style.alertMessage}>O código inserido é inválido</p>}
                        </>
                    }
                    {showEmployees &&
                        <>
                            <form>
                                <section className={style.userContent}>
                                    <div className={style.managerInfo}>
                                        <p><strong>Nome do Avaliador:</strong> {manager[0].name}</p>
                                        <p><strong>Cargo:</strong> {manager[0].position}</p>
                                    </div>
                                    <p>Selecione quem deseja avaliar:</p>
                                    <br></br>
                                    <select onChange={(e) => handleSelectEmployee(e.target.value)}>
                                        <option value="" >Selecionar</option>
                                        {employees.map((employee) => (
                                            <option key={employee.register} value={employee.register}>{employee.name}</option>
                                        ))}
                                    </select>
                                    {isEmployeeSelected && <p className={style.alertMessage}>Selecione um colaborador para ser avaliado!</p>}
                                </section>
                            </form>
                            <section className={style.startButton}>
                                <button onClick={validation}>Iniciar Avaliação</button>
                            </section>
                        </>
                    }
                </main>
            </div>
        </div>
    );
}