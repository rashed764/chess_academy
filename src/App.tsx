import React, { useState, useEffect } from 'react';
import type { AppView, Lesson, StudentProfile } from './types';
import { Navbar } from './components/layout/Navbar';
import { LandingView } from './components/views/LandingView';
import { AcademyView } from './components/views/AcademyView';
import { LessonView } from './components/views/LessonView';
import { CoachView } from './components/views/CoachView';
import { PracticeView } from './components/views/PracticeView';
import { PuzzlesView } from './components/views/PuzzlesView';
import { AnalysisView } from './components/views/AnalysisView';
import { ProgressView } from './components/views/ProgressView';
import { SettingsModal } from './components/views/SettingsModal';
import { loadStudentProfile } from './lib/storage/studentStorage';
import { CURRICULUM_STAGES } from './lib/curriculum/curriculumData';

export function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [profile, setProfile] = useState<StudentProfile>(loadStudentProfile());
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Sync profile on mount
  useEffect(() => {
    setProfile(loadStudentProfile());
  }, []);

  const handleStartLearning = () => {
    // Open first lesson of Stage 1
    const firstLesson = CURRICULUM_STAGES[0].courses[0].lessons[0];
    setActiveLesson(firstLesson);
    setCurrentView('lesson');
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setCurrentView('lesson');
  };

  const handleProfileUpdated = (updated: StudentProfile) => {
    setProfile(updated);
  };

  return (
    <div className="min-h-screen bg-[#0b1220] text-[#f3f0e8] flex flex-col font-sans selection:bg-[#d6b56d]/30 selection:text-[#f3f0e8]">
      {/* Academy Navigation Bar */}
      <Navbar
        currentView={currentView}
        onSelectView={view => {
          setCurrentView(view);
          if (view !== 'lesson') {
            setActiveLesson(null);
          }
        }}
        profile={profile}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingView
            onStartLearning={handleStartLearning}
            onSelectView={view => setCurrentView(view)}
          />
        )}

        {currentView === 'academy' && (
          <AcademyView
            profile={profile}
            onSelectLesson={handleSelectLesson}
          />
        )}

        {currentView === 'lesson' && activeLesson && (
          <LessonView
            lesson={activeLesson}
            profile={profile}
            onBackToAcademy={() => {
              setActiveLesson(null);
              setCurrentView('academy');
            }}
            onProfileUpdated={handleProfileUpdated}
          />
        )}

        {currentView === 'coach' && (
          <CoachView profile={profile} />
        )}

        {currentView === 'practice' && (
          <PracticeView profile={profile} />
        )}

        {currentView === 'puzzles' && (
          <PuzzlesView
            profile={profile}
            onProfileUpdated={handleProfileUpdated}
          />
        )}

        {currentView === 'analysis' && (
          <AnalysisView />
        )}

        {currentView === 'progress' && (
          <ProgressView
            profile={profile}
            onLaunchLesson={handleSelectLesson}
          />
        )}
      </main>

      {/* Settings & Profile Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        profile={profile}
        onProfileUpdated={handleProfileUpdated}
      />
    </div>
  );
}

export default App;
