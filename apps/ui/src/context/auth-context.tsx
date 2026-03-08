import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
	type ReactNode,
} from "react";

type User = {
	id: string;
	email: string;
	username: string;
};

type AuthContextValue = {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	setAuth: (token: string, user: User) => void;
	logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

function loadStoredAuth(): { token: string | null; user: User | null } {
	const token = localStorage.getItem(TOKEN_KEY);
	const userStr = localStorage.getItem(USER_KEY);
	const user = userStr ? (JSON.parse(userStr) as User) : null;
	return { token, user };
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [token, setToken] = useState<string | null>(
		() => loadStoredAuth().token,
	);
	const [user, setUser] = useState<User | null>(
		() => loadStoredAuth().user,
	);

	const setAuth = useCallback((token: string, user: User) => {
		localStorage.setItem(TOKEN_KEY, token);
		localStorage.setItem(USER_KEY, JSON.stringify(user));
		setToken(token);
		setUser(user);
	}, []);

	const logout = useCallback(() => {
		localStorage.removeItem(TOKEN_KEY);
		localStorage.removeItem(USER_KEY);
		setToken(null);
		setUser(null);
	}, []);

	const value = useMemo(
		() => ({ user, token, isAuthenticated: !!token, setAuth, logout }),
		[user, token, setAuth, logout],
	);

	return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
