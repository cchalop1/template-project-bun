import { createApp } from "./app";

const app = createApp().listen({
	port: Number(Bun.env.PORT ?? 3000),
	hostname: "0.0.0.0",
});

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
