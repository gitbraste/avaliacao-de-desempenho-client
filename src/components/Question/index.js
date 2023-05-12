import style from "./styles.module.scss";

export function Question({ title, text, indice, value, onSetValue }) {
    const handleChange =(e)=>{
        onSetValue(prevState => ({ ...prevState, [title]: parseInt(e)}))
    }

    return (
        <div className={style.container}>
            <p>- <strong>{title}:</strong></p>
            <p>{text}</p>
            <div className={style.content}>
                <div>
                    <input type="radio" name={title} value="1" onChange={(e)=>handleChange(e.target.value)}/>
                    <label>Abaixo do esperado</label>
                </div>
                <div>
                    <input type="radio" name={title} value="2" onChange={(e)=>handleChange(e.target.value)}/>
                    <label>Atinge parcialmente o esperado</label>
                </div>
                <div>
                    <input type="radio" name={title} value="3" onChange={(e)=>handleChange(e.target.value)}/>
                    <label>Atinge o esperado</label>
                </div>
                <div>
                    <input type="radio" name={title} value="4" onChange={(e)=>handleChange(e.target.value)}/>
                    <label>Acima do esperado</label>
                </div>
            </div>
        </div>
    );
}