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
import { signin } from "@/lib/queries";

const signinSchema = type({
	email: "string.email",
	username: "string >= 3",
	password: "string >= 6",
});

type SigninFormData = typeof signinSchema.infer;

export function SigninPage() {
	const navigate = useNavigate();
	const { setAuth } = useAuth();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SigninFormData>({
		resolver: arktypeResolver(signinSchema),
		defaultValues: { email: "", username: "", password: "" },
	});

	const { mutate, isPending } = useMutation({
		mutationFn: signin,
		onSuccess: (data) => {
			setAuth(data.token, data.user);
			toast.success(data.message);
			navigate("/");
		},
		onError: (error) => {
			toast.error(
				error instanceof Error ? error.message : "Failed to create account",
			);
		},
	});

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<Card className="mx-auto w-full max-w-md">
				<CardHeader>
					<CardTitle>Create Account</CardTitle>
					<CardDescription>
						Sign up for a new account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit((data) => mutate(data))}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="signin-email">Email</FieldLabel>
								<Input
									id="signin-email"
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
								<FieldLabel htmlFor="signin-username">Username</FieldLabel>
								<Input
									id="signin-username"
									placeholder="Your username"
									{...register("username")}
								/>
								{errors.username && (
									<p className="text-sm text-red-600">
										{errors.username.message}
									</p>
								)}
							</Field>
							<Field>
								<FieldLabel htmlFor="signin-password">Password</FieldLabel>
								<Input
									id="signin-password"
									type="password"
									placeholder="Min. 6 characters"
									{...register("password")}
								/>
								{errors.password && (
									<p className="text-sm text-red-600">
										{errors.password.message}
									</p>
								)}
							</Field>
							<Button type="submit" className="w-full" disabled={isPending}>
								{isPending ? "Creating account..." : "Sign up"}
							</Button>
							<p className="text-center text-sm text-muted-foreground">
								Already have an account?{" "}
								<Link to="/login" className="text-primary underline">
									Login
								</Link>
							</p>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
