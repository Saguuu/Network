import axios from "axios";

const instance = axios.create({
    baseURL: "http://xennetwork.herokuapp.com",
});

export default instance;