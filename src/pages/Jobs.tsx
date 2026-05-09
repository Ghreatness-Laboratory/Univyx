import { motion } from "framer-motion";
import JobsHero from "../components/layouts/jobs/Hero";
import JobsGrid from "../components/layouts/jobs/JobsGrid";
import SkillsSection from "../components/layouts/skills/SkillsSection";
import FloatingActions from "../components/common/FloatingActions";

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function Jobs() {
  return (
    <main data-testid="jobs-page" className="busy-bg">
      <motion.div initial="hidden" whileInView="visible" variants={sectionVariants}>
        <JobsHero />
      </motion.div>
      <motion.div initial="hidden" whileInView="visible" variants={sectionVariants}>
        <JobsGrid />
      </motion.div>
      <motion.div initial="hidden" whileInView="visible" variants={sectionVariants}>
        <SkillsSection />
      </motion.div>
      <FloatingActions />
    </main>
  );
}
