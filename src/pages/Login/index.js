import { useState } from "react";
import api from "../../services/api";
import style from "./styles.module.scss";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { Loader } from "../../components/Loader";
import { useAuth } from "../../Hooks/useAuth";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";

export function Login() {
  const { Authenticate } = useAuth();
  const [manager, setManager] = useState({});
  const [register, setRegister] = useState("");
  const [showManagerField, setShowManagerField] = useState(true);
  const [showCodeField, setShowCodeField] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [validCode, setValidCode] = useState(null);
  const [inputCode, setInputCode] = useState("");

  const navigate = useNavigate();

  const handleValidationCode = async (e) => {
    e.preventDefault();
    setShowLoader(true);

    if (validCode == inputCode) {
      await Authenticate(manager);
      navigate("/");
    } else {
      toast.error("Código inserido inválido!");
    }
    setShowLoader(false);
  };

  const sendEmail = async (data) => {
    setShowLoader(true);
    const code = Math.random().toString().slice(2, 8);
    setValidCode(code);

    const sendEmail = {
      email: data.email,
      code: code,
    };

    await api.post(`/email`, sendEmail).then(() => setShowCodeField(true)).then(()=>
      toast.success("Código enviado com sucesso!"),
      setShowManagerField(false),
      setShowCodeField(true),
      setManager(data)
    ).catch(()=>{
      toast.error("Houve um erro ao enviar seu email, tente novamente!");
    });
    setShowLoader(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setShowLoader(true);

    if(!register){
      return toast.error("Matricula Inválida, tente novamente!");
    }

    let managers;
    await api.get(`/user/all/manager`).then((response) => {
      managers = response.data;
    });

    await api
      .get(`/user/${register}`)
      .then((response) => {
        const [currentUser] = response.data;
        if(currentUser.department === '21003'){
          currentUser.typeUser = 0;
        }else if(managers.find(element => element.register === currentUser.register)){
          currentUser.typeUser = 1;
        }else{
          currentUser.typeUser = 2;
        }
        sendEmail(currentUser);
      })
      .catch((error) => {
        toast.error("Matricula Inválida, tente novamente!");
      });
      setShowLoader(false);
  };

  const hideEmail = (email) => {
    const splitEmail = email.split('@');
    const hideName = splitEmail[0].slice(0, 3) + '*'.repeat(5);
    
    return hideName + '@' + splitEmail[1];
  }

  return (
    <div className={style.container}>
      <Header showUserIcon={false} />
      <main className={style.main_content}>
        <Toaster />
        <h1>
          <span>Bem vindo ao</span> <br />
          GP Performance
        </h1>
        {showManagerField && (
          <>
            <p>Bem vindo de volta! Por favor, insira seus dados.</p>
            <form
              className={style.main_content__form_manager_field}
              onSubmit={(e) => handleRegister(e)}
            >
              <p>Digite sua matrícula: </p>
              <input
                type="text"
                value={register}
                onChange={(e) => setRegister(e.target.value)}
              />
              <button>Buscar</button>
            </form>
            <div className={style.LoaderContent}>
              {showLoader && <Loader />}
            </div>
          </>
        )}
        {showCodeField && (
          <>
            <p>
              Ensira o código de verificação enviado para o email {hideEmail(manager.email)}
            </p>
            <form
              onSubmit={(e) => handleValidationCode(e)}
              className={style.main_content__code_form}
            >
              <p>Código de verificação: </p>
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
              />
              <button>Confirmar</button>
              {showLoader && <Loader />}
            </form>
            <button className={style.main_content__new_code_field} onClick={()=>sendEmail(manager)}>Enviar novo código</button>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
