import axios from "axios";

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
  const response = await axios.post<RegisterResponse>(
    "http://localhost:8000/api/register",
    credentials,
  );
  return response.data;
};
