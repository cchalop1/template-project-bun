import { status } from "elysia";
import type { AuthModel } from "./model";
import type { AuthRepository } from "./repository";

export class AuthService {
	constructor(private repository: AuthRepository) {}

	async signin({ email, username, password }: AuthModel["signinBody"]) {
		const existingUser = await this.repository.findByEmail(email);

		if (existingUser) {
			throw status(409, {
				success: false,
				message: "A user with this email already exists",
			} satisfies AuthModel["errorResponse"]);
		}

		const hashedPassword = await Bun.password.hash(password);

		return this.repository.create({
			email,
			username,
			password: hashedPassword,
		});
	}

	async login({ email, password }: AuthModel["loginBody"]) {
		const user = await this.repository.findByEmail(email);

		if (!user) {
			throw status(401, {
				success: false,
				message: "Invalid email or password",
			} satisfies AuthModel["errorResponse"]);
		}

		const validPassword = await Bun.password.verify(password, user.password);

		if (!validPassword) {
			throw status(401, {
				success: false,
				message: "Invalid email or password",
			} satisfies AuthModel["errorResponse"]);
		}

		return { id: user.id, email: user.email, username: user.username };
	}
}
