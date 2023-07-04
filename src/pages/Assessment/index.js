import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import style from "./styles.module.scss";
import api from "../../services/api";
import LoaderIcon from "../../assets/images/loader.svg";
import { Form } from "../../components/Form";
import { useEmployee } from "../../Hooks/useEmployee";
import { useAuth } from "../../Hooks/useAuth";
import { Toaster, toast } from "react-hot-toast";
import { useQuestion } from "../../Hooks/useQuestion";

export function Assessment() {
  const { user } = useAuth();
  const { employee, assessment } = useEmployee();
  const { question } = useQuestion();

  const [resultValue, setResultValue] = useState("");
  const [formQuestions, setFormQuestions] = useState([]);

  const [showGuidanceSection, setShowGuidanceSection] = useState(true);
  const [showFormSection, setShowFormSection] = useState(false);
  const [showResultSection, setShowResultSection] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!Object.keys(employee).length) {
      navigate("/register");
    }

    if(assessment.id_assessment === 0){
      handleGetQuestion();
      setShowGuidanceSection(false);
      setShowFormSection(true);
    }
    // eslint-disable-next-line
  }, []);

  const handleGetQuestion = () => {
    api
      .get(`/question/assessment/${assessment.id_assessment}`)
      .then((response) => {
        setFormQuestions(response.data);
        setShowLoader(false);
      });
  };

  const handleSaveAnswers = (id) => {
    api.post(`/answer/create/`, [id, question]);

    setShowLoader(false);
    setShowFormSection(false);
    setShowResultSection(true);
  };

  const handleResult = () => {
    let isValid = true;
    let resultMensage;
    setShowLoader(true);

    formQuestions.forEach((formQuestionsItem) => {
      const found = question.find(
        (element) => element.id === formQuestionsItem.id_question
      );
      if (
        (!found && formQuestionsItem.required_field === 1) ||
        (found && found.value <= 2 && !found.justification)
      ) {
        isValid = false;
      }
    });

    !isValid && setShowLoader(false);

    if (isValid) {
      let result = 0;
      let cont = 0;

      question.forEach((item) => {
        if (!isNaN(parseInt(item.value))) {
          cont++;
          result += parseInt(item.value);
        }
      });

      result = result / cont;

      if (result <= 1.5) {
        resultMensage = "Abaixo do esperado";
      } else if (result > 1.5 && result <= 2) {
        resultMensage = "Atinge parcialmente esperado";
      } else if (result > 2 && result <= 3) {
        resultMensage = "Atinge o esperado";
      } else if (result > 3 && result <= 4) {
        resultMensage = "Acima do esperado";
      }

      setResultValue(resultMensage);

      const newDade = `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
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
        .padStart(2, "0")}`;

      const newAssessment = {
        id_assessment: assessment.id_assessment,
        register: employee.register.toString(),
        date_time: newDade,
        emailEmployee: employee.email,
        nameEmployee: employee.name,
        emailManager: user.email,
        nameManager: user.name,
        resultValue: resultMensage,
      };

      api
        .post(`/assessment/register/create`, JSON.stringify(newAssessment), {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          handleSaveAnswers(response.data);
        }).catch((err) => {
          toast.error("Houve um problema durante de execução, tente novamente!");
        });
    } else {
      toast.error("Preencha todos os campos corretamente!!");
    }
  };

  return (
    <main className={style.main_content}>
      <Toaster />
      <h1>{assessment.title}</h1>
      <section className={style.main_content__summary}>
        <p>
          <strong>Colaborador: </strong>
          {employee.name}
        </p>
      </section>
      {showGuidanceSection && (
        <>
          <section className={style.main_content__guidance}>
            <h2>Orientações para Preenchimento dos Campos</h2>
            <p>
              Ao avaliar o colaborador esteja certo de que está avaliando o
              aspecto profissional deixando de lado qualquer tipo de situação de
              ordem pessoal. Seja neutro em sua avaliação! Faça a avaliação de
              acordo com a escala abaixo:
            </p>
          </section>
          <section>
            <div className={style.main_content__concepts_content}>
              <h2>Conceitos</h2>
              <table>
                <tbody>
                  <tr>
                    <td>4 - ACIMA DO ESPERADO</td>
                    <td>2 - ATINGE PARCIALMENTE O ESPERADO</td>
                  </tr>
                  <tr>
                    <td>3 - ATINGE O ESPERADO</td>
                    <td>1 - ABAIXO DO ESPERADO</td>
                  </tr>
                </tbody>
              </table>
              <p>
                <strong>
                  *Os indicadores avaliados com a classificação Abaixo do esperado e Atinge parcialmente o esperado são
                  obrigatórios a sua justificativa, para melhor entendimento e
                  desenvolvimento.
                </strong>
              </p>
            </div>
            <div className={style.main_content__concepts_description}>
              <p>
                <strong>INDICADORES DE DESEMPENHO</strong>
                <br />A chefia imediata avaliará o colaborador em relação aos
                indicadores de desempenho descritos atribuindo uma pontuação
                para cada indicador, utilizando a escala de avaliação
                estabelecida.
              </p>
              <p>
                <strong>
                  ESPAÇO RESERVADO PARA INFORMAÇÕES ADICIONAIS E IMPORTANTES A
                  SEREM REGISTRADAS
                </strong>
                (Ex: Treinamentos necessários, Potencial apresentado, Melhorias,
                Relatos, justificativas de pontuação entre outros)
              </p>
              <p>
                <strong>SÍNTESE DOS RESULTADOS </strong>
                <br />
                Ao final do período avaliativo, a chefia imediata avaliará o
                desempenho efetuando a transferência do somatório da pontuação
                para este campo, obtendo a Síntese dos Resultados e
                classificando o desempenho do colaborador de acordo com o
                Relatório Final de Desempenho.
              </p>
            </div>
          </section>
          <section className={style.main_content__button_content}>
            <button
              onClick={() => {
                setShowGuidanceSection(false);
                setShowFormSection(true);
                handleGetQuestion();
              }}
            >
              Continuar
            </button>
          </section>
        </>
      )}
      {showFormSection && showLoader && (
        <div className={style.main_content__loader_content}>
          <img src={LoaderIcon} alt="" />
        </div>
      )}
      {showFormSection && !showLoader && (
        <>
          <section>
            <Form formQuestions={formQuestions} />
          </section>
          <p className={style.main_content__required_field}>* Obrigatório</p>
          <section className={style.main_content__button_content}>
            <button
              onClick={() => {
                setShowGuidanceSection(true);
                setShowFormSection(false);
              }}
            >
              Voltar
            </button>
            <button
              onClick={() => {
                handleResult();
              }}
            >
              Exibir resultado
            </button>
          </section>
          {showLoader && (
            <div className={style.loaderContent}>
              <img src={LoaderIcon} alt="" />
            </div>
          )}
        </>
      )}
      {showResultSection && (
        <>
          <section className={style.fourthForm}>
            {assessment.id_assessment === 0 ? (
              <p className={style.result}>Feedback registrado</p>
            ) : (
              <>
                <h2>Síntese dos Resultados</h2>
                <p>Pontuação Total: </p>
                <p className={style.result}>{resultValue}</p>
              </>
            )}
          </section>
          <section className={style.sendButton}>
            <Link to="/">Finalizar</Link>
          </section>
        </>
      )}
    </main>
  );
}