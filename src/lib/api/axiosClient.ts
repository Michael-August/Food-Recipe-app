import axios, { AxiosInstance } from "axios";

const axiosClient: AxiosInstance = axios.create({
  baseURL: 'https://api.spoonacular.com',
  timeout: 5000000,
});

// I can have various interceptors here

export { axiosClient }
