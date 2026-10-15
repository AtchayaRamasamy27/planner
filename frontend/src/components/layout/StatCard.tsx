import type { SvgIconComponent } from '@mui/icons-material';

interface Props { Icon: SvgIconComponent; value: string|number; label: string; color: string; }

export default function StatCard({ Icon, value, label, color }: Props) {
  return (
    <div className="bg-card rounded-xl border border-gray-100 shadow-float px-4 py-4 flex items-center gap-3 hover:-translate-y-0.5 transition-transform duration-200 cursor-default">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background:`${color}18` }}>
        <Icon sx={{ fontSize:18, color }}/>
      </div>
      <div>
        <p className="text-xl font-extrabold text-ink leading-none">{value}</p>
        <p className="text-xs text-ink4 mt-0.5 font-medium">{label}</p>
      </div>
    </div>
  );
}
