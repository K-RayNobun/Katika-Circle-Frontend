import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://blank-lynde-fitzgerald-ef8fba55.koyeb.app',
    timeout: 10 * 1000,
    
});

export default axiosInstance;