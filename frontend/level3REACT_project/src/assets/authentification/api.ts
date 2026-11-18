import axios from "axios";
import { supabase } from "../supabaseClient";

export function errorHandler(error: any) {
  let errorMsg = `Error: ${error.response?.data?.detail || error.message}`;
  return errorMsg;
}

export const api = axios.create({
  baseURL: "https://level3finalproject.onrender.com",
});

api.interceptors.request.use(
  async (config) => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
