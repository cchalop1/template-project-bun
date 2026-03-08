import { describe, expect, it } from "bun:test";
import { createApp } from "../src/app";

const app = createApp();

describe("GET /health", () => {
	it("should return status ok", async () => {
		const response = await app
			.handle(new Request("http://localhost/health"))
			.then((res) => res.json());

		expect(response).toEqual({ status: "ok" });
	});
});
