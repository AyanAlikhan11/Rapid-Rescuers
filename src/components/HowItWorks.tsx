import {
  ClipboardDocumentCheckIcon,
  MapPinIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

const steps = [
  {
    title: "Request Blood",
    description: "Submit an emergency blood request in seconds with patient details.",
    icon: ClipboardDocumentCheckIcon,
  },
  {
    title: "Get Matched",
    description: "Nearby donors & hospitals are instantly notified using location matching.",
    icon: MapPinIcon,
  },
  {
    title: "Save Lives",
    description: "Quick response ensures timely blood delivery and saves lives.",
    icon: HeartIcon,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-10  text-center">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">
        How Rapid Rescuers Works
      </h2>
      <p className="text-gray-500 max-w-2xl mx-auto mb-14">
        A simple, fast, and reliable process designed for emergency blood
        requests and life-saving responses.
      </p>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div
              key={step.title}
              className="group relative bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Step Number */}
              <span className="absolute top-4 right-6 text-6xl font-bold text-red-100">
                {index + 1}
              </span>

              {/* Icon */}
              <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-white mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-8 h-8" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
