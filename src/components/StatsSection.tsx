import {
  UserGroupIcon,
  HeartIcon,
  BuildingOffice2Icon,
  BellAlertIcon,
} from "@heroicons/react/24/outline";

type StatCardProps = {
  icon: React.ReactNode;
  value: string;
  label: string;
};

function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className=" bg-gradient-to-b from-white to-red-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300  text-center">
      <div className="flex justify-center mb-4 text-red-500">
        {icon}
      </div>
      <h3 className="text-3xl font-bold text-gray-900">
        {value}
      </h3>
      <p className="mt-2 text-gray-500 text-sm">
        {label}
      </p>
     </div>
  );
}

export default function StatsSection() {
  return (
    <section className="py-16 ">
      <div className="max-w-6xl mx-auto px-4 mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <StatCard
            icon={<UserGroupIcon className="w-10 h-20" />}
            value="10,000+"
            label="Registered Donors"
          />

          <StatCard
            icon={<HeartIcon className="w-10 h-20" />}
            value="5,000+"
            label="Lives Saved"
          />

          <StatCard
            icon={<BuildingOffice2Icon className="w-10 h-20" />}
            value="200+"
            label="Hospitals Connected"
          />

          <StatCard
            icon={<BellAlertIcon className="w-10 h-20" />}
            value="78"
            label="Active Requests"
          />
        </div>
      </div>
    </section>
  );
}
