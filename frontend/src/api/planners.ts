import api from './client';
import type { Planner, Task } from '../types';

// ── Planners ──────────────────────────────────────────────────────────────────
export const getPlanners   = () => api.get('/planners').then(r => r.data as Planner[]);
export const createPlanner = (body: { name: string; date: string; color: string; loadDefaults: boolean }) =>
  api.post('/planners', body).then(r => r.data as Planner);
export const deletePlanner = (id: number) => api.delete(`/planners/${id}`);

// ── Tasks ─────────────────────────────────────────────────────────────────────
export const getTasks    = (pid: number) => api.get(`/planners/${pid}/tasks`).then(r => r.data as Task[]);
export const createTask  = (pid: number, body: Partial<Task>) => api.post(`/planners/${pid}/tasks`, body).then(r => r.data as Task);
export const updateTask  = (id: number, body: Partial<Task>) => api.patch(`/tasks/${id}`, body).then(r => r.data as Task);
export const deleteTask  = (id: number) => api.delete(`/tasks/${id}`);
