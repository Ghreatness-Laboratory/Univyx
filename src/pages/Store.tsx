import { motion } from "framer-motion";
import StoreGrid from "../components/layouts/store/StoreGrid";
import FloatingActions from "../components/common/FloatingActions";

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function Store() {
  return (
    <main data-testid="store-page" className="busy-bg min-h-screen">
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
      >
        <StoreGrid />
      </motion.div>
      <FloatingActions />
    </main>
  );
}
