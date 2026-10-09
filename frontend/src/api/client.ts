
import axios from 'axios'


const apiClient = axios.create({
    //baseURL:"http://localhost:8000"
    baseURL:"https://yb3fn55fhnemto35linrxfg3m40pzpyj.lambda-url.us-east-2.on.aws/"
})

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("agricoreToken")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})



export default apiClient
