import { Link, useParams } from "react-router-dom";
import style from "./styles.module.scss";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { Loader } from "../../components/Loader";
import { Toaster, toast } from "react-hot-toast";
import LogoBrasterapica from "../../assets/images/Logo.png";

export function Validation() {
  const [currentAssessment, setCurrentAssessment] = useState({});
  const [currentAssessmentAnswers, setCurrentAssessmentAnswers] = useState([]);
  const [resultValue, setResultValue] = useState(0);

  const [showLoader, setShowloader] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [showAssessmentContent, setShowAssessmentContent] = useState(false);
  const [showMensageAlert, setShowMensageAlert] = useState(false);

  const { code } = useParams("/validation/:code");

  useEffect(() => {
    const validateAssessment = async () => {
      await api.get(`/assessment/register/${code}`).then(async (response) => {
        if (response.data.length !== 0) {
          setCurrentAssessment(response.data[0]);

          await api.get(`/answer/assessment/${code}`).then((response) => {
            setCurrentAssessmentAnswers(response.data);
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
            setShowAssessmentContent(true);
          });
        }
      });

      setShowloader(false);
    };

    validateAssessment();
    // eslint-disable-next-line
  }, []);

  const handleValidation = async () => {
    const newData = {
      date: `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${new Date()
        .getDate()
        .toString()
        .padStart(2, "0")} ${new Date()
        .getHours()
        .toString()
        .padStart(2, "0")}:${new Date()
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${new Date()
        .getSeconds()
        .toString()
        .padStart(2, "0")}`,
      email: currentAssessment.email,
    };

    if (currentAssessment.status === 0) {
      api.put(`/assessment/register/update/${code}`, newData);
      setShowAssessmentContent(false);
      setShowMensageAlert(true);
    } else {
      toast.error("Avaliação já validada!");
    }
  };

  return (
    <div className={style.container}>
      <Toaster />
      <header className={style.container__logo}>
        <nav>
          <Link to="/">
            <img src={LogoBrasterapica} alt="Brasterápica Logo" />
          </Link>
        </nav>
      </header>
      <div className={style.content}>
        <main className={style.mainContent}>
          {showLoader && <Loader />}
          {showAssessmentContent && (
            <section className={style.mainCard}>
              <h1>{currentAssessment.title}</h1>
              <section className={style.modal_content}>
                <section className={style.modal_content__user}>
                  <p>Nome: {currentAssessment.name}</p>
                  <p>
                    Data de envio:{" "}
                    {new Intl.DateTimeFormat("pt-BR").format(
                      new Date(currentAssessment.date_time)
                    )}
                  </p>
                </section>
                {currentAssessment.id_assessment === 0 ? (
                  <section>
                    <div className={style.modal_content__result}>
                      <h2>Registro do feedback</h2>
                      <p className={style.modal_content__card__resultLabel}>
                        {currentAssessmentAnswers[0].value}
                      </p>
                    </div>
                  </section>
                ) : (
                  <>
                    <section className={style.modal_content__result}>
                      <h2>Síntese dos Resultados</h2>
                      {resultValue > 3 && resultValue <= 4 && (
                        <p className={style.modal_content__result__label}>
                          Acima do Esperado
                        </p>
                      )}
                      {resultValue > 2 && resultValue <= 3 && (
                        <p className={style.modal_content__result__label}>
                          Atinge o Esperado
                        </p>
                      )}
                      {resultValue > 1.5 && resultValue <= 2 && (
                        <p className={style.modal_content__result__label}>
                          Atinge Parcialmente o esperado
                        </p>
                      )}
                      {resultValue <= 1.5 && (
                        <p className={style.modal_content__result__label}>
                          Abaixo do Esperado
                        </p>
                      )}
                    </section>
                    <section className={style.modal__details_button}>
                      {showDetails ? (
                        <button onClick={() => setShowDetails(false)}>
                          Ocultar detalhes
                        </button>
                      ) : (
                        <button onClick={() => setShowDetails(true)}>
                          Ver detalhes da avaliação
                        </button>
                      )}
                    </section>
                    {showDetails && (
                      <section>
                        <h2>Indicadores de Desempenho</h2>
                        {currentAssessmentAnswers.map((assessment, index) => (
                          <div
                            key={index}
                            className={style.modal_content__card}
                          >
                            {!isNaN(assessment.value) && (
                              <>
                                <p>
                                  <strong>{assessment.title}:</strong>{" "}
                                  {assessment.text}
                                </p>
                                {assessment.value > 3 &&
                                  assessment.value <= 4 && (
                                    <p
                                      className={
                                        style.modal_content__card__resultLabel
                                      }
                                    >
                                      Acima do Esperado
                                    </p>
                                  )}
                                {assessment.value > 2 &&
                                  assessment.value <= 3 && (
                                    <p
                                      className={
                                        style.modal_content__card__resultLabel
                                      }
                                    >
                                      Atinge o Esperado
                                    </p>
                                  )}
                                {assessment.value > 1.5 &&
                                  assessment.value <= 2 && (
                                    <div
                                      className={
                                        style.modal_content__card__resultLabel
                                      }
                                    >
                                      <p>Atinge Parcialmente o esperado</p>
                                      <p>
                                        <strong>Justificativa: </strong>{" "}
                                        {assessment.justification}
                                      </p>
                                    </div>
                                  )}
                                {assessment.value <= 1.5 && (
                                  <div
                                    className={
                                      style.modal_content__card__resultLabel
                                    }
                                  >
                                    <p>Abaixo do Esperado</p>
                                    <p>
                                      <strong>Justificativa:</strong>{" "}
                                      {assessment.justification}
                                    </p>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                        {currentAssessmentAnswers.map((assessment, index) => (
                          <div
                            key={index}
                            className={style.modal_content__card}
                          >
                            {isNaN(assessment.value) && (
                              <>
                                <p>
                                  <strong>{assessment.title}:</strong>{" "}
                                  {assessment.text}
                                </p>
                                <p
                                  className={
                                    style.modal_content__card__resultLabel
                                  }
                                >
                                  {assessment.value}
                                </p>
                              </>
                            )}
                          </div>
                        ))}
                      </section>
                    )}
                  </>
                )}
                <div className={style.main_content__validation_button}>
                  <button onClick={() => handleValidation()}>
                    Validar Avaliação
                  </button>
                </div>
              </section>
            </section>
          )}
          {Object.keys(currentAssessment).length === 0 && (
            <p className={style.main_content__message}>
              Nenhuma avaliação encontrada
            </p>
          )}
          {showMensageAlert && (
            <>
              <h1>GP performance</h1>
              <p className={style.main_content__message}>
                Avaliação valiada com sucesso!
              </p>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
