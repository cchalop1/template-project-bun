import { describe, expect, it } from "bun:test";
import { createApp } from "../src/app";

const app = createApp();

describe("POST /form/submit", () => {
	it("should submit a form successfully", async () => {
		const response = await app
			.handle(
				new Request("http://localhost/form/submit", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						name: "John",
						role: "developer",
						comments: "Hello",
					}),
				}),
			)
			.then((res) => res.json());

		expect(response).toEqual({
			success: true,
			message: "Form submitted successfully",
		});
	});

	it("should reject when name is empty", async () => {
		const response = await app.handle(
			new Request("http://localhost/form/submit", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: "" }),
			}),
		);

		expect(response.status).toBe(422);
	});

	it("should reject when name is missing", async () => {
		const response = await app.handle(
			new Request("http://localhost/form/submit", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({}),
			}),
		);

		expect(response.status).toBe(422);
	});
});
