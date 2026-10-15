export type Priority   = 'high' | 'medium' | 'low';
export type Category   = 'Morning' | 'Work' | 'Health' | 'Personal' | 'Evening' | 'Custom';
export type FilterType = 'all' | 'pending' | 'done' | 'high';
export type ChartMode  = 'donut' | 'bar';
export type ToastType  = 'success' | 'error' | 'info';

export interface AuthUser {
  id:    number;
  name:  string;
  email: string;
}

export interface Planner {
  id:         number;
  user_id:    number;
  name:       string;
  date:       string;
  color:      string;
  created_at: string;
}

export interface Task {
  id:         number;
  planner_id: number;
  title:      string;
  category:   Category;
  time:       string;
  priority:   Priority;
  done:       boolean;
  created_at: string;
}

export interface Toast {
  id:      string;
  message: string;
  type:    ToastType;
}
