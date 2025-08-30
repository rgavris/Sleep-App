'use client';

import React, { useState, useEffect } from 'react';
import { Box, CssBaseline } from '@mui/material';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import SleepTracker from '@/components/SleepTracker';
import SleepAnalytics from '@/components/SleepAnalytics';
import SleepGoals from '@/components/SleepGoals';
import { SleepSession, SleepGoal } from '@/types/sleep';

const HomePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sleepSessions, setSleepSessions] = useState<SleepSession[]>([]);
  const [sleepGoals, setSleepGoals] = useState<SleepGoal[]>([]);

  useEffect(() => {
    // Load sleep sessions from localStorage
    const savedSessions = localStorage.getItem('sleepSessions');
    if (savedSessions) {
      const sessions = JSON.parse(savedSessions).map((session: any) => ({
        ...session,
        startTime: new Date(session.startTime),
        endTime: new Date(session.endTime),
      }));
      setSleepSessions(sessions);
    }

    // Load sleep goals from localStorage
    const savedGoals = localStorage.getItem('sleepGoals');
    if (savedGoals) {
      setSleepGoals(JSON.parse(savedGoals));
    }
  }, []);

  useEffect(() => {
    // Save sleep sessions to localStorage
    localStorage.setItem('sleepSessions', JSON.stringify(sleepSessions));
  }, [sleepSessions]);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const handleSleepSessionAdd = (newSession: SleepSession) => {
    setSleepSessions(prev => [...prev, newSession]);
  };

  const handleGoalsChange = (goals: SleepGoal[]) => {
    setSleepGoals(goals);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard sleepSessions={sleepSessions} />;
      case 'tracker':
        return <SleepTracker onSessionAdd={handleSleepSessionAdd} />;
      case 'analytics':
        return <SleepAnalytics sleepSessions={sleepSessions} />;
      case 'goals':
        return <SleepGoals onGoalsChange={handleGoalsChange} />;
      case 'settings':
        return (
          <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
            <h2>Settings</h2>
            <p>Settings page coming soon...</p>
          </Box>
        );
      default:
        return <Dashboard sleepSessions={sleepSessions} />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Navigation currentPage={currentPage} onPageChange={handlePageChange} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          minHeight: '100vh',
          ml: { md: '280px' },
        }}
      >
        {renderCurrentPage()}
      </Box>
    </Box>
  );
};

export default HomePage;


