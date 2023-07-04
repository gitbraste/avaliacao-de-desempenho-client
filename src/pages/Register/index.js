import { useEffect, useState } from "react";
import api from "../../services/api";
import style from "./styles.module.scss";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Hooks/useAuth";
import { useEmployee } from "../../Hooks/useEmployee";
import { Toaster, toast } from "react-hot-toast";
import { Loader } from "../../components/Loader";
import LoaderIcon from "../../assets/images/loader.svg";

export function Register() {
  const { user } = useAuth();
  const { setEmployee, setAssessment } = useEmployee();

  const [assessments, setAssessments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [manager, setManager] = useState([]);

  const [showLoader, setShowLoader] = useState(false);
  const [showFullLoader, setShowFullLoader] = useState(true);
  const [selectEmployee, setSelectEmployee] = useState("");
  const [typeAssessment, setTypeAssessment] = useState("");

  const navigate = useNavigate();

  useEffect(()=>{
    getAssessments();
    getEmployes();
    getManagers();
    // eslint-disable-next-line
  }, []);

  const getManagers = async () => {
    await api
        .get(`/user/all/manager`)
        .then((response) => {
          setManager(response.data);
        })
        
  }

  const getAssessments = async (data) => {
    await api.get(`/assessment/assessments`).then((response) => {
      setAssessments(response.data);
    });
  };

  const getEmployes = async (data) => {
    await api.get(`/user/manager/${user.register}`).then((response) => {
      setEmployees(response.data);
    });
    setShowFullLoader();
  };

  const validation = (e) => {
    e.preventDefault();

    if(!typeAssessment){
      toast.error("Selecione o tipo da avaliação");
    }else if(!selectEmployee) {
      toast.error("Selecione um colaborador para avaliar");
    }else if((manager.find((item)=>item.register === selectEmployee)) && typeAssessment === '3'){
      toast.error("O colaborador selecionado não pode realizar esse tipo de avalição");
    }else if(!(manager.find((item)=>item.register === selectEmployee)) && typeAssessment === '4'){
      toast.error("O colaborador selecionado não pode realizar esse tipo de avalição");
    }else{
      setShowLoader(true);
      const employeeData = employees.find((employee) => employee.register === selectEmployee);
      const assessmentData = assessments.find((assessment) => assessment.id_assessment === parseInt(typeAssessment));
      setEmployee(employeeData);
      setAssessment(assessmentData);
      navigate('/assessment');
    }
  };

  return (
    <main className={style.main_content}>
      <Toaster />
      <h1>Realizar avaliação de Performance</h1>
      {showFullLoader ? (
        <div className={style.main_content__loader_content}>
          <img src={LoaderIcon} alt="" />
        </div>
      ):(
      <form onSubmit={(e)=>validation(e)}>
        <section className={style.main_content__select_employee}>
          <p>Selecione quem deseja avaliar:</p>
          <select onChange={(e) => setSelectEmployee(e.target.value)}>
            <option value="">Selecionar</option>
            {employees.map((employee) => (
              <option key={employee.register} value={employee.register}>
                {employee.name}
              </option>
            ))}
          </select>
        </section>
        <section className={style.main_content__select_type_assessment}>
          <p>Selecione o tipo de avaliação de deseja realizar:</p>
          <div>
            {assessments.map(item => (
              <div key={item.id_assessment}>
                <input value={item.id_assessment} type="radio" id={item.id_assessment} name="x" onChange={(e)=>setTypeAssessment(e.target.value)}/>
                <label htmlFor={item.id_assessment}>{item.title}</label>
              </div>
            ))}
          </div>
        </section>
        <section className={style.main_content__submit_button}>
          <button>Iniciar Avaliação</button>
        </section>
      </form>)
      }
      {showLoader && <Loader />}
    </main>
  );
}
