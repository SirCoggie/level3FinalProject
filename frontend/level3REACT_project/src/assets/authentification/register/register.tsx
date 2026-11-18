import { api } from "../api";

export interface AuthCredentials {
  email: string;
  password: string;
  signup_code: string;
}

export interface RegisterResponse {
  message: string;
  user_id: string | null;
}

export const registerUser = async (credentials: AuthCredentials) => {
  const response = await api.post<RegisterResponse>(
    `/api/register`,
    credentials,
  );
  return response.data;
};
