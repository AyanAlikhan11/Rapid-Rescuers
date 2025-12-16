function DashboardCard({
  title,
  desc,
  btn,
}: {
  title: string;
  desc: string;
  btn: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        {desc}
      </p>
      <button className="w-full py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition">
        {btn}
      </button>
    </div>
  );
}

export default DashboardCard;