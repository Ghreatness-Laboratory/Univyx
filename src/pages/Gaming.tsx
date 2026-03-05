import { motion } from "framer-motion";
import Events from "../components/layouts/gaming/Events";
import Gallery from "../components/layouts/gaming/Gallery";
import Header from "../components/layouts/gaming/Header";
import Leaderboards from "../components/layouts/gaming/leaderboard";
import Tournaments from "../components/layouts/gaming/Tournament";
import { useTournaments, useLeaderboard } from "../hooks/useGaming";
import { useEvents } from "../hooks/useEntertainment";

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function Gaming() {
  const { tournaments, loading: tournamentsLoading, error: tournamentsError } = useTournaments();
  const { leaderboard, loading: leaderboardLoading, error: leaderboardError } = useLeaderboard();
  const { events, loading: eventsLoading } = useEvents();

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
        <Events upcomingEvents={events} loading={eventsLoading} />
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
