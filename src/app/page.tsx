'use client';

import React, { useState, useEffect } from 'react';
import { Box, CssBaseline } from '@mui/material';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import SleepTracker from '@/components/SleepTracker';
import SleepAnalytics from '@/components/SleepAnalytics';
import SleepGoals from '@/components/SleepGoals';
import UserManagement from '@/components/UserManagement';
import { SleepSession, SleepGoal } from '@/types/sleep';

const HomePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sleepSessions, setSleepSessions] = useState<SleepSession[]>([]);
  const [sleepGoals, setSleepGoals] = useState<SleepGoal[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      if (selectedUserId) {
        const response = await fetch(`/api/sleep?userId=${selectedUserId}`);
        const data = await response.json();
        setSleepSessions(data.map((session: any) => ({
          ...session,
          startTime: new Date(session.startTime),
          endTime: new Date(session.endTime),
        })));
      } else {
        setSleepSessions([]);
      }
    };
    fetchSessions();

    // Load sleep goals from localStorage
    const savedGoals = localStorage.getItem('sleepGoals');
    if (savedGoals) {
      setSleepGoals(JSON.parse(savedGoals));
    }
  }, [selectedUserId]);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const handleGoalsChange = (goals: SleepGoal[]) => {
    setSleepGoals(goals);
  };

  const handleUserChange = (userId: number) => {
    setSelectedUserId(userId);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard sleepSessions={sleepSessions} />;
      case 'tracker':
        return <SleepTracker userId={selectedUserId} />;
      case 'analytics':
        return <SleepAnalytics sleepSessions={sleepSessions} />;
      case 'goals':
        return <SleepGoals onGoalsChange={handleGoalsChange} />;
      case 'user':
        return <UserManagement onUserChange={handleUserChange} />;
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





