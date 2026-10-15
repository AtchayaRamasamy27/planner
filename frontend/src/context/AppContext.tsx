import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { AuthUser, Planner, Task, Toast, ToastType, FilterType, ChartMode } from '../types';
import * as AuthAPI    from '../api/auth';
import * as PlannerAPI from '../api/planners';

interface Ctx {
  user:          AuthUser | null;
  loading:       boolean;
  planners:      Planner[];
  active:        Planner | null;
  tasks:         Task[];
  filter:        FilterType;
  chartMode:     ChartMode;
  toasts:        Toast[];
  // auth
  login:         (email: string, password: string) => Promise<void>;
  register:      (name: string, email: string, password: string) => Promise<void>;
  logout:        () => void;
  // planners
  selectPlanner: (p: Planner) => Promise<void>;
  addPlanner:    (name: string, date: string, color: string, defaults: boolean) => Promise<void>;
  removePlanner: (id: number) => Promise<void>;
  // tasks
  toggleTask:    (task: Task) => Promise<void>;
  saveTask:      (id: number, patch: Partial<Task>) => Promise<void>;
  addTask:       (patch: Partial<Task>) => Promise<void>;
  removeTask:    (id: number) => Promise<void>;
  reorderTasks:  (from: number, to: number) => void;
  // ui
  setFilter:     (f: FilterType) => void;
  setChartMode:  (m: ChartMode) => void;
  toast:         (msg: string, type?: ToastType) => void;
}

const AppCtx = createContext<Ctx>(null!);
export const useApp = () => useContext(AppCtx);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user,      setUser]      = useState<AuthUser | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [planners,  setPlanners]  = useState<Planner[]>([]);
  const [active,    setActive]    = useState<Planner | null>(null);
  const [tasks,     setTasks]     = useState<Task[]>([]);
  const [filter,    setFilter]    = useState<FilterType>('all');
  const [chartMode, setChartMode] = useState<ChartMode>('donut');
  const [toasts,    setToasts]    = useState<Toast[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // ── Toast ──────────────────────────────────────────────────────────────────
  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `t_${Date.now()}`;
    setToasts(p => [...p, { id, message, type }]);
    const t = setTimeout(() => setToasts(p => p.filter(x => x.id !== id)), 3000);
    timers.current.set(id, t);
  }, []);

  // ── Boot ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('planner_token');
    if (!token) { setLoading(false); return; }
    AuthAPI.getMe()
      .then(u => { setUser(u); return PlannerAPI.getPlanners(); })
      .then(ps => {
        setPlanners(ps);
        if (ps.length > 0) { setActive(ps[0]); return PlannerAPI.getTasks(ps[0].id).then(setTasks); }
      })
      .catch(() => localStorage.removeItem('planner_token'))
      .finally(() => setLoading(false));
  }, []);

  // ── Auth ───────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    const { token, user: u } = await AuthAPI.login(email, password);
    localStorage.setItem('planner_token', token);
    setUser(u);
    const ps = await PlannerAPI.getPlanners();
    setPlanners(ps);
    if (ps.length > 0) { setActive(ps[0]); setTasks(await PlannerAPI.getTasks(ps[0].id)); }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    await AuthAPI.register(name, email, password);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('planner_token');
    setUser(null); setPlanners([]); setActive(null); setTasks([]);
  }, []);

  // ── Planners ───────────────────────────────────────────────────────────────
  const selectPlanner = useCallback(async (p: Planner) => {
    setActive(p); setFilter('all');
    setTasks(await PlannerAPI.getTasks(p.id));
  }, []);

  const addPlanner = useCallback(async (name: string, date: string, color: string, defaults: boolean) => {
    const p = await PlannerAPI.createPlanner({ name, date, color, loadDefaults: defaults });
    setPlanners(prev => [...prev, p]);
    setActive(p);
    setTasks(await PlannerAPI.getTasks(p.id));
    setFilter('all');
  }, []);

  const removePlanner = useCallback(async (id: number) => {
    await PlannerAPI.deletePlanner(id);
    setPlanners(prev => {
      const next = prev.filter(p => p.id !== id);
      if (active?.id === id) {
        if (next.length > 0) { setActive(next[0]); PlannerAPI.getTasks(next[0].id).then(setTasks); }
        else                  { setActive(null); setTasks([]); }
      }
      return next;
    });
  }, [active]);

  // ── Tasks ──────────────────────────────────────────────────────────────────
  const toggleTask = useCallback(async (task: Task) => {
    const updated = await PlannerAPI.updateTask(task.id, { done: !task.done });
    setTasks(p => p.map(t => t.id === updated.id ? updated : t));
  }, []);

  const saveTask = useCallback(async (id: number, patch: Partial<Task>) => {
    const updated = await PlannerAPI.updateTask(id, patch);
    setTasks(p => p.map(t => t.id === updated.id ? updated : t));
  }, []);

  const addTask = useCallback(async (patch: Partial<Task>) => {
    if (!active) return;
    const t = await PlannerAPI.createTask(active.id, patch);
    setTasks(p => [...p, t]);
  }, [active]);

  const removeTask = useCallback(async (id: number) => {
    await PlannerAPI.deleteTask(id);
    setTasks(p => p.filter(t => t.id !== id));
  }, []);

  const reorderTasks = useCallback((from: number, to: number) => {
    setTasks(prev => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, []);

  return (
    <AppCtx.Provider value={{
      user, loading, planners, active, tasks, filter, chartMode, toasts,
      login, register, logout,
      selectPlanner, addPlanner, removePlanner,
      toggleTask, saveTask, addTask, removeTask, reorderTasks,
      setFilter, setChartMode, toast,
    }}>
      {children}
    </AppCtx.Provider>
  );
}
