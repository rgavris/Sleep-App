'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Avatar,
  LinearProgress,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Bedtime,
  WbSunny,
  AccessTime,
  Psychology,
  Favorite,
  MoreVert,
  CalendarToday,
  Speed,
  EmojiEvents,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { SleepSession, SleepQuality } from '@/types/sleep';
import ClientOnly from './ClientOnly';

const StyledCard = styled(Card)`
  transition: all 0.3s ease;
  height: 100%;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
`;

const StatCard = styled(Card)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="stars" patternUnits="userSpaceOnUse" width="100" height="100"><circle cx="20" cy="20" r="1" fill="white" opacity="0.1"/><circle cx="80" cy="40" r="0.5" fill="white" opacity="0.08"/><circle cx="40" cy="80" r="0.8" fill="white" opacity="0.12"/></pattern></defs><rect width="100" height="100" fill="url(%23stars)"/></svg>');
    opacity: 0.1;
  }
`;

const QualityIndicator = styled.div<{ quality: SleepQuality }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => {
    switch (props.quality) {
      case SleepQuality.EXCELLENT: return '#10b981';
      case SleepQuality.GOOD: return '#3b82f6';
      case SleepQuality.FAIR: return '#f59e0b';
      case SleepQuality.POOR: return '#ef4444';
      default: return '#6b7280';
    }
  }};
  display: inline-block;
  margin-right: 8px;
`;

interface DashboardProps {
  sleepSessions: SleepSession[];
}

