    import axios from "axios";

    const axiosInstance = axios.create({
        baseURL: 'https://127.0.0.1:8000/',
        headers: {
            "Content-Type" : 'application/json'
        }
    })

    axiosInstance.interceptors.request.use((config) => {
        const token = localStorage.getItem('access')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    }, (error) => Promise.reject(error))

    axiosInstance.interceptors.response.use((response) => response, async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;
        
            try {
                const refresh = localStorage.getItem('refresh');
                const response = await axios.post('https://127.0.0.1:8000/api/token/refresh/', {refresh});

                localStorage.setItem('access', response.data.access);
                original.headers.Authorization = `Bearer ${response.data.access}`;

                return axiosInstance(original);
            } catch {
                localStorage.clear();
                window.location.href = '/login';
            }      
        }
        return Promise.reject(error)
    })

    export default axiosInstance;