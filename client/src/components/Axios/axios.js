import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const useAxios = () => {
  const { getToken } = useAuth();

  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL, 
    withCredentials: true,
  });

  axiosInstance.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
  
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return axiosInstance;
};

export default useAxios;
