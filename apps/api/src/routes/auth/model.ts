import { t, type UnwrapSchema } from "elysia";

export const AuthModel = {
	signinBody: t.Object({
		email: t.String({ format: "email" }),
		username: t.String({ minLength: 3 }),
		password: t.String({ minLength: 6 }),
	}),
	loginBody: t.Object({
		email: t.String({ format: "email" }),
		password: t.String({ minLength: 1 }),
	}),
	authResponse: t.Object({
		success: t.Boolean(),
		message: t.String(),
		token: t.String(),
		user: t.Object({
			id: t.String(),
			email: t.String(),
			username: t.String(),
		}),
	}),
	errorResponse: t.Object({
		success: t.Boolean(),
		message: t.String(),
	}),
} as const;

export type AuthModel = {
	[k in keyof typeof AuthModel]: UnwrapSchema<(typeof AuthModel)[k]>;
};
