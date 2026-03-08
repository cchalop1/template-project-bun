import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { authRoute } from "./routes/auth";
import { formRoute } from "./routes/form";

export const createApp = () =>
	new Elysia()
		.use(
			cors({
				origin: [Bun.env.FRONTEND_URL],
				allowedHeaders: [
					"Content-Type",
					"Authorization",
					"Referrer-Policy",
					"user-agent",
				],
				methods: ["GET", "POST", "DELETE", "PUT"],
				credentials: true,
			}),
		)
		.use(formRoute)
		.use(authRoute)
		.get("/health", () => ({ status: "ok" }));
