
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import EmergencyCTA from "@/components/EmergencyCTA";
import Testimonials from "@/components/Testimonials";
import FloatingBloodCells from "@/components/FloatingBloodCells";
import HeroSection from "@/components/Herosection";
import StatsSection from "@/components/StatsSection";
import HowItWorks from "@/components/HowItWorks";
import PartnerHospitals from "@/components/partnershospital";



export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
    <FloatingBloodCells/>
<Navbar />
<HeroSection />
<StatsSection />
<HowItWorks /> 
<PartnerHospitals/>
<Testimonials />
<EmergencyCTA />
<Footer />

</div>

  );
}
