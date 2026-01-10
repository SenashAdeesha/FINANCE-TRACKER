import type { ReactNode } from "react";

type Props = {
  title: string;
  amount: string | number;
  icon?: ReactNode;
  color?: string;
  onClick?: () => void;
};

function DashboardCard({ title, amount, icon, color, onClick }: Props) {
  return (
    <div
      className={`flex items-center justify-between p-5 rounded-xl shadow-sm ${color || "bg-white"} transition-transform transform hover:scale-105 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div>
        <p className="text-muted font-medium text-sm">{title}</p>
        <h2 className="text-2xl font-bold mt-1 text-gray-800">{amount}</h2>
      </div>

      {icon && (
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/60 shadow text-2xl text-gray-700">
          {icon}
        </div>
      )}
    </div>
  );
}

export default DashboardCard;
