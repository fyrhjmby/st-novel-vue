import { login, register } from '@/api/authApi';
import { fetchCurrentUser } from '@/api/userApi';
import type { LoginCredentials, User, RegistrationData } from '@/types/auth';

export { login, register, fetchCurrentUser };
export type { LoginCredentials, User, RegistrationData };