const Dashboard: React.FC<DashboardProps> = ({ sleepSessions }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getDuration = (startTime: Date, endTime: Date) => {
    return (endTime.getTime() - startTime.getTime()) / (1000 * 60); // duration in minutes
  }

  const getCurrentSleepStatus = () => {
    const hour = currentTime.getHours();
    if (hour >= 22 || hour < 6) {
      return { status: 'sleeping', message: 'Time to sleep', icon: <Bedtime /> };
    } else if (hour >= 6 && hour < 10) {
      return { status: 'morning', message: 'Good morning!', icon: <WbSunny /> };
    } else {
      return { status: 'awake', message: 'Stay active', icon: <Speed /> };
    }
  };

  const calculateStats = () => {
    if (sleepSessions.length === 0) {
      return {
        totalSessions: 0,
        averageDuration: 0,
        averageQuality: SleepQuality.GOOD,
        totalSleepTime: 0,
        consistencyScore: 0,
        bestSleepTime: '0h 0m',
        worstSleepTime: '0h 0m',
      };
    }

    const totalDuration = sleepSessions.reduce((acc, session) => acc + getDuration(session.startTime, session.endTime), 0);
    const averageDuration = Math.round(totalDuration / sleepSessions.length);
    
    const qualityScores = sleepSessions.map(s => {
      switch (s.quality) {
        case SleepQuality.EXCELLENT: return 4;
        case SleepQuality.GOOD: return 3;
        case SleepQuality.FAIR: return 2;
        case SleepQuality.POOR: return 1;
        default: return 3;
      }
    });
    const averageQuality = qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length;

    // Calculate consistency (how often you sleep at similar times)
    const bedtimes = sleepSessions.map(s => s.startTime.getHours());
    const bedtimeVariance = Math.sqrt(
      bedtimes.reduce((acc, hour) => acc + Math.pow(hour - (bedtimes.reduce((a, b) => a + b, 0) / bedtimes.length), 2), 0) / bedtimes.length
    );
    const consistencyScore = Math.max(0, 100 - bedtimeVariance * 5);

    const bestSession = sleepSessions.reduce((best, current) => 
      getDuration(current.startTime, current.endTime) > getDuration(best.startTime, best.endTime) ? current : best
    );
    const worstSession = sleepSessions.reduce((worst, current) => 
      getDuration(current.startTime, current.endTime) < getDuration(worst.startTime, worst.endTime) ? current : worst
    );

    return {
      totalSessions: sleepSessions.length,
      averageDuration,
      averageQuality: averageQuality >= 3.5 ? SleepQuality.EXCELLENT :
                     averageQuality >= 2.5 ? SleepQuality.GOOD :
                     averageQuality >= 1.5 ? SleepQuality.FAIR : SleepQuality.POOR,
      totalSleepTime: totalDuration,
      consistencyScore: Math.round(consistencyScore),
      bestSleepTime: `${Math.floor(getDuration(bestSession.startTime, bestSession.endTime) / 60)}h ${getDuration(bestSession.startTime, bestSession.endTime) % 60}m`,
      worstSleepTime: `${Math.floor(getDuration(worstSession.startTime, worstSession.endTime) / 60)}h ${getDuration(worstSession.startTime, worstSession.endTime) % 60}m`,
    };
  };

  const getRecentActivity = () => {
    return sleepSessions
      .slice(-3)
      .reverse()
      .map(session => ({
        ...session,
        date: session.startTime.toLocaleDateString(),
        time: session.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: getDuration(session.startTime, session.endTime),
      }));
  };

  const getSleepTrend = () => {
    if (sleepSessions.length < 2) return 'stable';
    
    const recentSessions = sleepSessions.slice(-7);
    if (recentSessions.length < 2) return 'stable';
    
    const recentAvg = recentSessions.reduce((acc, s) => acc + getDuration(s.startTime, s.endTime), 0) / recentSessions.length;
    const previousAvg = sleepSessions.slice(-14, -7).reduce((acc, s) => acc + getDuration(s.startTime, s.endTime), 0) / 7;
    
    if (recentAvg > previousAvg * 1.1) return 'improving';
    if (recentAvg < previousAvg * 0.9) return 'declining';
    return 'stable';
  };

  const stats = calculateStats();
  const sleepStatus = getCurrentSleepStatus();
  const sleepTrend = getSleepTrend();
  const recentActivity = getRecentActivity();

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Good {sleepStatus.status === 'morning' ? 'Morning' : sleepStatus.status === 'sleeping' ? 'Evening' : 'Day'}! 🌙
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {sleepStatus.message} • <ClientOnly>{currentTime.toLocaleTimeString()}</ClientOnly>
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              icon={sleepTrend === 'improving' ? <TrendingUp /> : sleepTrend === 'declining' ? <TrendingDown /> : <AccessTime />}
              label={sleepTrend === 'improving' ? 'Improving' : sleepTrend === 'declining' ? 'Needs Attention' : 'Stable'}
              color={sleepTrend === 'improving' ? 'success' : sleepTrend === 'declining' ? 'warning' : 'default'}
              variant="outlined"
            />
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {sleepStatus.icon}
            </Avatar>
          </Box>
        </Box>
      </motion.div>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <StatCard>
              <CardContent sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <Typography variant="h3" component="div" sx={{ mb: 1 }}>
                  {formatTime(stats.averageDuration)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Average Sleep
                </Typography>
                <AccessTime sx={{ fontSize: 40, opacity: 0.3, mt: 2 }} />
              </CardContent>
            </StatCard>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <StyledCard>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" component="div" sx={{ color: 'primary.main', mb: 1 }}>
                  {stats.consistencyScore}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Consistency Score
                </Typography>
                <EmojiEvents sx={{ fontSize: 40, color: 'primary.main', mt: 2, opacity: 0.7 }} />
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <StyledCard>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" component="div" sx={{ color: 'primary.main', mb: 1 }}>
                  {stats.totalSessions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Sessions
                </Typography>
                <Psychology sx={{ fontSize: 40, color: 'primary.main', mt: 2, opacity: 0.7 }} />
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>
      </Grid>

      {/* Detailed Stats and Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <StyledCard>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">
                    Sleep Performance Overview
                  </Typography>
                  <IconButton size="small">
                    <MoreVert />
                  </IconButton>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Best Sleep Session
                      </Typography>
                      <Typography variant="h6" color="success.main">
                        {stats.bestSleepTime}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Average Quality
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <QualityIndicator quality={stats.averageQuality} />
                        <Typography variant="h6">
                          {stats.averageQuality.charAt(0).toUpperCase() + stats.averageQuality.slice(1)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Worst Sleep Session
                      </Typography>
                      <Typography variant="h6" color="warning.main">
                        {stats.worstSleepTime}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Total Sleep Time
                      </Typography>
                      <Typography variant="h6">
                        {formatTime(stats.totalSleepTime)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Sleep Trend
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {sleepTrend === 'improving' ? (
                      <TrendingUp sx={{ color: 'success.main' }} />
                    ) : sleepTrend === 'declining' ? (
                      <TrendingDown sx={{ color: 'warning.main' }} />
                    ) : (
                      <AccessTime sx={{ color: 'info.main' }} />
                    )}
                    <Typography variant="body1">
                      {sleepTrend === 'improving' ? 'Your sleep quality is improving!' :
                       sleepTrend === 'declining' ? 'Consider adjusting your sleep routine' :
                       'Your sleep pattern is stable'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                
                {recentActivity.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Bedtime sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      No sleep sessions recorded yet
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {recentActivity.map((session) => (
                      <Box
                        key={session.id}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: 2,
                          bgcolor: 'grey.50',
                          borderRadius: 2,
                        }}
                      >
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {session.date}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {session.time} • {formatTime(session.duration)}
                          </Typography>
                        </Box>
                        <QualityIndicator quality={session.quality} />
                      </Box>
                    ))}
                  </Box>
                )}
                
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 2 }}
                  startIcon={<CalendarToday />}
                >
                  View All Sessions
                </Button>
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
