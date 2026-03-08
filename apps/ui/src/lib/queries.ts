import { api } from "./api";

type FormData = NonNullable<Parameters<typeof api.form.submit.post>[0]>;

export async function submitForm(form: FormData) {
	const { data, error } = await api.form.submit.post(form);

	if (error) {
		return Promise.reject(error.value);
	}

	return data;
}

type SigninData = NonNullable<Parameters<typeof api.auth.signin.post>[0]>;
type LoginData = NonNullable<Parameters<typeof api.auth.login.post>[0]>;

export async function signin(body: SigninData) {
	const { data, error } = await api.auth.signin.post(body);

	if (error) {
		return Promise.reject(error.value);
	}

	return data;
}

export async function login(body: LoginData) {
	const { data, error } = await api.auth.login.post(body);

	if (error) {
		return Promise.reject(error.value);
	}

	return data;
}
