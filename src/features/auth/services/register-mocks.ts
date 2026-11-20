import { registerMockHandlers } from "@/core/api";
import { readMockUsers, writeMockUsers, type MockUser } from "@/features/auth/services/mock-users";
import {
  authSessionSchema,
  forgotPasswordSchema,
  loginSchema,
  signupRequestSchema,
} from "@/features/auth/services/schemas";

function sessionFor(user: MockUser) {
  return authSessionSchema.parse({
    accessToken: `mock.${user.id}`,
    refreshToken: `mock.refresh.${user.id}`,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });
}

registerMockHandlers({
  "POST /auth/login": async (request) => {
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) {
      return { status: 400, body: { message: "Enter a valid email and password." } };
    }

    const users = await readMockUsers();
    const user = users.find((item) => item.email.toLowerCase() === parsed.data.email.toLowerCase());
    if (!user || user.password !== parsed.data.password) {
      return { status: 401, body: { message: "Email or password is incorrect." } };
    }

    return { status: 200, body: sessionFor(user) };
  },
  "POST /auth/signup": async (request) => {
    const parsed = signupRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return { status: 400, body: { message: "Check the signup form and try again." } };
    }

    const users = await readMockUsers();
    const email = parsed.data.email.toLowerCase();
    if (users.some((item) => item.email.toLowerCase() === email)) {
      return { status: 409, body: { message: "An account with that email already exists." } };
    }

    const user: MockUser = {
      id: `user_${Date.now()}`,
      name: parsed.data.name.trim(),
      email,
      password: parsed.data.password,
    };
    await writeMockUsers([...users, user]);
    return { status: 201, body: sessionFor(user) };
  },
  "POST /auth/forgot-password": async (request) => {
    const parsed = forgotPasswordSchema.safeParse(request.body);
    if (!parsed.success) {
      return { status: 400, body: { message: "Enter a valid email." } };
    }

    return {
      status: 200,
      body: { message: "If an account exists for that email, reset instructions are on the way." },
    };
  },
});
