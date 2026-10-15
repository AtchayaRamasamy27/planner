import { useState } from 'react';
import MenuIcon               from '@mui/icons-material/Menu';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassEmptyIcon     from '@mui/icons-material/HourglassEmpty';
import TrendingUpIcon         from '@mui/icons-material/TrendingUp';
import Sidebar       from '../components/layout/Sidebar';
import StatCard      from '../components/layout/StatCard';
import TaskPanel     from '../components/tasks/TaskPanel';
import ProgressChart from '../components/chart/ProgressChart';
import { useApp } from '../context/AppContext';

export default function DashboardPage() {
  const { user, tasks, active } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const total   = tasks.length;
  const done    = tasks.filter(t => t.done).length;
  const pending = total - done;
  const pct     = total > 0 ? Math.round((done / total) * 100) : 0;

  const today = new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  const firstName = user?.name.split(' ')[0] ?? '';

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}/>

      <main className="flex-1 md:ml-60 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-7">

          {/* Top bar */}
          <div className="flex items-start gap-3 mb-6">
            <button className="md:hidden mt-1 border-0 bg-transparent cursor-pointer text-ink3 hover:text-ink transition-colors flex-shrink-0"
              onClick={() => setSidebarOpen(true)} aria-label="Open menu">
              <MenuIcon/>
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-ink4 uppercase tracking-widest mb-0.5 truncate">{today}</p>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-ink leading-tight truncate">
                {active
                  ? <>{active.name} <span className="inline-block w-2.5 h-2.5 rounded-full ml-2 align-middle mb-0.5 flex-shrink-0" style={{ background:active.color }}/></>
                  : `Good day, ${firstName}.`
                }
              </h1>
              {active?.date
                ? <p className="text-xs text-ink4 mt-0.5 truncate">{new Date(active.date).toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>
                : !active && <p className="text-xs text-ink4 mt-0.5">Select or create a planner from the sidebar.</p>
              }
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <StatCard Icon={AssignmentOutlinedIcon} value={total}     label="Total tasks" color="#5b5cf6"/>
            <StatCard Icon={CheckCircleOutlineIcon} value={done}      label="Completed"   color="#22c55e"/>
            <StatCard Icon={HourglassEmptyIcon}     value={pending}   label="Remaining"   color="#f59e0b"/>
            <StatCard Icon={TrendingUpIcon}         value={`${pct}%`} label="Progress"    color="#f43f5e"/>
          </div>

          {!active ? (
            <div className="bg-card rounded-2xl border border-gray-100 shadow-card p-12 sm:p-16 text-center animate-fade-up">
              <div className="w-14 h-14 rounded-2xl bg-violet-light flex items-center justify-center mx-auto mb-4">
                <AssignmentOutlinedIcon sx={{ fontSize:28, color:'#5b5cf6' }}/>
              </div>
              <h3 className="text-base font-bold text-ink mb-1">No planner selected</h3>
              <p className="text-sm text-ink4">Open the sidebar and create your first planner.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">
              <TaskPanel/>
              <ProgressChart/>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
