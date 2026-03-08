import { beforeEach, describe, expect, it } from "bun:test";
import type { AuthRepository, UserRecord } from "../src/routes/auth/repository";
import { AuthService } from "../src/routes/auth/service";

interface StatusError {
	code: number;
	response: { success: boolean; message: string };
}

function createMockRepository(
	users: UserRecord[] = [],
): AuthRepository & { users: UserRecord[] } {
	return {
		users,
		async findByEmail(email: string) {
			return this.users.find((u) => u.email === email);
		},
		async create(input) {
			const user = {
				id: "550e8400-e29b-41d4-a716-446655440000",
				email: input.email,
				username: input.username,
			};
			this.users.push({
				...user,
				password: input.password,
				createdAt: new Date(),
			});
			return user;
		},
	};
}

describe("AuthService.signin", () => {
	let service: AuthService;
	let repo: ReturnType<typeof createMockRepository>;

	beforeEach(() => {
		repo = createMockRepository();
		service = new AuthService(repo);
	});

	it("should create a new user", async () => {
		const result = await service.signin({
			email: "test@example.com",
			username: "testuser",
			password: "password123",
		});

		expect(result.email).toBe("test@example.com");
		expect(result.username).toBe("testuser");
		expect(result.id).toBeString();
		expect(repo.users).toHaveLength(1);
	});

	it("should hash the password before storing", async () => {
		await service.signin({
			email: "test@example.com",
			username: "testuser",
			password: "password123",
		});

		const stored = repo.users[0]!;
		expect(stored.password).not.toBe("password123");
		expect(await Bun.password.verify("password123", stored.password)).toBe(
			true,
		);
	});

	it("should throw 409 when email already exists", async () => {
		repo = createMockRepository([
			{
				id: "existing-id",
				email: "taken@example.com",
				username: "existing",
				password: "hashed",
				createdAt: new Date(),
			},
		]);
		service = new AuthService(repo);

		try {
			await service.signin({
				email: "taken@example.com",
				username: "newuser",
				password: "password123",
			});
			expect(true).toBe(false);
		} catch (error) {
			const err = error as StatusError;
			expect(err.code).toBe(409);
			expect(err.response.message).toBe(
				"A user with this email already exists",
			);
		}
	});
});

describe("AuthService.login", () => {
	let service: AuthService;

	beforeEach(async () => {
		const hashedPassword = await Bun.password.hash("password123");
		const repo = createMockRepository([
			{
				id: "550e8400-e29b-41d4-a716-446655440000",
				email: "test@example.com",
				username: "testuser",
				password: hashedPassword,
				createdAt: new Date(),
			},
		]);
		service = new AuthService(repo);
	});

	it("should return user on valid credentials", async () => {
		const result = await service.login({
			email: "test@example.com",
			password: "password123",
		});

		expect(result.email).toBe("test@example.com");
		expect(result.username).toBe("testuser");
		expect(result.id).toBe("550e8400-e29b-41d4-a716-446655440000");
	});

	it("should throw 401 when email not found", async () => {
		try {
			await service.login({
				email: "unknown@example.com",
				password: "password123",
			});
			expect(true).toBe(false);
		} catch (error) {
			const err = error as StatusError;
			expect(err.code).toBe(401);
			expect(err.response.message).toBe("Invalid email or password");
		}
	});

	it("should throw 401 when password is wrong", async () => {
		try {
			await service.login({
				email: "test@example.com",
				password: "wrongpassword",
			});
			expect(true).toBe(false);
		} catch (error) {
			const err = error as StatusError;
			expect(err.code).toBe(401);
			expect(err.response.message).toBe("Invalid email or password");
		}
	});
});
