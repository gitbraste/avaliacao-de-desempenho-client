import { Question } from "../Question";
import { DescriptionField } from "../DescriptionField";
import style from "./styles.module.scss";

export function Form({ formQuestions }) {
  return (
    <>
      <div className={style.container}>
        {formQuestions.map(formQuestion => (
          formQuestion.type === 1?  
            <Question
              key={formQuestion.id_question}
              id={formQuestion.id_question}
              title={formQuestion.title}
              text={formQuestion.description}
            />
          :
            <DescriptionField 
              key={formQuestion.id_question}
              id={formQuestion.id_question}
              title={formQuestion.title}
              text={formQuestion.description}
              requiredField={formQuestion.required_field}
            />
        ))}
      </div>
    </>
  )
}