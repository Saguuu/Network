import axios from "axios";

const instance = axios.create({
    baseURL: "https://xennetwork.herokuapp.com",
});

export default instance;