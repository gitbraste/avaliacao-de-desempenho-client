import { useState } from "react";
import { useQuestion } from "../../Hooks/useQuestion";
import style from "./styles.module.scss";

export function Question({id, title, text }) {
  const { question, setQuestion } = useQuestion();
  const [showValidationField, setShowValidationField] = useState(false);

  const handleChange = (e) => {
    if (parseInt(e) <= 2) {
      setShowValidationField(true);
    } else {
      setShowValidationField(false);
    }

    const newArray = [...question];
    const arrayItemIndex = newArray.findIndex((item) => item.id === id);

    if (arrayItemIndex >= 0) {
      newArray[arrayItemIndex] = { id: id, value: e };
    } else {
      newArray.push({ id: id, value: e });
    }

    setQuestion(newArray);
  };

  const handleJustification = (e) => {
    const updatedArray = question.map((item) => {
      if (item.id === id) {
        return { ...item, justification: e };
      }
      return item;
    });

    setQuestion(updatedArray);
  };

  return (
    <div className={style.container}>
      <p>
        - <strong>{title} <span className={style.container__required_field}>*</span></strong>
      </p>
      <p>{text}</p>
      <div className={style.content}>
        <div>
          <input
            type="radio"
            name={title}
            value="1"
            onChange={(e) => handleChange(e.target.value)}
          />
          <label>Abaixo do esperado</label>
        </div>
        <div>
          <input
            type="radio"
            name={title}
            value="2"
            onChange={(e) => handleChange(e.target.value)}
          />
          <label>Atinge parcialmente o esperado</label>
        </div>
        <div>
          <input
            type="radio"
            name={title}
            value="3"
            onChange={(e) => handleChange(e.target.value)}
          />
          <label>Atinge o esperado</label>
        </div>
        <div>
          <input
            type="radio"
            name={title}
            value="4"
            onChange={(e) => handleChange(e.target.value)}
          />
          <label>Acima do esperado</label>
        </div>
      </div>
      {showValidationField && (
        <div className={style.container__justification}>
          <p>
            Justifique a nota<strong> abaixo do esperado</strong> ou{" "}
            <strong>atinge parcialmente o esperado</strong> atribuida ao
            colaborador
          </p>
          <textarea onChange={(e) => handleJustification(e.target.value)} />
        </div>
      )}
    </div>
  );
}
