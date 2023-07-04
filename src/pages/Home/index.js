import { Link } from "react-router-dom";
import style from "./styles.module.scss";
import { useAuth } from "../../Hooks/useAuth";
import { useEffect } from "react";

export function Home() {
  const { user } = useAuth();

  return (
      <main className={style.menu}>
        <h1>Selecione o que deseja realizar</h1>
        <div className={style.menu__buttons}>
          {user.typeUser !== 2 && <Link to="/register">Realizar Avaliação</Link>}
          <Link to="/Consult">Consultar Avaliações</Link>
        </div>
      </main>
  );
}
