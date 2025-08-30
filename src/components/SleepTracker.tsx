'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Rating,
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  Bedtime,
  WbSunny,
  AccessTime,
  TrendingUp,
  Psychology,
  Favorite,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { SleepSession, SleepQuality } from '@/types/sleep';

const StyledCard = styled(Card)`
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
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="stars" patternUnits="userSpaceOnUse" width="100" height="100"><circle cx="20" cy="20" r="1" fill="white" opacity="0.3"/><circle cx="80" cy="40" r="0.5" fill="white" opacity="0.2"/><circle cx="40" cy="80" r="0.8" fill="white" opacity="0.4"/></pattern></defs><rect width="100" height="100" fill="url(%23stars)"/></svg>');
    opacity: 0.1;
  }
`;

const TimerDisplay = styled.div`
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin: 2rem 0;
  font-family: 'Inter', monospace;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
`;

const QualityChip = styled(Chip)<{ quality: SleepQuality }>`
  background-color: ${props => {
    switch (props.quality) {
      case SleepQuality.EXCELLENT: return '#10b981';
      case SleepQuality.GOOD: return '#3b82f6';
      case SleepQuality.FAIR: return '#f59e0b';
      case SleepQuality.POOR: return '#ef4444';
      default: return '#6b7280';
    }
  }};
  color: white;
  font-weight: 600;
`;

const SleepTracker: React.FC = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [sleepSessions, setSleepSessions] = useState<SleepSession[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentSession, setCurrentSession] = useState<Partial<SleepSession>>({});

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  const startTracking = () => {
    setIsTracking(true);
    setStartTime(new Date());
    setElapsedTime(0);
  };

  const stopTracking = () => {
    setIsTracking(false);
    setOpenDialog(true);
  };

  const saveSession = () => {
    if (startTime && currentSession.quality) {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000 / 60);
      
      const newSession: SleepSession = {
        id: Date.now().toString(),
        startTime,
        endTime,
        duration,
        quality: currentSession.quality as SleepQuality,
        deepSleep: currentSession.deepSleep || 0,
        lightSleep: currentSession.lightSleep || 0,
        remSleep: currentSession.remSleep || 0,
        awakeTime: currentSession.awakeTime || 0,
        heartRate: [],
        notes: currentSession.notes || '',
        tags: currentSession.tags || [],
      };

      setSleepSessions(prev => [...prev, newSession]);
      setCurrentSession({});
      setStartTime(null);
      setElapsedTime(0);
      setOpenDialog(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getAverageQuality = () => {
    if (sleepSessions.length === 0) return SleepQuality.GOOD;
    const qualityScores = sleepSessions.map(s => {
      switch (s.quality) {
        case SleepQuality.EXCELLENT: return 4;
        case SleepQuality.GOOD: return 3;
        case SleepQuality.FAIR: return 2;
        case SleepQuality.POOR: return 1;
        default: return 3;
      }
    });
    const average = qualityScores.reduce((a, b) => a + b, 0) / qualitySessions.length;
    if (average >= 3.5) return SleepQuality.EXCELLENT;
    if (average >= 2.5) return SleepQuality.GOOD;
    if (average >= 1.5) return SleepQuality.FAIR;
    return SleepQuality.POOR;
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          🌙 SleepTracker
        </Typography>
      </motion.div>

      <Grid container spacing={3}>
        {/* Main Tracking Card */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StyledCard>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>
                  {isTracking ? 'Sleeping...' : 'Ready to Sleep?'}
                </Typography>
                
                <TimerDisplay>
                  {formatTime(elapsedTime)}
                </TimerDisplay>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
                  {!isTracking ? (
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<Bedtime />}
                      onClick={startTracking}
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } 
                      }}
                    >
                      Start Sleep
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<WbSunny />}
                      onClick={stopTracking}
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } 
                      }}
                    >
                      Wake Up
                    </Button>
                  )}
                </Box>
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>

        {/* Stats Card */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Sleep Statistics
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccessTime sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2">
                    Total Sessions: {sleepSessions.length}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2">
                    Average Quality: 
                  </Typography>
                  <QualityChip 
                    label={getAverageQuality().toUpperCase()} 
                    quality={getAverageQuality()}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Psychology sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2">
                    Total Sleep Time: {sleepSessions.reduce((acc, session) => acc + session.duration, 0)} min
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Recent Sessions */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Sleep Sessions
                </Typography>
                
                {sleepSessions.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                    No sleep sessions recorded yet. Start tracking your sleep to see your data here!
                  </Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {sleepSessions.slice(-5).reverse().map((session) => (
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
                          <Typography variant="body2" color="text.secondary">
                            {session.startTime.toLocaleDateString()} - {session.startTime.toLocaleTimeString()}
                          </Typography>
                          <Typography variant="body1">
                            Duration: {session.duration} minutes
                          </Typography>
                        </Box>
                        <QualityChip 
                          label={session.quality.toUpperCase()} 
                          quality={session.quality}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Sleep Session Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Complete Sleep Session</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Sleep Quality</InputLabel>
              <Select
                value={currentSession.quality || ''}
                onChange={(e) => setCurrentSession(prev => ({ ...prev, quality: e.target.value }))}
                label="Sleep Quality"
              >
                <MenuItem value={SleepQuality.EXCELLENT}>Excellent</MenuItem>
                <MenuItem value={SleepQuality.GOOD}>Good</MenuItem>
                <MenuItem value={SleepQuality.FAIR}>Fair</MenuItem>
                <MenuItem value={SleepQuality.POOR}>Poor</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Notes (optional)"
              multiline
              rows={3}
              value={currentSession.notes || ''}
              onChange={(e) => setCurrentSession(prev => ({ ...prev, notes: e.target.value }))}
            />

            <Box>
              <Typography variant="body2" gutterBottom>
                Sleep Stage Estimates (minutes)
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Deep Sleep"
                    type="number"
                    value={currentSession.deepSleep || ''}
                    onChange={(e) => setCurrentSession(prev => ({ ...prev, deepSleep: Number(e.target.value) }))}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="REM Sleep"
                    type="number"
                    value={currentSession.remSleep || ''}
                    onChange={(e) => setCurrentSession(prev => ({ ...prev, remSleep: Number(e.target.value) }))}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={saveSession} variant="contained">Save Session</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SleepTracker;

