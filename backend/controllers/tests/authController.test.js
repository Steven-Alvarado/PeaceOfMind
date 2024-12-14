const {
  register,
  login,
  logout,
  getProfile,
  checkEmail,
  resetPasswordDirect,
} = require("../authController");

const {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserPassword,
} = require("../../models/authModel");

jest.mock("../../models/authModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const mockReq = () => ({ body: {}, params: {}, user: {} });
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe("Auth Controller", () => {
  describe("register", () => {
    it("should return 400 if the user already exists", async () => {
      const req = mockReq();
      req.body = { email: "test@example.com", password: "password123" };
      const res = mockRes();

      findUserByEmail.mockResolvedValue({ email: "test@example.com" });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "User already exists" });
    });

    it("should register a new user and return 201", async () => {
      const req = mockReq();
      req.body = {
        email: "test@example.com",
        password: "password123",
        role: "user",
        firstName: "John",
        lastName: "Doe",
        gender: "male",
      };
      const res = mockRes();

      findUserByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashedPassword");
      createUser.mockResolvedValue({ id: 1, email: "test@example.com" });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User registered successfully",
        user: { id: 1, email: "test@example.com" },
      });
    });

    it("should return 500 if registration fails", async () => {
      const req = mockReq();
      req.body = { email: "test@example.com", password: "password123" };
      const res = mockRes();

      findUserByEmail.mockRejectedValue(new Error("Database error"));

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Registration failed" });
    });
  });

  describe("login", () => {
    it("should return 400 if user is not found", async () => {
      const req = mockReq();
      req.body = { email: "test@example.com", password: "password123" };
      const res = mockRes();

      findUserByEmail.mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should return 401 if password is invalid", async () => {
      const req = mockReq();
      req.body = { email: "test@example.com", password: "wrongpassword" };
      const res = mockRes();

      findUserByEmail.mockResolvedValue({
        email: "test@example.com",
        password_hash: "hashedPassword",
      });
      bcrypt.compare.mockResolvedValue(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid password" });
    });

    it("should return a token and user data on successful login", async () => {
      const req = mockReq();
      req.body = { email: "test@example.com", password: "password123" };
      const res = mockRes();

      findUserByEmail.mockResolvedValue({
        id: 1,
        email: "test@example.com",
        password_hash: "hashedPassword",
        role: "user",
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("fakeToken");

      await login(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "Login successful",
        token: "fakeToken",
        user: {
          id: 1,
          email: "test@example.com",
          role: "user",
        },
      });
    });

    it("should return 500 if login fails", async () => {
      const req = mockReq();
      req.body = { email: "test@example.com", password: "password123" };
      const res = mockRes();

      findUserByEmail.mockRejectedValue(new Error("Database error"));

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Login failed" });
    });
  });

  describe("logout", () => {
    it("should return a success message", () => {
      const req = mockReq();
      const res = mockRes();

      logout(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: "Logged out successfully" });
    });
  });

  describe("getProfile", () => {
    it("should return user profile", async () => {
      const req = mockReq();
      req.user.userId = 1;
      const res = mockRes();

      findUserById.mockResolvedValue({ id: 1, email: "test@example.com" });

      await getProfile(req, res);

      expect(res.json).toHaveBeenCalledWith({
        user: { id: 1, email: "test@example.com" },
      });
    });

    it("should return 500 if fetching profile fails", async () => {
      const req = mockReq();
      req.user.userId = 1;
      const res = mockRes();

      findUserById.mockRejectedValue(new Error("Database error"));

      await getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch profile" });
    });
  });

  describe("checkEmail", () => {
    it("should return 404 if email does not exist", async () => {
      const req = mockReq();
      req.body.email = "test@example.com";
      const res = mockRes();

      findUserByEmail.mockResolvedValue(null);

      await checkEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Email does not exist" });
    });

    it("should return 200 if email exists", async () => {
      const req = mockReq();
      req.body.email = "test@example.com";
      const res = mockRes();

      findUserByEmail.mockResolvedValue({ email: "test@example.com" });

      await checkEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Email exists" });
    });
  });

  describe("resetPasswordDirect", () => {
    it("should return 404 if user is not found", async () => {
      const req = mockReq();
      req.body = { email: "test@example.com", newPassword: "newPassword123" };
      const res = mockRes();

      findUserByEmail.mockResolvedValue(null);

      await resetPasswordDirect(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should reset the password and return 200", async () => {
      const req = mockReq();
      req.body = { email: "test@example.com", newPassword: "newPassword123" };
      const res = mockRes();

      findUserByEmail.mockResolvedValue({ email: "test@example.com" });
      bcrypt.hash.mockResolvedValue("hashedNewPassword");
      updateUserPassword.mockResolvedValue();

      await resetPasswordDirect(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Password reset successfully" });
    });

    it("should return 500 if password reset fails", async () => {
      const req = mockReq();
      req.body = { email: "test@example.com", newPassword: "newPassword123" };
      const res = mockRes();

      findUserByEmail.mockRejectedValue(new Error("Database error"));

      await resetPasswordDirect(req, res);

      expect(console.error).toHaveBeenCalledWith(
        "Reset password error:",
        expect.any(Error)
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to reset password" });
    });
  });
});
