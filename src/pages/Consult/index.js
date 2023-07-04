import { useEffect, useState } from "react";
import api from "../../services/api";
import style from "./styles.module.scss";
import { useAuth } from "../../Hooks/useAuth";
import { Modal } from "../../components/Modal";
import { Loader } from "../../components/Loader";

export function Consult() {
  const { user } = useAuth();
  const [assessment, setAssessment] = useState([]);

  const [typeAssessment, setTypeAssessment] = useState([]);
  const [selectAssessment, setSelectAssessment] = useState([]);
  const [resultValue, setResultValue] = useState(0);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [manager, setManager] = useState([]);

  const [filterManager, setFilterManager] = useState("");
  const [filterEmployee, setFilterEmployee] = useState("");
  const [filterTypeAssessment, setFilterTypeAssessment] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const [showLoader, setShowloader] = useState(true);
  const [showFilterLoader, setShowFilterloader] = useState(false);
  const [showFilterSection, setShowFilterSection] = useState(false);

  useEffect(() => {
    const getFilterData = async () => {
      await api.get(`/user/all/manager`).then((response) => {
        setManager(response.data);
      });

      await api.get(`/user/manager/${user.register}`).then((response) => {
        setEmployees(response.data);
      });

      await api.get(`/assessment/assessments`).then((response) => {
        setTypeAssessment(response.data);
      });

      user.typeUser === 2
        ? await api
            .get(`/assessment/register/user/${user.register}`)
            .then((response) => {
              setAssessment(response.data);
            })
        : await api
            .get(`/assessment/register/manager/${user.register}`)
            .then((response) => {
              setAssessment(response.data);
            });
      
      setShowloader(false);
    };

    getFilterData();
    // eslint-disable-next-line
  }, []);

  const setModalIsOpenToTrue = async (item) => {
    setShowFilterloader(true);
    await api
      .get(`/answer/assessment/${item.id_assessment_register}`)
      .then((response) => {
        setSelectAssessment([item, response.data]);
        setModalIsOpen(true);
        let result = 0;
        let indice = 0;

        response.data.forEach((element) => {
          const e = parseInt(element.value);

          if (!isNaN(e)) {
            result += e;
            indice++;
          }
        });

        setResultValue((result / indice).toFixed(2));
      });
    setShowFilterloader(false);
  };

  const setModalIsOpenToFalse = () => {
    setModalIsOpen(false);
  };

  const handleFilter = async (e) => {
    setShowloader(true);
    e.preventDefault();

    const string = `SELECT 
      users.name, 
      users.email,
	    assessments.title,
	    assessments.id_assessment,
      assessment_register.id_assessment_register, 
      assessment_register.register,
      assessment_register.date_time, 
      assessment_register.status,
      assessment_register.validation_date,
      assessment_register.validation_email,
	    g.name AS manager_name
    FROM assessment_register
      INNER JOIN assessments ON assessment_register.id_assessment = assessments.id_assessment
      INNER JOIN users ON assessment_register.register = users.register
      LEFT JOIN users g ON users.manager = g.register
    WHERE 
      assessment_register.register = users.register
      ${
        user.typeUser === 1 ? "AND users.manager = '" + user.register + "'" : ""
      } 
      ${
        user.typeUser === 2
          ? "AND users.register = '" + user.register + "'"
          : ""
      } 
      ${filterManager && "AND users.manager = '" + filterManager + "'"} 
      ${filterEmployee && "AND users.register = '" + filterEmployee + "'"} 
      ${
        filterTypeAssessment &&
        "AND assessment_register.id_assessment = " + filterTypeAssessment
      } 
      ${
        filterStartDate &&
        "AND assessment_register.date_time >= '" + filterStartDate + "'"
      } 
      ${
        filterEndDate &&
        " AND assessment_register.date_time <= '" + filterEndDate + "'"
      } 
    ORDER BY assessment_register.date_time DESC`;

    await api.post("/assessment/register/filter", [string]).then((response) => {
      setAssessment(response.data);
    });
    setShowloader(false);
  };

  const handleSelectManager = (e) => {
    setFilterManager(e);

    api.get(`/user/manager/${e}`).then((response) => {
      setEmployees(response.data);
    });
  };

  return (
    <main className={style.mainContent}>
      <Modal
        selectAssessment={selectAssessment}
        setSelectAssessment={setSelectAssessment}
        setAssessment={setAssessment}
        modalIsOpen={modalIsOpen}
        setModalIsOpenToFalse={setModalIsOpenToFalse}
        resultValue={resultValue}
      />
      <h1>Consultar Avaliações</h1>
      {showFilterSection ? (
        <form onSubmit={(e) => handleFilter(e)}>
          <div className={style.mainContent__filters}>
            {user.typeUser === 0 && (
              <div className={style.mainContent__filters__item}>
                <p>Gestor</p>
                <select onChange={(e) => handleSelectManager(e.target.value)}>
                  <option value="">Todos</option>
                  {manager.map((item) => (
                    <option value={item.register} key={item.register}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {user.typeUser !== 2 && (
              <div className={style.mainContent__filters__item}>
                <p>Colaborador</p>
                <select onChange={(e) => setFilterEmployee(e.target.value)}>
                  <option value="">Todos</option>
                  {employees.map((item) => (
                    <option value={item.register} key={item.register}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className={style.mainContent__filters__item}>
              <p>Tipo de avaliação</p>
              <select onChange={(e) => setFilterTypeAssessment(e.target.value)}>
                <option value="">Todos</option>
                {typeAssessment.map((item) => (
                  <option value={item.id_assessment} key={item.id_assessment}>
                    {item.title}
                  </option>
                ))}
              </select>
            </div>
            <div className={style.mainContent__filters__item}>
              <p>Data Inicio</p>
              <input
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
              />
            </div>
            <div className={style.mainContent__filters__item}>
              <p>Data Final</p>
              <input
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
              />
            </div>
          </div>
          <div className={style.mainContent__submit_button}>
            <button>Filtrar</button>
          </div>
        </form>
      ) : (
        <div className={style.mainContent__filter_button}>
          <button onClick={() => setShowFilterSection(true)}>
            Ver filtros
          </button>
        </div>
      )}
      <div>{showFilterLoader && <Loader />}</div>
      {showLoader ? (
        <Loader />
      ) : (
        <section className={style.mainContent__assessment_card}>
          {assessment.length !== 0 ? (
            assessment.map((item) => (
              <div
                onClick={() => setModalIsOpenToTrue(item)}
                key={item.id_assessment_register}
              >
                <p><strong>{item.title}</strong></p>
                <p>Gestor: {item.manager_name}</p>
                <p>Avaliado: {item.name}</p>
                <p>
                  Data:{" "}
                  {new Intl.DateTimeFormat("pt-BR").format(
                    new Date(item.date_time)
                  )}
                </p>
                {item.status === 0 ? (
                  <p className={style.mainContent__assessment_card__invalid}>
                    AGUARDANDO VALIDAÇÃO
                  </p>
                ) : (
                  <p className={style.mainContent__assessment_card__valid}>
                    VALIDADO
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className={style.mainContent__assessment_card__message}>
              Nenhum resultado encontrado!
            </p>
          )}
        </section>
      )}
    </main>
  );
}
