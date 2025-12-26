import { motion } from "framer-motion";
import Intro from "../components/layouts/academics/Intro";
import ResourceSection from "../components/layouts/academics/resourceSection";
import Tech from "../components/layouts/academics/Tech";
import UniversitiesProfile from "../components/layouts/academics/UniversitiesProfile";
import { useUniversities } from "../hooks/useAcademics";

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function Academics() {
  const { universities, loading, error } = useUniversities();

  return (
    <div data-testid="academics-page">
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
      >
        <Intro />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
      >
        <UniversitiesProfile universities={universities} loading={loading} error={error} />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
      >
        <ResourceSection />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
      >
        <Tech />
      </motion.div>
    </div>
  );
}
