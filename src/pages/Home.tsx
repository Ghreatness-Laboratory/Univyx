import { motion } from "framer-motion";
import ActivityTicker from "../components/layouts/homepage/ActivityTicker";
import AboutUs from "../components/layouts/homepage/About";
import FAQ from "../components/layouts/homepage/FAQ";
import Features from "../components/layouts/homepage/Features";
import FeaturesMarquee from "../components/layouts/homepage/FeaturesMarquee";
import GetStarted from "../components/layouts/homepage/GetStarted";
import HeroNew from "../components/layouts/homepage/HeroNew";
import LiveStatsSection from "../components/layouts/homepage/LiveStatsSection";
import Partners from "../components/layouts/homepage/Partners";
import QuickLinksSection from "../components/layouts/homepage/QuickLinksSection";
import Team from "../components/layouts/homepage/Team";
import TestimonialsSection from "../components/layouts/homepage/TestimonialsSection";
import WhyChooseUs from "../components/layouts/homepage/WhyChooseUs";
import FloatingActions from "../components/common/FloatingActions";
import FontSizeController from "../components/common/FontSizeController";
import OnlineUsersIndicator from "../components/common/OnlineUsersIndicator";

import SkillsSection from "../components/layouts/skills/SkillsSection";

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Home() {
  return (
    <main data-testid="home-page">
      <ActivityTicker />
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
        viewport={{ once: true }}
      >
        <HeroNew />
      </motion.div>
      
      <FeaturesMarquee />
      
      <LiveStatsSection />
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
        viewport={{ once: true }}
      >
        <AboutUs />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
        viewport={{ once: true }}
      >
        <Features />
      </motion.div>
      
      <QuickLinksSection />
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
        viewport={{ once: true }}
      >
        <WhyChooseUs />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
        viewport={{ once: true }}
      >
        <Team />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
        viewport={{ once: true }}
      >
        <SkillsSection />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
        viewport={{ once: true }}
      >
        <GetStarted />
      </motion.div>
      
      <TestimonialsSection />
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
        viewport={{ once: true }}
      >
        <Partners />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
        viewport={{ once: true }}
      >
        <FAQ />
      </motion.div>
      
      <FloatingActions />
      <FontSizeController />
      <OnlineUsersIndicator />
    </main>
  );
}
