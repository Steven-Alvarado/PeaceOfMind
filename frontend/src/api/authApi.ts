import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const sendPasswordResetEmail = async (email: string): Promise<void> => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Failed to send password reset email");
    }
};

const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/reset-password`, { token, newPassword });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Failed to reset password");
    }
};

export { sendPasswordResetEmail, resetPassword };