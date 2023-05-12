import { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import style from "./styles.module.scss";
import api from "../../services/api";
import { StaffForm } from "../../components/StaffForm";
import { Link, useNavigate } from "react-router-dom";
import { LeaderForm } from "../../components/LeaderForm";
import LoaderIcon from "../../assets/images/loader.svg";

export function Assessment({ manager, selectEmployee }) {
  const [resultValue, setResultValue] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionEmployee, setDescriptionEmployee] = useState("");

  const [StaffFormQuestions, setStaffFormQuestions] = useState([]);
  const [leaderFormQuestions, setLeaderFormQuestions] = useState([]);

  const [showGuidanceSection, setShowGuidanceSection] = useState(true);
  const [showFormSection, setShowFormSection] = useState(false);
  const [showResultSection, setShowResultSection] = useState(false);
  const [showMensageLowValue, setShowMensageLowValue] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  const [isAllValid, setIsAllValid] = useState(true);
  const [scores, setScores] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    if (manager.length === 0) {
      navigate("/");
    };
  }, []);

  useEffect(() => {
    let result = (Object.values(scores)).reduce((acc, val) => acc + val, 0) / Object.keys(scores).length.toFixed(2);
    { (result > 3 && result <= 4) && setResultValue("Acima do Esperado") }
    { (result > 2 && result <= 3) && setResultValue("Atinge o Esperado") }
    { (result > 1.5 && result <= 2) && setResultValue("Atinge Parcialmente o esperado") }
    { (result <= 1.5) && setResultValue("Abaixo do Esperado") }
  }, [scores]);

  const handleGetQuestion = () => {
    api.get(`/question/type/${selectEmployee.type_user}`)
      .then((response) => {
        selectEmployee.type_user === 0 ? setStaffFormQuestions(response.data) : setLeaderFormQuestions(response.data);
        setShowLoader(false); 
      });
  };

  const handleSaveAnswers = (id) => {
    let assessmentAnswers = [];

    {
      selectEmployee.type_user === 0 ?
        StaffFormQuestions.forEach((element, i) => {
          assessmentAnswers.push({
            id_assessment: id,
            id_question: element.id_question,
            value: scores[element.title]
          });
        })
        :
        leaderFormQuestions.forEach((element, i) => {
          assessmentAnswers.push({
            id_assessment: id,
            id_question: element.id_question,
            value: scores[element.title]
          });
        })
    };

    api.post(`/answer/create/`, assessmentAnswers);

    setShowLoader(false);
    setShowFormSection(false); setShowResultSection(true)
  }

  const handleResult = () => {
    let isValid = true;
    setShowLoader(true);
    setShowMensageLowValue(false);

    {
      selectEmployee.type_user === 0 ?
        StaffFormQuestions.forEach((question) => {
          if ((scores[question.title] === 1 || scores[question.title] === 2) && !description) {
            isValid = false;
            setShowMensageLowValue(true);
          } else if (!scores[question.title]) {
            isValid = false;
          }
        })
        :
        leaderFormQuestions.forEach((question) => {
          if ((scores[question.title] === 1 || scores[question.title] === 2) && !description) {
            isValid = false;
            setShowMensageLowValue(true);
          } else if (!scores[question.title]) {
            isValid = false;
          }
        })
    }

    !isValid && setShowLoader(false);

    if (isValid) {
      const newDade = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')} ${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}:${new Date().getSeconds().toString().padStart(2, '0')}`;

      const newAssessment = {
        register: selectEmployee.register.toString(),
        date_time: newDade,
        description: description,
        descriptionEmployee: descriptionEmployee,
        emailEmployee: selectEmployee.email,
        nameEmployee: selectEmployee.name,
        emailManager: manager[0].email,
        nameManager: manager[0].name,
        resultValue: resultValue
      }

      api.post(`/Assessment/create`, JSON.stringify(newAssessment), { headers: { 'Content-Type': 'application/json' } })
        .then((response) => {
          handleSaveAnswers(response.data);
        });
    } else {
      setIsAllValid(false);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.content}>
        <Header />
        <main className={style.mainContent}>
          <h1>Formulário de Avaliação Anual</h1>
          <section className={style.summary}>
            {manager.length !== 0 && <p><strong>Responsável: </strong>{manager[0].name}</p>}
            <p><strong>Colaborador: </strong>{selectEmployee.name}</p>
          </section>
          {showGuidanceSection &&
            <>
              <section className={style.guidance}>
                <h2>Orientações para Preenchimento dos Campos do Formulário de Avaliação</h2>
                <p>Ao avaliar o colaborador esteja certo de que está avaliando o aspecto profissional deixando de lado qualquer tipo de situação de ordem pessoal. Seja neutro em sua avaliação!
                  Faça a avaliação de acordo com a escala abaixo: </p>
              </section>
              <section className={style.conceptsContainer}>
                <div className={style.conceptsContent}>
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
                  <p><strong>*Os indicadores avaliados com a classificação 1 e 2 são obrigatórios a sua justificativa, para melhor entendimento e desenvolvimento.</strong></p>
                </div>
                <div className={style.conceptsDescription}>
                  <p><strong>CAMPO I - INDICADORES DE DESEMPENHO</strong><br />
                    A chefia imediata avaliará o colaborador em relação aos indicadores de desempenho descritos atribuindo uma pontuação para cada indicador, utilizando a escala de avaliação estabelecida.</p>
                  <p><strong>CAMPO II - ESPAÇO RESERVADO PARA INFORMAÇÕES ADICIONAIS E IMPORTANTES A SEREM REGISTRADAS </strong>
                    (Ex: Treinamentos necessários, Potencial apresentado, Melhorias, Relatos, justificativas de pontuação entre outros)    </p>
                  <p><strong>CAMPO III - SÍNTESE DOS RESULTADOS </strong><br />
                    Ao final do período avaliativo, a chefia imediata avaliará o desempenho efetuando a transferência do somatório da pontuação para este campo, obtendo a Síntese dos Resultados e classificando o desempenho do colaborador de acordo com o Relatório Final de Desempenho. </p>
                  {/* {selectEmployee.type_user === 0 && <p><strong>CAMPO IV - INFORMAÇÕES ADMINISTRAÇÃO DE PESSOAS</strong><br />
                    De acordo com as informações obtidas pelo setor de Administração de Pessoas o  avaliador informará ao colaborador de sua situação.</p>
                  } */}
                </div>
              </section>
              <section className={style.buttonContent}>
                <button onClick={() => { setShowGuidanceSection(false); setShowFormSection(true); setIsAllValid(true); handleGetQuestion() }}>Continuar</button>
              </section>
            </>
          }
          {showFormSection && showLoader &&
              <div className={style.loaderContent}>
                <img src={LoaderIcon} alt="" />
              </div>
          }
          {showFormSection && !showLoader &&
            <>
              <section>
            {selectEmployee.type_user === 0 ?
              StaffFormQuestions.length !== 0 &&
              <StaffForm
                scores={scores}
                setScores={setScores}
                StaffForm={StaffFormQuestions}
              />
              :
              leaderFormQuestions.length !== 0 &&
              <LeaderForm
                scores={scores}
                setScores={setScores}
                leaderForm={leaderFormQuestions}
              />
            }
            </section>
            <section className={style.thirdForm}>
              <h2>Informações Adicionais do Gestor</h2>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </section>
            <section className={style.thirdForm}>
              <h2>Informações Adicionais do Colaborador</h2>
              <textarea
                value={descriptionEmployee}
                onChange={(e) => setDescriptionEmployee(e.target.value)}
              />
            </section>
            {!isAllValid &&
              <p className={style.alertMessage}>Preencha todos os campos corretamente!!</p>
            }
            {showMensageLowValue &&
              <p className={style.alertMessage}>Insira no campo <strong>Informações Adicionais do Gestor</strong> uma justificativa para a nota<strong> abaixo do esperado</strong> ou <strong>atinge parcialmente o esperado</strong> atribuida ao colaborador</p>
            }
            <section className={style.buttonContent}>
              <button onClick={() => { setShowGuidanceSection(true); setShowFormSection(false) }}>Voltar</button>
              <button onClick={() => { handleResult() }}>Exibir resultado</button>
            </section>
              {showLoader && <div className={style.loaderContent}>
                <img src={LoaderIcon} alt="" />
              </div>}
            </>
          }
          {showResultSection &&
            <>
              <section className={style.fourthForm}>
                <h2>Síntese dos Resultados</h2>
                <p>Pontuação Total: </p>
                <p className={style.result}>{resultValue}</p>
              </section>
              <section className={style.sendButton}>
                <Link to="/">Finalizar</Link>
              </section>
            </>
          }
        </main>
      </div>
    </div>
  );
}