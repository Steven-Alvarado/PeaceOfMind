import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Define User interface
interface User {
  id: string;
  email: string;
  role: "student" | "therapist";
  firstName: string;
  lastName: string;
  token: string;
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
      const { data } = await axios.get("/api/auth/me");
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
      const { data } = await axios.post("/api/auth/register", {
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
      const { data } = await axios.post("/api/therapists/register", {
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
        const { data } = await axios.post("/api/auth/login", { email, password });
        const { token, user } = data; // Include user in the response
    
        // Set the user directly
        setUser({ ...user, token});

        // Store token and set Authorization header
        localStorage.setItem("jwt", token);
        setAxiosAuthHeader(token);
    
    
        
    
        // Redirect based on user role
        navigate(user.role === "student" ? "/student-dashboard" : "/therapist-dashboard");
      } catch (error) {
        console.error("Login failed", error);
        throw new Error("Invalid email or password");
      }   
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/auth/me");
      const token = localStorage.getItem("jwt") || ""; // Retrieve token
      setUser({ ...data.user, token }); // Include token in user object
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      logout(); // Clear state if token is invalid
    }
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    navigate("/");
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
      }}
      >
      {children}
    </AuthContext.Provider>
  );
};
