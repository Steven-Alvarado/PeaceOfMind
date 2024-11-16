import apiClient from "./client";

// login
export const loginUser = async (email: string, password: string) => {
    const response = await apiClient.post('/api/auth/login', { email, password });
    return response.data;
};




