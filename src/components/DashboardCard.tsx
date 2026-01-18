interface DashboardCardProps {
  title: string;
  desc: string;
  btn: string;
  onClick?: () => void; 
}

export default function DashboardCard({ title, desc, btn, onClick }: DashboardCardProps) {
  return (
    <div
      className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition cursor-pointer"
      onClick={onClick} 
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{desc}</p>
      <button
        onClick={onClick}
        className="w-full py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
      >
        {btn}
      </button>
    </div>
  );
}
