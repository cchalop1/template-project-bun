import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";

export interface UserRecord {
	id: string;
	email: string;
	username: string;
	password: string;
	createdAt: Date;
}

export interface CreateUserInput {
	email: string;
	username: string;
	password: string;
}

export interface UserPublic {
	id: string;
	email: string;
	username: string;
}

export interface AuthRepository {
	findByEmail(email: string): Promise<UserRecord | undefined>;
	create(input: CreateUserInput): Promise<UserPublic>;
}

export const authRepository: AuthRepository = {
	async findByEmail(email: string) {
		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1);

		return user;
	},

	async create(input: CreateUserInput) {
		const [user] = await db.insert(users).values(input).returning({
			id: users.id,
			email: users.email,
			username: users.username,
		});

		// biome-ignore lint/style/noNonNullAssertion: returning is guaranteed to return a row
		return user!;
	},
};
