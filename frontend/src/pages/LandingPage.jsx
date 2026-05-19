import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import LandingClassificationSection from "../components/fragments/landing/LandingClassificationSection";
import LandingCtaSection from "../components/fragments/landing/LandingCtaSection";
import LandingFeaturesSection from "../components/fragments/landing/LandingFeaturesSection";
import LandingFooter from "../components/fragments/landing/LandingFooter";
import LandingHeroSection from "../components/fragments/landing/LandingHeroSection";
import LandingHowItWorksSection from "../components/fragments/landing/LandingHowItWorksSection";
import LandingInfoNote from "../components/fragments/landing/LandingInfoNote";
import LandingNavbar from "../components/fragments/landing/LandingNavbar";

export default function LandingPage() {
  useEffect(() => {
    const existingLink = document.getElementById("landing-playfair-font");

    if (existingLink) {
      return;
    }

    const link = document.createElement("link");
    link.id = "landing-playfair-font";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 80,
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfbfa] text-gray-900">
      <LandingNavbar />
      <LandingHeroSection />
      <LandingInfoNote />
      <LandingFeaturesSection />
      <LandingHowItWorksSection />
      <LandingClassificationSection />
      <LandingCtaSection />
      <LandingFooter />
    </div>
  );
}
