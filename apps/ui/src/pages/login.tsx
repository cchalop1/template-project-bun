import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useMutation } from "@tanstack/react-query";
import { type } from "arktype";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { login } from "@/lib/queries";

const loginSchema = type({
	email: "string.email",
	password: "string >= 1",
});

type LoginFormData = typeof loginSchema.infer;

export function LoginPage() {
	const navigate = useNavigate();
	const { setAuth } = useAuth();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: arktypeResolver(loginSchema),
		defaultValues: { email: "", password: "" },
	});

	const { mutate, isPending } = useMutation({
		mutationFn: login,
		onSuccess: (data) => {
			setAuth(data.token, data.user);
			toast.success(data.message);
			navigate("/");
		},
		onError: (error) => {
			toast.error(
				error instanceof Error ? error.message : "Invalid credentials",
			);
		},
	});

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<Card className="mx-auto w-full max-w-md">
				<CardHeader>
					<CardTitle>Login</CardTitle>
					<CardDescription>
						Sign in to your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit((data) => mutate(data))}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="login-email">Email</FieldLabel>
								<Input
									id="login-email"
									type="email"
									placeholder="you@example.com"
									{...register("email")}
								/>
								{errors.email && (
									<p className="text-sm text-red-600">
										{errors.email.message}
									</p>
								)}
							</Field>
							<Field>
								<FieldLabel htmlFor="login-password">Password</FieldLabel>
								<Input
									id="login-password"
									type="password"
									placeholder="Your password"
									{...register("password")}
								/>
								{errors.password && (
									<p className="text-sm text-red-600">
										{errors.password.message}
									</p>
								)}
							</Field>
							<Button type="submit" className="w-full" disabled={isPending}>
								{isPending ? "Logging in..." : "Login"}
							</Button>
							<p className="text-center text-sm text-muted-foreground">
								Don't have an account?{" "}
								<Link to="/signin" className="text-primary underline">
									Sign up
								</Link>
							</p>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
