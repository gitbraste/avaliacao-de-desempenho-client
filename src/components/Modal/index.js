import { useState } from "react";
import style from "./styles.module.scss";
import ReactModal from 'react-modal';

export function Modal({ modalIsOpen, selectAssessment, resultValue, setModalIsOpenToFalse }) {
    const [showDetails, setShowDetails] = useState(false);

    const onModalClose=()=>{
        setModalIsOpenToFalse();
        setShowDetails(false);
    }

    return (
        <ReactModal
            isOpen={modalIsOpen}
            onRequestClose={onModalClose}
            ariaHideApp={false}
        >
            {selectAssessment.length !== 0 &&
                <section className={style.modal_content}>
                    <section className={style.modal_content_close_button}>
                        <button onClick={() => onModalClose()}>x</button>
                    </section>
                    <section className={style.modal_content__user}>
                        <p>Nome: {selectAssessment[0].name}</p>
                        <p>cargo: {selectAssessment[0].position}</p>
                        <p>Data de envio: {new Intl.DateTimeFormat('pt-BR').format(new Date(selectAssessment[0].date_time))}</p>
                    </section>
                    <section className={style.modal_content__result}>
                        <h2>Síntese dos Resultados</h2>
                        <p>Pontuação Total:</p>
                        {(resultValue > 3 && resultValue <= 4) && <p className={style.modal_content__result__label}>Acima do Esperado</p>}
                        {(resultValue > 2 && resultValue <= 3) && <p className={style.modal_content__result__label}>Atinge o Esperado</p>}
                        {(resultValue > 1.5 && resultValue <= 2) && <p className={style.modal_content__result__label}>Atinge Parcialmente o esperado</p>}
                        {(resultValue <= 1.5) && <p className={style.modal_content__result__label}>Abaixo do Esperado</p>}
                        {showDetails ? <button onClick={() => setShowDetails(false)}>Ocultar detalhes</button> : <button onClick={() => setShowDetails(true)}>ver detalhes</button>}
                    </section>
                    {showDetails &&
                        <>  
                        <section>
                            <h2>Dados de validação</h2>
                            {selectAssessment[0].validation_date ? 
                            <>
                                <p>Data de validação: {new Date(selectAssessment[0].validation_date).toLocaleString('pt-BR')}</p>
                                <p>Email de validação: {selectAssessment[0].validation_email}</p>
                            </>
                            :
                                <p>Aguardando validação pelo avaliado</p>
                            }
                        </section>
                            <section>
                                <h2>Indicadores de Desempenho</h2>
                                {selectAssessment.map((assessment, index) => (
                                    <div key={index} className={style.modal_content__card}>
                                        <p><strong>{assessment.title}:</strong> {assessment.text}</p>
                                        {(assessment.value > 3 && assessment.value <= 4) && <p className={style.resultLabel}>Acima do Esperado</p>}
                                        {(assessment.value > 2 && assessment.value <= 3) && <p className={style.resultLabel}>Atinge o Esperado</p>}
                                        {(assessment.value > 1.5 && assessment.value <= 2) && <p className={style.resultLabel}>Atinge Parcialmente o esperado</p>}
                                        {(assessment.value <= 1.5) && <p className={style.resultLabel}>Abaixo do Esperado</p>}
                                    </div>
                                ))}
                            </section>
                            <section>
                                <h2>Informações Adicionais do Gestor</h2>
                                <p>{selectAssessment[0].description}</p>
                            </section>
                            <section>
                                <h2>Informações Adicionais do Colaborador</h2>
                                <p>{selectAssessment[0].description_employee}</p>
                            </section>
                        </>
                    }
                </section>
            }
        </ReactModal>
    )
}