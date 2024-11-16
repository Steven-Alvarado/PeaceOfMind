import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
  email: string;
  role: "student" | "therapist";
  exp: number;
}

export const decodeToken = (token: string): DecodedToken => {
  return jwtDecode<DecodedToken>(token);
};
