import React, { useState } from 'react';
import { X, User, Settings, Volume2, Shield, Trash2, CheckCircle2 } from 'lucide-react';
import type { StudentProfile } from '../../types';
import { saveStudentProfile } from '../../lib/storage/studentStorage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onProfileUpdated: (profile: StudentProfile) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onProfileUpdated,
}) => {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [dailyGoal, setDailyGoal] = useState(profile.dailyGoalMinutes);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StudentProfile = {
      ...profile,
      displayName: displayName.trim() || profile.displayName,
      dailyGoalMinutes: dailyGoal,
    };
    saveStudentProfile(updated);
    onProfileUpdated(updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all completed lessons, XP, and puzzle ratings to initial state?')) {
      localStorage.removeItem('chessmind_academy_student_v1');
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#121d2e] w-full max-w-lg rounded-3xl border border-[#19273a] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 bg-[#152336] border-b border-[#19273a] flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-display font-bold text-base text-[#f3f0e8]">
            <Settings className="w-5 h-5 text-[#d6b56d]" />
            <span>Academy Settings & Profile</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#aab5c4] hover:text-[#f3f0e8] hover:bg-[#19273a] cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {savedNotice && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Settings updated successfully!</span>
            </div>
          )}

          {/* Display Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#aab5c4]">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="w-full bg-[#0b1220] border border-[#26374f] focus:border-[#d6b56d] rounded-xl px-3.5 py-2 text-xs text-[#f3f0e8] focus:outline-none"
            />
          </div>

          {/* Daily Goal Target */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#aab5c4]">Daily Study Goal</label>
            <div className="grid grid-cols-4 gap-2">
              {[10, 20, 30, 45].map(mins => (
                <button
                  type="button"
                  key={mins}
                  onClick={() => setDailyGoal(mins)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    dailyGoal === mins
                      ? 'bg-[#d6b56d] text-[#0b1220]'
                      : 'bg-[#0b1220] text-[#aab5c4] border border-[#19273a] hover:bg-[#19273a]'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          {/* Account Metrics info */}
          <div className="p-4 rounded-xl bg-[#0b1220] border border-[#19273a] text-xs space-y-2">
            <div className="flex justify-between text-[#aab5c4]">
              <span>Estimated Rating:</span>
              <span className="font-bold text-[#f3f0e8]">{profile.estimatedElo} Elo</span>
            </div>
            <div className="flex justify-between text-[#aab5c4]">
              <span>Puzzle Tactical Rating:</span>
              <span className="font-bold text-[#f3f0e8]">{profile.puzzleRating} Elo</span>
            </div>
            <div className="flex justify-between text-[#aab5c4]">
              <span>Current Streak:</span>
              <span className="font-bold text-amber-400">{profile.currentStreak} Days</span>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="pt-2 border-t border-[#19273a] flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetData}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Academy Data</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#d6b56d] hover:bg-[#e5c782] text-[#0b1220] font-bold text-xs cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
