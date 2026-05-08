import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Award, Target, Star, ExternalLink, Instagram, Twitter } from "lucide-react";
import { supabase } from "../../../lib/supabase";

export default function HallOfFame() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const { data, error } = await supabase.from('hall_of_fame_players').select('*').order('display_order');
      if (error) throw error;
      setPlayers(data || []);
    } catch (error) {
      console.error("Failed to fetch hall of fame players:", error);
    } finally {
      setLoading(false);
    }
  };

  const featuredPlayers = players.filter(p => p.is_featured).sort((a, b) => a.display_order - b.display_order);

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-full px-4 py-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-300">Legends of the Game</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
              Hall of Fame
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Celebrating the greatest gamers in Nigerian university esports history
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/5 rounded-2xl h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPlayers.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedPlayer(player)}
              >
                {/* Rank Badge */}
                {player.rank <= 10 && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      player.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-gray-900' :
                      player.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900' :
                      player.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                      'bg-gradient-to-br from-purple-400 to-purple-600 text-white'
                    }`}>
                      #{player.rank}
                    </div>
                  </div>
                )}

                {/* Avatar */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={player.avatar || `https://ui-avatars.com/api/?name=${player.name}&size=400&background=6366f1&color=fff`}
                    alt={player.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                  
                  {/* Rank Label */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="inline-flex items-center gap-2 bg-yellow-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-yellow-900 text-yellow-900" />
                      <span className="text-sm font-bold text-gray-900">Rank #{player.rank}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-1 group-hover:text-yellow-400 transition-colors">
                    {player.name}
                  </h3>
                  <p className="text-yellow-400 font-semibold mb-2">@{player.gamertag}</p>
                  <p className="text-sm text-gray-400 mb-4">{player.university}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-yellow-400">{player.total_mvps || 0}</div>
                      <div className="text-xs text-gray-400">MVPs</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-purple-400">{player.total_championships || 0}</div>
                      <div className="text-xs text-gray-400">Championships</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-400">{player.total_tournaments || 0}</div>
                      <div className="text-xs text-gray-400">Tournaments</div>
                    </div>
                  </div>

                  {/* Experience */}
                  {player.experience && (
                    <div className="mb-4 text-sm">
                      <span className="text-gray-500">Experience:</span> <span className="text-white font-semibold">{player.experience}</span>
                    </div>
                  )}

                  {/* Achievements Preview */}
                  {player.achievements && player.achievements.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-semibold">Top Achievements</span>
                      </div>
                      <div className="space-y-1">
                        {player.achievements.slice(0, 2).map((achievement: string, i: number) => (
                          <div key={i} className="text-xs text-gray-400 flex items-start gap-2">
                            <Target className="w-3 h-3 text-yellow-400 mt-0.5 shrink-0" />
                            <span>{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Favorite Game */}
                  {player.favorite_game && (
                    <div className="text-sm text-gray-400">
                      <span className="text-gray-500">Main Game:</span> <span className="text-white font-semibold">{player.favorite_game}</span>
                    </div>
                  )}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            ))}
          </div>
        )}

        {/* View All Button */}
        {players.length > 6 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12"
          >
            <button className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-bold rounded-full hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-lg hover:shadow-yellow-500/50">
              View All Legends
            </button>
          </motion.div>
        )}
      </div>

      {/* Player Detail Modal */}
      {selectedPlayer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPlayer(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-yellow-500/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64">
              <img
                src={selectedPlayer.avatar || `https://ui-avatars.com/api/?name=${selectedPlayer.name}&size=800&background=6366f1&color=fff`}
                alt={selectedPlayer.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
              <button
                onClick={() => setSelectedPlayer(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-gray-900/80 hover:bg-gray-800 rounded-full flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-8">
              <h2 className="text-3xl font-bold mb-2">{selectedPlayer.name}</h2>
              <p className="text-yellow-400 text-xl font-semibold mb-1">@{selectedPlayer.gamertag}</p>
              <p className="text-gray-400 mb-6">{selectedPlayer.university}</p>

              {selectedPlayer.bio && (
                <p className="text-gray-300 mb-6">{selectedPlayer.bio}</p>
              )}

              {/* Full Achievements List */}
              {selectedPlayer.achievements && selectedPlayer.achievements.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-400" />
                    Achievements
                  </h3>
                  <div className="space-y-2">
                    {selectedPlayer.achievements.map((achievement: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 bg-gray-800/50 p-3 rounded-lg">
                        <Trophy className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
                        <span className="text-gray-300">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {selectedPlayer.social_links && Object.keys(selectedPlayer.social_links).length > 0 && (
                <div className="flex gap-3">
                  {selectedPlayer.social_links.instagram && (
                    <a
                      href={selectedPlayer.social_links.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {selectedPlayer.social_links.twitter && (
                    <a
                      href={selectedPlayer.social_links.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
