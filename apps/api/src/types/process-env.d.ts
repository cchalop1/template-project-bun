declare module "bun" {
	interface Env {
		PORT?: string;
		FRONTEND_URL: string;
		DATABASE_URL: string;
		JWT_SECRET: string;
	}
}
