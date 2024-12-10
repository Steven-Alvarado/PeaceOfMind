import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {sendPasswordResetEmail as apiSendPasswordResetEmail} from "../api/authApi";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Define User interface
export interface User {
  id: number;
  email: string;
  role: "student" | "therapist";
  firstName: string;
  lastName: string;
  token: string;
  therapistId?: number;
}

// Define the AuthContext properties
interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  registerUser: (
    firstName: string,
    lastName: string,
    gender: string,
    email: string,
    password: string,
    role: string
  ) => Promise<void>;
  registerTherapist: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    gender: string,
    licenseNumber: string,
    specialization: string,
    experienceYears: number,
    monthlyRate: number
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  fetchUser: () => Promise<void>;
  sendPasswordResetEmail: (
    email: string
  ) => Promise<void>;
}

// Create AuthContext
export const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // On mount, check if a JWT exists and fetch user profile
    const token = localStorage.getItem("jwt");
    if (token) {
      setAxiosAuthHeader(token);
      fetchProfile();
    }
  }, []);

  const setAxiosAuthHeader = (token: string) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/auth/me`);
      setUser(data.user);
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      logout(); // Clear state if token is invalid
    }
  };

  const registerUser = async (
    firstName: string,
    lastName: string,
    gender: string,
    email: string,
    password: string,
    role: string
  ) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        firstName,
        lastName,
        gender,
        email,
        password,
        role,
      });
      localStorage.setItem("jwt", data.token);
      setAxiosAuthHeader(data.token);
      setUser(data.user);
      navigate("/sign-up-survey");

      console.log("Registration successful:", data.message);
      // Redirect to login or perform another action after registration
      
    } catch (error: any) {
      console.error("Registration failed:", error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || "Registration failed");
    }
  };
  const registerTherapist = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    gender: string,
    licenseNumber: string,
    specialization: string,
    experienceYears: number,
    monthlyRate: number
  ) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/therapists/register`, {
        firstName,
        lastName,
        email,
        password,
        gender,
        licenseNumber,
        specialization,
        experienceYears,
        monthlyRate
      });
      localStorage.setItem("jwt", data.token);
      setAxiosAuthHeader(data.token);
      setUser(data.user);
      navigate("/therapist-dashboard");
      console.log("Therapist registration successful:", data.message);
    } catch (error: any) {
      console.error("Therapist registration failed:", error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || "Therapist registration failed");
    }
  };
  

  const login = async (email: string, password: string) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
      const { token, user } = data;
  
      if (!token || !user) {
        throw new Error("Invalid response from the server.");
      }
  
      // Store token and set Authorization header
      localStorage.setItem("jwt", token);
      setAxiosAuthHeader(token);
  
  
      const profileResponse = await axios.get(`${API_BASE_URL}/api/auth/me`);
      const fullUser = {
        ...profileResponse.data.user, // Merge additional user details
        token,
      };
  
      setUser(fullUser);
  
      // Redirect based on role
      navigate(fullUser.role === "student" ? "/student-dashboard" : "/therapist-dashboard");
    } catch (error: any) {
      if (error.response?.data?.message) {
        console.error("Login failed:", error.response.data.message);
      } else {
        console.error("Login failed:", error.message);
      }
      throw new Error("Invalid email or password. Please try again.");
    }
  };
  
  
 

  const logout = () => {
    localStorage.removeItem("jwt");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    navigate("/");
  };

  const fetchUser = async () => {
    const token = localStorage.getItem("jwt");
  
    if (!token) {
      console.warn("No token found. Please log in.");
      return;
    }
  
    setAxiosAuthHeader(token);
  
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/auth/me`);
      if (!data.user) {
        throw new Error("Invalid user data from the server.");
      }
  
      setUser({
        id: data.user.id,
        email: data.user.email,
        role: data.user.role || "student",
        firstName: data.user.first_name || "Unknown",
        lastName: data.user.last_name || "User",
        token,
        therapistId: data.user.therapist_id || "Unknown",
      });
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      logout();
    }
  };

  const sendPasswordResetEmail = async (email: string): Promise<void> => {
    try {
      await apiSendPasswordResetEmail(email);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Failed to send password reset email");
    }
  };

  return (
    <AuthContext.Provider value={{  
      user, 
      login, 
      registerUser,
      registerTherapist, 
      logout, 
      isAuthenticated: !!user, 
      fetchUser,
      sendPasswordResetEmail,
      }}
      >
      {children}
    </AuthContext.Provider>
  );
};
