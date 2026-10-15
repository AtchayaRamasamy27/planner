import api from './client';
import type { AuthUser } from '../types';

export const register = (name: string, email: string, password: string) =>
  api.post('/auth/register', { name, email, password }).then(r => r.data as { message: string });

export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password }).then(r => r.data as { token: string; user: AuthUser });

export const getMe = () =>
  api.get('/auth/me').then(r => r.data as AuthUser);
