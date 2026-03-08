import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { FormExample } from "@/components/form-example";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/context/auth-context";
import { LoginPage } from "@/pages/login";
import { SigninPage } from "@/pages/signin";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { isAuthenticated } = useAuth();

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return children;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
	const { isAuthenticated } = useAuth();

	if (isAuthenticated) {
		return <Navigate to="/" replace />;
	}

	return children;
}

export function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<BrowserRouter>
					<Routes>
						<Route
							path="/login"
							element={
								<GuestRoute>
									<LoginPage />
								</GuestRoute>
							}
						/>
						<Route
							path="/signin"
							element={
								<GuestRoute>
									<SigninPage />
								</GuestRoute>
							}
						/>
						<Route
							path="/"
							element={
								<ProtectedRoute>
									<FormExample />
								</ProtectedRoute>
							}
						/>
					</Routes>
				</BrowserRouter>
				<Toaster />
			</AuthProvider>
		</QueryClientProvider>
	);
}

export default App;
