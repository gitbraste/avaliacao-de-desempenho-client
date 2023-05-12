import { useEffect, useState } from "react";
import api from "../../services/api";
import style from "./styles.module.scss";
import LoaderIcon from "../../assets/images/loader.svg";
import { Modal } from "../Modal";

export function HRConsult({ manager }) {
    const [resultValue, setResultValue] = useState(0);
    const [assessment, setAssessment] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectManager, setSelectManager] = useState([]);
    const [register, setRegister] = useState("");

    const [dateStart, setDateStart] = useState("");
    const [dateEnd, setDateEnd] = useState("");
    const [selectEmployee, setSelectEmployee] = useState("");
    
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectAssessment, setSelectAssessment] = useState([]);

    const [isValid, setIsvalid] = useState(true);
    const [isFilterValid, setIsFilterValid] = useState(true);
    const [errorMensage, setErrorMensage] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const [showManagerField, setShowManagerField] = useState(true);

    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
        let result = 0;
        let indice = 0;
        selectAssessment.forEach(element => {
            result += element.value;
            indice++;
        });
        setResultValue((result / indice).toFixed(2))
    }, [selectAssessment]);

    const setModalIsOpenToTrue = (id) => {
        setModalIsOpen(true);

        api.get(`/assessment/${id}`)
            .then((response) => {
                setSelectAssessment(response.data)
            })
            .catch((err) => {
                console.error("ops! ocorreu um erro" + err);
            });
    };

    const setModalIsOpenToFalse = () => {
        setModalIsOpen(false);
    };

    const getEmployes = () => {
        api.get(`/user/manager/${register}`)
            .then((response) => {
                setEmployees(response.data)
            })
            .catch((err) => {
                console.error("ops! ocorreu um erro" + err);
            });
    };

    const handleFilter = () => {
        setIsFilterValid(true);
        if (selectEmployee && !dateStart && !dateEnd) {
            api.get(`/assessment/user/${selectEmployee}/${register}`)
                .then((response) => {
                    setAssessment(response.data)
                })
                .catch((err) => {
                    console.error("ops! ocorreu um erro" + err);
                });
            setShowFilter(false);
        } else if (!selectEmployee && !dateStart && !dateEnd) {
            api.get(`/assessment/manager/${register}`)
                .then((response) => {
                    setAssessment(response.data)
                })
                .catch((err) => {
                    console.error("ops! ocorreu um erro" + err);
                });
            setShowFilter(false);
        } else if (!selectEmployee && dateStart && dateEnd) {
            api.get(`/assessment/date/${register}/${dateStart}/${dateEnd}`)
                .then((response) => {
                    setAssessment(response.data)
                })
                .catch((err) => {
                    console.error("ops! ocorreu um erro" + err);
                });
            setShowFilter(false);
        } else if (selectEmployee && dateStart && dateEnd) {
            api.get(`/assessment/date/${selectEmployee}/${register}/${dateStart}/${dateEnd}`)
                .then((response) => {
                    setAssessment(response.data)
                })
                .catch((err) => {
                    console.error("ops! ocorreu um erro" + err);
                });
            setShowFilter(false);
        } else if (dateStart && !dateEnd) {
            setIsFilterValid(false);
            setErrorMensage("data final");
        } else if (!dateStart && dateEnd) {
            setIsFilterValid(false);
            setErrorMensage("data inicial");
        }
        setSelectEmployee("");
    };

    const getAssessment = (data) => {
        setAssessment(() => []);

        api.get(`/assessment/manager/${data[0].register}`)
            .then((response) => {
                if (response.data.length !== 0) {
                    setAssessment(response.data)
                    setShowLoader(false);
                }
            })
            .catch((err) => {
                console.error("ops! ocorreu um erro" + err);
            });
    };

    const getManager = (e) => {
        e.preventDefault();
        setShowLoader(true);

        api.get(`/user/${register}`)
            .then((response) => {
                setSelectManager(response.data[0]);
                getAssessment(response.data);
                setShowLoader(false);
                setShowManagerField(false);
                getEmployes();
            }).catch((error) => {
                setIsvalid(false);
                setShowLoader(false);
            })
    };

    return (
        <div className={style.container}>
           <Modal 
            selectAssessment={selectAssessment}
            resultValue={resultValue}
            modalIsOpen={modalIsOpen}
            setModalIsOpenToFalse={setModalIsOpenToFalse}
           />
            <div className={style.content}>
                <section className={style.content__userInfo}>
                    {manager.length !== 0 &&
                        <div>
                            <p>OLÁ, {manager[0].name}</p>
                        </div>
                    }
                </section>
                {showManagerField ?
                    <section className={style.content__checkRegister}>
                        <form onSubmit={(e) => getManager(e)} >
                            <p>Digite a matricula do gestor </p>
                            <div>
                                <input type="number" value={register} onChange={(e) => setRegister(e.target.value)} />
                                <button>Buscar</button>
                                {showLoader && <img src={LoaderIcon} alt="" />}
                            </div>
                        </form>
                    </section>
                    :
                    <>
                        <section className={style.content__select_manager_info}>
                            <button onClick={() => { setShowManagerField(true); setRegister(""); setShowFilter(false); setAssessment([]) }} className={style.content__select_manager_info__new_consult}>Nova Consulta</button>
                            <div>
                                <p><strong>Nome do Avaliador:</strong> {selectManager.name}</p>
                                <p><strong>Cargo:</strong> {selectManager.position}</p>
                            </div>
                            <button onClick={() => setShowFilter(!showFilter)} className={style.content__select_manager_info__filter_button}>Filtrar</button>
                        </section>
                    </>
                }
                {showFilter &&
                    <section className={style.content__filter}>
                        <p>Por colaborador: </p>
                        <select onChange={(e) => setSelectEmployee(e.target.value)}>
                            <option value="" >Todos</option>
                            {employees.map((employee) => (
                                <option key={employee.register} value={employee.register}>{employee.name}</option>
                            ))}
                        </select>
                        <p>Por data</p>
                        <div className={style.content__filter__insertDate}>
                            <div>
                                <label>Inicio</label>
                                <input type="date" value={dateStart} onChange={(e) => setDateStart(e.target.value)} />
                            </div>
                            <div>
                                <label>Fim</label>
                                <input type="date" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} />
                            </div>
                            <button onClick={() => handleFilter()}>Buscar</button>
                        </div>
                        {!isFilterValid && <p className={style.content__filter__alert_message}>Preencha o campos de {errorMensage} corretamente</p>}
                    </section>}
                <section>
                    {assessment.map(item => (
                        <div onClick={() => setModalIsOpenToTrue(item.id_assessment)} className={style.content__cardConsult} key={item.id_assessment}>
                            <p>Colaborador: {item.name}</p>
                            <p>Data: {new Intl.DateTimeFormat('pt-BR').format(new Date(item.date_time))}</p>
                            <p>{item.status ===  '0' ? "AGUARDANDO VALIDAÇÃO" : "VALIDADO"}</p>
                            
                        </div>
                    ))}
                    {(assessment.length === 0 && !showManagerField) && <p className={style.content__filter__alert_message}>Não há avaliações para essa consulta</p>}
                </section>
            </div>
        </div>
    )
}