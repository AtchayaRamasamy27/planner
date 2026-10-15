import { useApp } from './context/AppContext';
import AuthPage      from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ToastStack    from './components/ui/Toast';

export default function App() {
  const { user, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid #ede9fe', borderTopColor:'#5b5cf6', animation:'spin .7s linear infinite' }}/>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      {user ? <DashboardPage/> : <AuthPage/>}
      <ToastStack/>
    </>
  );
}
