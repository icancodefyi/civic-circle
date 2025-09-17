import { HeroSection } from "@/components/hero-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { FeaturesSection } from "@/components/features-section"
import { StatsSection } from "@/components/stats-section"
import { AboutSection } from "@/components/about-section"
import { GetInvolvedSection } from "@/components/get-involved-section"
import { ProfessionalReportSection } from "@/components/professional-report-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <StatsSection />
      <AboutSection />
      <GetInvolvedSection />
      <ProfessionalReportSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
