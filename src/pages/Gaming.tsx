import { motion } from "framer-motion";
import Events from "../components/layouts/gaming/Events";
import Gallery from "../components/layouts/gaming/Gallery";
import Header from "../components/layouts/gaming/Header";
import Leaderboards from "../components/layouts/gaming/leaderboard";
import Tournaments from "../components/layouts/gaming/Tournament";
import { useTournaments, useLeaderboard } from "../hooks/useGaming";
import { upcomingEvents } from "../data/gaming/upcomingEvents";

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function Gaming() {
  const { tournaments, loading: tournamentsLoading, error: tournamentsError } = useTournaments();
  const { leaderboard, loading: leaderboardLoading, error: leaderboardError } = useLeaderboard();

  return (
    <main data-testid="gaming-page">
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
      >
        <Header />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
      >
        <Events upcomingEvents={upcomingEvents} />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
      >
        <Tournaments
          tournaments={tournaments}
          loading={tournamentsLoading}
          error={tournamentsError}
        />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
      >
        <Leaderboards
          leaderboard={leaderboard}
          loading={leaderboardLoading}
          error={leaderboardError}
        />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
      >
        <Gallery />
      </motion.div>
    </main>
  );
}
