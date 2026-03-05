"use client";

import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Star,
  Trophy,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import apiService from "../../../../services/api";

interface LeaderboardEntry {
  player: string;
  score: number;
  rank: number;
}

interface Leaderboard {
  _id: string;
  name: string;
  game: string;
  entries: LeaderboardEntry[];
}

export default function Leaderboards({ leaderboard, loading, error }: { leaderboard: Leaderboard[], loading: boolean, error: string | null }) {
  const [selectedGame, setSelectedGame] = useState<string>('');
  const [expandedView, setExpandedView] = useState(false);

  useEffect(() => {
    if (leaderboard.length > 0 && !selectedGame) {
      setSelectedGame(leaderboard[0]._id);
    }
  }, [leaderboard]);

  if (loading) {
    return (
      <section className="max-w-[1120px] w-full mx-auto flex flex-col gap-8 py-12 md:py-16 px-6 lg:px-0">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading leaderboards...</p>
        </div>
      </section>
    );
  }

  if (error || leaderboard.length === 0) {
    return (
      <section className="max-w-[1120px] w-full mx-auto flex flex-col gap-8 py-12 md:py-16 px-6 lg:px-0">
        <div className="text-center py-12">
          <Trophy size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No leaderboards available yet</p>
        </div>
      </section>
    );
  }

  const currentLeaderboard = leaderboard.find((lb) => lb._id === selectedGame);
  const displayEntries = expandedView
    ? currentLeaderboard?.entries
    : currentLeaderboard?.entries.slice(0, 10);

  return (
    <section className="max-w-[1120px] w-full mx-auto flex flex-col gap-8 py-12 md:py-16 px-6 lg:px-0">
      <div>
        <h2 className="text-4xl md:text-5xl font-semibold">
          Gaming Champions
        </h2>
        <p className="text-secondary text-lg mt-1">
          Top players dominating competitive gaming
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        {leaderboard.map((lb) => (
          <button
            key={lb._id}
            onClick={() => setSelectedGame(lb._id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all mb-1 ${
              selectedGame === lb._id
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {lb.name}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gray-50 py-3 px-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-xl">
              {currentLeaderboard?.name}
            </h3>
            <div className="flex gap-2 items-center">
              <Trophy size={18} className="text-yellow-500" />
              <span className="text-sm text-gray-600">{currentLeaderboard?.game}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-gray-200 bg-gray-50 text-sm font-medium text-gray-600">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-8">Player</div>
          <div className="col-span-3 text-right">Score</div>
        </div>

        {displayEntries?.map((entry) => (
          <div
            key={entry.rank}
            className={`grid grid-cols-12 gap-2 px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
              entry.rank === 1 ? "bg-yellow-50" : ""
            }`}
          >
            <div className="col-span-1 flex justify-center items-center">
              {entry.rank === 1 ? (
                <div className="w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold">
                  1
                </div>
              ) : entry.rank === 2 ? (
                <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold">
                  2
                </div>
              ) : entry.rank === 3 ? (
                <div className="w-7 h-7 rounded-full bg-orange-300 flex items-center justify-center text-white font-bold">
                  3
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium text-sm">
                  {entry.rank}
                </div>
              )}
            </div>

            <div className="col-span-8 flex items-center gap-3">
              <User size={20} className="text-gray-400" />
              <div className="font-medium">{entry.player}</div>
            </div>

            <div className="col-span-3 flex items-center justify-end font-bold text-amber-600 text-lg">
              {entry.score.toLocaleString()}
            </div>
          </div>
        ))}

        {currentLeaderboard && currentLeaderboard.entries.length > 10 && (
          <div
            className="py-3 px-4 text-center text-primary font-medium cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setExpandedView(!expandedView)}
          >
            {expandedView ? (
              <div className="flex items-center justify-center">
                <span>Show Less</span>
                <ChevronUp size={18} className="ml-1" />
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span>Show All ({currentLeaderboard.entries.length} players)</span>
                <ChevronDown size={18} className="ml-1" />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
