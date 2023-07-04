import { useQuestion } from "../../Hooks/useQuestion";
import style from "./styles.module.scss";

export function DescriptionField({ id, title, text, requiredField}) {
  const { question, setQuestion } = useQuestion();

  const handleChange = (e) => {
    const newArray = [...question];
    const arrayItemIndex = newArray.findIndex((item) => item.id === id);

    if (arrayItemIndex >= 0) {
      newArray[arrayItemIndex] = { id: id, value: e };
    } else {
      newArray.push({ id: id, value: e });
    }

    setQuestion(newArray);
  };

  return (
    <div className={style.container}>
      <p>- <strong>{title} {requiredField === 1 && <span className={style.container__required_field}>*</span>}</strong></p>
      <p>{text}</p>
      <textarea onChange={(e) => handleChange(e.target.value)} />
    </div>
  );
}
