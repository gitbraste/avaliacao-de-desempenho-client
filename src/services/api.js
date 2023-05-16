import axios from "axios";

const api = axios.create({
  baseURL: "https://avaliacaodesempenhoapi.azurewebsites.net/api",
});

export default api;
