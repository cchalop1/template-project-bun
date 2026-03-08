import { jwt } from "@elysiajs/jwt";
import { Elysia } from "elysia";
import { AuthModel } from "./model";
import { authRepository } from "./repository";
import { AuthService } from "./service";

const authService = new AuthService(authRepository);

export const authRoute = new Elysia({ name: "auth", prefix: "/auth" })
	.use(
		jwt({
			name: "jwt",
			secret: Bun.env.JWT_SECRET,
			exp: "7d",
		}),
	)
	.post(
		"/signin",
		async ({ body, jwt }) => {
			const user = await authService.signin(body);

			const token = await jwt.sign({
				sub: user.id,
				email: user.email,
			});

			return {
				success: true,
				message: "User created successfully",
				token,
				user,
			};
		},
		{
			body: AuthModel.signinBody,
			response: {
				200: AuthModel.authResponse,
				409: AuthModel.errorResponse,
			},
		},
	)
	.post(
		"/login",
		async ({ body, jwt }) => {
			const user = await authService.login(body);

			const token = await jwt.sign({
				sub: user.id,
				email: user.email,
			});

			return {
				success: true,
				message: "Logged in successfully",
				token,
				user,
			};
		},
		{
			body: AuthModel.loginBody,
			response: {
				200: AuthModel.authResponse,
				401: AuthModel.errorResponse,
			},
		},
	);
