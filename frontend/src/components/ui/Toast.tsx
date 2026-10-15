import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon       from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon       from '@mui/icons-material/InfoOutlined';
import { useApp } from '../../context/AppContext';

const cfg = {
  success: { bg:'#16a34a', Icon: CheckCircleOutlineIcon },
  error:   { bg:'#dc2626', Icon: ErrorOutlineIcon },
  info:    { bg:'#4b4be8', Icon: InfoOutlinedIcon },
};

export default function ToastStack() {
  const { toasts } = useApp();
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => {
        const { bg, Icon } = cfg[t.type] ?? cfg.info;
        return (
          <div key={t.id} className="toast-in flex items-center gap-2.5 px-4 py-3 rounded-xl text-white text-sm font-medium shadow-deep max-w-[300px]"
            style={{ background: bg }}>
            <Icon sx={{ fontSize:18 }}/>
            <span>{t.message}</span>
          </div>
        );
      })}
    </div>
  );
}
