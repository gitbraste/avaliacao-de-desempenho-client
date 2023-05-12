import { useEffect, useState } from "react";
import api from "../../services/api";
import style from "./styles.module.scss";
import { Modal } from "../Modal";

export function ManagerConsult({ manager, currentAssessment }) {
  const [resultValue, setResultValue] = useState(0);
  const [assessment, setAssessment] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [selectEmployee, setSelectEmployee] = useState("");

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectAssessment, setSelectAssessment] = useState([]);

  const [isFilterValid, setIsFilterValid] = useState(true);
  const [errorMensage, setErrorMensage] = useState("");

  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    setAssessment(currentAssessment);
    getEmployes();
  }, []);

  useEffect(() => {
    let result = 0;
    let indice = 0;
    selectAssessment.forEach((element) => {
      result += element.value;
      indice++;
    });
    setResultValue((result / indice).toFixed(2));
  }, [selectAssessment]);

  const setModalIsOpenToTrue = (id) => {
    setModalIsOpen(true);
    api.get(`/assessment/${id}`)
      .then((response) => {
        setSelectAssessment(response.data);
      });
  };

  const setModalIsOpenToFalse = () => {
    setModalIsOpen(false);
  };

  const getEmployes = () => {
    api.get(`/user/manager/${manager[0].register}`)
      .then((response) => {
        setEmployees(response.data);
      });
  };

  const handleFilter = () => {
    setIsFilterValid(true);
    if (selectEmployee && !dateStart && !dateEnd) {
      api.get(`/assessment/user/${selectEmployee}/${manager[0].register}`)
        .then((response) => {
          setAssessment(response.data);
        });
      setShowFilter(false);
    } else if (!selectEmployee && !dateStart && !dateEnd) {
      api.get(`/assessment/manager/${manager[0].register}`)
        .then((response) => {
          setAssessment(response.data);
        });

      setShowFilter(false);
    } else if (!selectEmployee && dateStart && dateEnd) {
      api
        .get(`/assessment/date/${manager[0].register}/${dateStart}/${dateEnd}`)
        .then((response) => {
          setAssessment(response.data);
        });
      setShowFilter(false);
    } else if (selectEmployee && dateStart && dateEnd) {
      api.get(`/assessment/date/${selectEmployee}/${manager[0].register}/${dateStart}/${dateEnd}`)
        .then((response) => {
          setAssessment(response.data);
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

  return (
    <div className={style.container}>
      <Modal
        modalIsOpen={modalIsOpen}
        selectAssessment={selectAssessment}
        resultValue={resultValue}
        setModalIsOpenToFalse={setModalIsOpenToFalse}
      />
      <div className={style.content}>
        <section className={style.content__managerInfo}>
          {manager.length !== 0 && (
            <div className={style.content__managerInfo}>
              <p>
                <strong>Nome do Avaliador:</strong> {manager[0].name}
              </p>
              <p>
                <strong>Cargo:</strong> {manager[0].position}
              </p>
            </div>
          )}
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={style.filterButton}
          >
            Filtrar
          </button>
        </section>
        {showFilter && (
          <section className={style.content__filter}>
            <p>Por colaborador: </p>
            <select onChange={(e) => setSelectEmployee(e.target.value)}>
              <option value="">Todos</option>
              {employees.map((employee) => (
                <option key={employee.register} value={employee.register}>
                  {employee.name}
                </option>
              ))}
            </select>
            <p>Por data</p>
            <div className={style.content__filter__insertDate}>
              <div>
                <label>Inicio</label>
                <input
                  type="date"
                  value={dateStart}
                  onChange={(e) => setDateStart(e.target.value)}
                />
              </div>
              <div>
                <label>Fim</label>
                <input
                  type="date"
                  value={dateEnd}
                  onChange={(e) => setDateEnd(e.target.value)}
                />
              </div>
              <button onClick={() => handleFilter()}>Buscar</button>
            </div>
            {!isFilterValid && (
              <p className={style.alert_message}>
                Preencha o campos de {errorMensage} corretamente
              </p>
            )}
          </section>
        )}
        <section>
          {assessment.map((item) => (
            <div
              onClick={() => setModalIsOpenToTrue(item.id_assessment)}
              className={style.cardConsult}
              key={item.id_assessment}
            >
              <p>Colaborador: {item.name}</p>
              <p>
                Data:{" "}
                {new Intl.DateTimeFormat("pt-BR").format(
                  new Date(item.date_time)
                )}
              </p>
              <p>{item.status === '0' ? "AGUARDANDO VALIDAÇÃO" : "VALIDADO"}</p>
            </div>
          ))}
        </section>
        {(assessment.length === 0) && <p className={style.alert_message}>Não há avaliações para essa consulta</p>}
      </div>
    </div>
  );
}
