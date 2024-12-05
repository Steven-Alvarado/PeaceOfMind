import axios from "axios";

const sendPasswordResetEmail = async (email: string): Promise<void> => {
    try {
      await axios.post("/api/auth/forgot-password", { email });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Failed to send password reset email");
    }
};

const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    try {
      await axios.post(`/api/auth/reset-password`, { token, newPassword });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Failed to reset password");
    }
};

export { sendPasswordResetEmail, resetPassword };