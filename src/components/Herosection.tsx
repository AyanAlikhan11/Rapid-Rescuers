import Link from "next/link";


function Herosection(){
    return(
        <div className="text-center py-30 px-4 bg-gradient-to-b from-white to-red-50">
      <h2
        className="text-5xl font-extrabold mb-4 tracking-tight 
               bg-gradient-to-r from-red-600 to-red-400 text-transparent bg-clip-text 
               animate-fadeIn"
      >
        Find Blood • Save Lives
      </h2>

      <p
        className="text-lg text-gray-600 mb-8 max-w-xl mx-auto opacity-90 
               animate-slideUp animation-delay-200"
      >
        Real-time blood availability and nearest donor network.
      </p>

      <div className="space-x-4 animate-slideUp animation-delay-300">
        <Link
          href="/map"
          className="px-8 py-3 rounded-xl bg-red-600 text-white font-semibold shadow-md 
                 transition-all duration-300 hover:bg-red-700 hover:shadow-xl 
                 hover:scale-105 active:scale-95"
        >
          Find Blood
        </Link>

        <Link
          href="/auth/register"
          className="px-8 py-3 rounded-xl border border-gray-300 font-semibold text-gray-400
                 transition-all duration-300 hover:border-red-600 hover:text-red-600 
                 hover:shadow-md hover:scale-105 active:scale-95"
        >
          Become a Donor
        </Link>
      </div>
    </div>
    )
}

export default Herosection;