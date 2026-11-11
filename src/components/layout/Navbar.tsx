import React, { useState } from 'react';
import {
  GraduationCap,
  Bot,
  Swords,
  Puzzle as PuzzleIcon,
  LineChart,
  Award,
  Volume2,
  VolumeX,
  Flame,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import type { AppView, StudentProfile } from '../../types';
import { chessAudio } from '../../lib/sound/chessAudio';

interface NavbarProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  profile: StudentProfile;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  profile,
  onOpenSettings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(chessAudio.isEnabled());

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    chessAudio.setSoundEnabled(next);
    if (next) chessAudio.playMove();
  };

  const navItems: { view: AppView; label: string; icon: React.ReactNode }[] = [
    { view: 'academy', label: 'Academy', icon: <GraduationCap className="w-4 h-4" /> },
    { view: 'coach', label: 'AI Coach', icon: <Bot className="w-4 h-4" /> },
    { view: 'practice', label: 'Practice', icon: <Swords className="w-4 h-4" /> },
    { view: 'puzzles', label: 'Puzzles', icon: <PuzzleIcon className="w-4 h-4" /> },
    { view: 'analysis', label: 'Analysis', icon: <LineChart className="w-4 h-4" /> },
    { view: 'progress', label: 'Progress', icon: <Award className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#121d2e]/95 backdrop-blur-md border-b border-[#19273a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={() => {
            onSelectView('landing');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
          aria-label="ChessMind Academy Home"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#d6b56d] to-[#997c36] p-0.5 shadow-lg shadow-[#d6b56d]/15 flex items-center justify-center text-[#0b1220]">
            <CrownCrestIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="font-display font-bold text-lg tracking-wider text-[#f3f0e8] group-hover:text-[#d6b56d] transition-colors">
              CHESSMIND
            </div>
            <div className="text-[10px] tracking-widest uppercase text-[#d6b56d] font-semibold -mt-1">
              ACADEMY
            </div>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => onSelectView(item.view)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#19273a] text-[#d6b56d] border border-[#d6b56d]/30 shadow-inner'
                    : 'text-[#aab5c4] hover:text-[#f3f0e8] hover:bg-[#19273a]/50'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Header Stats & Controls */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Daily Streak */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0b1220] border border-amber-500/30 text-amber-400 text-xs font-semibold"
            title={`${profile.currentStreak} Day Learning Streak`}
          >
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{profile.currentStreak}d</span>
          </div>

          {/* XP */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0b1220] border border-[#d6b56d]/30 text-[#d6b56d] text-xs font-semibold"
            title={`${profile.xp} Total XP Earned`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d6b56d]" />
            <span>{profile.xp} XP</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-lg text-[#aab5c4] hover:text-[#f3f0e8] hover:bg-[#19273a] transition-colors cursor-pointer"
            aria-label={soundEnabled ? 'Mute Chess Sound' : 'Enable Chess Sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-400" />}
          </button>

          {/* User Profile Avatar / Settings */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-[#19273a] hover:bg-[#22344d] border border-[#26374f] transition-all cursor-pointer"
            aria-label="User Profile and Settings"
          >
            <img
              src={profile.avatar}
              alt={profile.displayName}
              className="w-7 h-7 rounded-full object-cover border border-[#d6b56d]/50"
            />
            <span className="text-xs font-medium text-[#f3f0e8] max-w-[90px] truncate">
              Lvl {profile.level}
            </span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleSound}
            className="p-2 text-[#aab5c4] hover:text-[#f3f0e8]"
            aria-label="Toggle sound"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-red-400" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#aab5c4] hover:text-[#f3f0e8] hover:bg-[#19273a]"
            aria-label="Open Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#121d2e] border-b border-[#19273a] px-4 pt-2 pb-5 space-y-2">
          <div className="flex items-center justify-between pb-3 border-b border-[#19273a]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-500" /> {profile.currentStreak} Days
              </span>
              <span className="text-xs font-semibold text-[#d6b56d] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> {profile.xp} XP
              </span>
            </div>
            <button
              onClick={() => {
                onOpenSettings();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-[#aab5c4] hover:text-[#f3f0e8]"
            >
              Profile & Settings
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {navItems.map(item => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => {
                    onSelectView(item.view);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-left ${
                    isActive
                      ? 'bg-[#19273a] text-[#d6b56d] border border-[#d6b56d]/30'
                      : 'text-[#aab5c4] hover:bg-[#19273a]/50'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

const CrownCrestIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V17H19V19Z" />
  </svg>
);
