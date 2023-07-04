import { useState } from "react";
import style from "./styles.module.scss";
import ReactModal from "react-modal";
import { CiCircleAlert, CiCircleCheck } from "react-icons/ci";
import { IconContext } from "react-icons";
import { useAuth } from "../../Hooks/useAuth";
import api from "../../services/api";
import { Toaster, toast } from "react-hot-toast";

export function Modal({
  modalIsOpen,
  selectAssessment,
  setSelectAssessment,
  setAssessment,
  setModalIsOpenToFalse,
  resultValue,
}) {

  const [showDetails, setShowDetails] = useState(false);
  const { user } = useAuth();

  const onModalClose = () => {
    setModalIsOpenToFalse();
    setShowDetails(false);
  };

  const handleValidationAssessment = async () => {
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
      email: selectAssessment[0].email,
    };

    await api.put(`/assessment/register/update/${selectAssessment[0].id_assessment_register}`, newData).then(async ()=>{
      toast.success("Avaliação Validada com sucesso!");

      await api.get(`/assessment/register/user/${user.register}`).then((response) => {
        setAssessment(response.data);
    })
    }).catch(()=>{
      toast.error("Não foi possivel validar, Tente novamente!")
    });

  }

  return (
    <ReactModal
      isOpen={modalIsOpen}
      onRequestClose={onModalClose}
      ariaHideApp={false}
    >
      <Toaster />
      {selectAssessment.length !== 0 && (
        <section className={style.modal_content}>
          <section className={style.modal_content_close_button}>
            <div className={style.modal_content_close_button__validation}>
              {selectAssessment[0].status === 1 ? (
                <>
                  <IconContext.Provider
                    value={{ size: "1.2em", color: "#0f0" }}
                  >
                    <p
                      className={
                        style.modal_content_close_button__validation_alert
                      }
                    >
                      <CiCircleCheck />
                      Avaliação Validada às{" "}
                      {new Date(
                        selectAssessment[0].validation_date
                      ).toLocaleString("pt-BR")}
                    </p>
                  </IconContext.Provider>
                </>
              ) : (
                <IconContext.Provider
                  value={{ size: "1.2em", color: "#ffbf00" }}
                >
                  <p
                    className={
                      style.modal_content_close_button__validation_alert
                    }
                  >
                    <CiCircleAlert /> Aguardando validação 
                      {selectAssessment[0].register === user.register && <><button onClick={()=>handleValidationAssessment()}>Clique aqui</button>para realizar a validação</>}
                  </p>
                    
                </IconContext.Provider>
              )}
            </div>
            <button onClick={() => onModalClose()}>x</button>
          </section>
          <section className={style.modal_content__user}>
            <p>Nome: {selectAssessment[0].name}</p>
            <p>
              Data de envio:{" "}
              {new Intl.DateTimeFormat("pt-BR").format(
                new Date(selectAssessment[0].date_time)
              )}
            </p>
          </section>
          {selectAssessment[0].id_assessment === 0 ? (
            <section>
                <div className={style.modal_content__result}>
                  <h2>Registro do feedback</h2>
                  <p className={style.modal_content__card__resultLabel}>
                    {selectAssessment[1][0].value}
                  </p>
                </div>
            </section>
          ) : (
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
              {showDetails ? (
                <button onClick={() => setShowDetails(false)}>
                  Ocultar detalhes
                </button>
              ) : (
                <button onClick={() => setShowDetails(true)}>
                  ver detalhes
                </button>
              )}
            </section>
          )}
          {showDetails && (
            <>
              <section>
                <h2>Indicadores de Desempenho</h2>
                {selectAssessment[1].map((assessment, index) => (
                  <div key={index} className={style.modal_content__card}>
                    {!isNaN(assessment.value) && (
                      <>
                        <p>
                          <strong>{assessment.title}:</strong> {assessment.text}
                        </p>
                        {assessment.value > 3 && assessment.value <= 4 && (
                          <p className={style.modal_content__card__resultLabel}>
                            Acima do Esperado
                          </p>
                        )}
                        {assessment.value > 2 && assessment.value <= 3 && (
                          <p className={style.modal_content__card__resultLabel}>
                            Atinge o Esperado
                          </p>
                        )}
                        {assessment.value > 1.5 && assessment.value <= 2 && (
                          <div
                            className={style.modal_content__card__resultLabel}
                          >
                            <p>Atinge Parcialmente o esperado</p>
                            <p>
                              <strong>Justificativa: </strong> {assessment.justification}
                            </p>
                          </div>
                        )}
                        {assessment.value <= 1.5 && (
                          <div
                            className={style.modal_content__card__resultLabel}
                          >
                            <p>Abaixo do Esperado</p>
                            <p>
                              <strong>Justificativa:</strong> {assessment.justification}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
                {selectAssessment[1].map((assessment, index) => (
                  <div key={index} className={style.modal_content__card}>
                    {isNaN(assessment.value) && (
                      <>
                        <p>
                          <strong>{assessment.title}:</strong> {assessment.text}
                        </p>
                        <p className={style.modal_content__card__resultLabel}>
                          {assessment.value}
                        </p>
                      </>
                    )}
                  </div>
                ))}
              </section>
            </>
          )}
        </section>
      )}
    </ReactModal>
  );
}
