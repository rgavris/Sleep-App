'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  CheckCircle,
  Schedule,
  TrendingUp,
  Bedtime,
  WbSunny,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { SleepGoal, SleepQuality } from '@/types/sleep';

const StyledCard = styled(Card)`
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
`;

const GoalProgress = styled.div`
  position: relative;
  margin: 1rem 0;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const GoalCard = styled(Card)<{ achieved: boolean }>`
  background: ${props => props.achieved 
    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
    : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
  };
  color: ${props => props.achieved ? 'white' : 'inherit'};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

interface SleepGoalsProps {
  onGoalsChange?: (goals: SleepGoal[]) => void;
}

const SleepGoals: React.FC<SleepGoalsProps> = ({ onGoalsChange }) => {
  const [goals, setGoals] = useState<SleepGoal[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editingGoal, setEditingGoal] = useState<SleepGoal | null>(null);
  const [formData, setFormData] = useState<Partial<SleepGoal>>({});

  useEffect(() => {
    // Load goals from localStorage
    const savedGoals = localStorage.getItem('sleepGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  useEffect(() => {
    // Save goals to localStorage
    localStorage.setItem('sleepGoals', JSON.stringify(goals));
    onGoalsChange?.(goals);
  }, [goals, onGoalsChange]);

  const handleAddGoal = () => {
    setEditingGoal(null);
    setFormData({});
    setOpenDialog(true);
  };

  const handleEditGoal = (goal: SleepGoal) => {
    setEditingGoal(goal);
    setFormData(goal);
    setOpenDialog(true);
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
  };

  const handleSaveGoal = () => {
    if (formData.targetDuration && formData.targetBedtime && formData.targetWakeTime && formData.qualityTarget) {
      if (editingGoal) {
        setGoals(prev => prev.map(g => g.id === editingGoal.id ? { ...formData, id: editingGoal.id } as SleepGoal : g));
      } else {
        const newGoal: SleepGoal = {
          id: Date.now().toString(),
          targetDuration: formData.targetDuration,
          targetBedtime: formData.targetBedtime,
          targetWakeTime: formData.targetWakeTime,
          qualityTarget: formData.qualityTarget,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setGoals(prev => [...prev, newGoal]);
      }
      setOpenDialog(false);
      setFormData({});
      setEditingGoal(null);
    }
  };

  const calculateProgress = (goal: SleepGoal) => {
    // This is a simplified progress calculation
    // In a real app, you'd compare against actual sleep data
    const today = new Date();
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    
    // Simulate progress based on time of day
    let progress = 0;
    
    if (goal.targetBedtime <= currentTime && currentTime <= goal.targetWakeTime) {
      progress = 50; // During sleep hours
    } else if (currentTime >= goal.targetWakeTime) {
      progress = 100; // After wake time
    } else {
      progress = 25; // Before bedtime
    }
    
    return Math.min(progress, 100);
  };

  const getQualityColor = (quality: SleepQuality) => {
    switch (quality) {
      case SleepQuality.EXCELLENT: return '#10b981';
      case SleepQuality.GOOD: return '#3b82f6';
      case SleepQuality.FAIR: return '#f59e0b';
      case SleepQuality.POOR: return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h2">
            🎯 Sleep Goals
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddGoal}
            sx={{ borderRadius: 2 }}
          >
            Add Goal
          </Button>
        </Box>
      </motion.div>

      {goals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Bedtime sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No Sleep Goals Set
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Set your first sleep goal to start improving your sleep habits and track your progress.
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddGoal}
                size="large"
              >
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <Grid container spacing={3}>
          {goals.map((goal, index) => (
            <Grid item xs={12} md={6} lg={4} key={goal.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GoalCard achieved={calculateProgress(goal) === 100}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="h3">
                        Sleep Goal
                      </Typography>
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => handleEditGoal(goal)}
                          sx={{ color: 'inherit', mr: 1 }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteGoal(goal.id)}
                          sx={{ color: 'inherit' }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Schedule sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2">
                          {formatTime(goal.targetBedtime)} - {formatTime(goal.targetWakeTime)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Bedtime sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2">
                          {goal.targetDuration} hours
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TrendingUp sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2">
                          Quality: {goal.qualityTarget}
                        </Typography>
                      </Box>
                    </Box>

                    <GoalProgress>
                      <ProgressLabel>
                        <Typography variant="body2">
                          Progress
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {calculateProgress(goal)}%
                        </Typography>
                      </ProgressLabel>
                      <LinearProgress
                        variant="determinate"
                        value={calculateProgress(goal)}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: 'rgba(255,255,255,0.3)',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                          }
                        }}
                      />
                    </GoalProgress>

                    {calculateProgress(goal) === 100 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                        <CheckCircle sx={{ mr: 1, color: 'white' }} />
                        <Typography variant="body2" sx={{ color: 'white' }}>
                          Goal Achieved!
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </GoalCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Goal Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingGoal ? 'Edit Sleep Goal' : 'Add New Sleep Goal'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            <TextField
              fullWidth
              label="Target Sleep Duration (hours)"
              type="number"
              inputProps={{ min: 1, max: 24, step: 0.5 }}
              value={formData.targetDuration || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, targetDuration: Number(e.target.value) }))}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Target Bedtime"
                  type="time"
                  value={formData.targetBedtime || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetBedtime: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Target Wake Time"
                  type="time"
                  value={formData.targetWakeTime || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetWakeTime: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <FormControl fullWidth>
              <InputLabel>Target Sleep Quality</InputLabel>
              <Select
                value={formData.qualityTarget || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, qualityTarget: e.target.value as SleepQuality }))}
                label="Target Sleep Quality"
              >
                <MenuItem value={SleepQuality.EXCELLENT}>Excellent</MenuItem>
                <MenuItem value={SleepQuality.GOOD}>Good</MenuItem>
                <MenuItem value={SleepQuality.FAIR}>Fair</MenuItem>
                <MenuItem value={SleepQuality.POOR}>Poor</MenuItem>
              </Select>
            </FormControl>

            <Alert severity="info">
              Set realistic sleep goals based on your lifestyle and commitments. 
              Consistency is more important than perfection.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveGoal} 
            variant="contained"
            disabled={!formData.targetDuration || !formData.targetBedtime || !formData.targetWakeTime || !formData.qualityTarget}
          >
            {editingGoal ? 'Update Goal' : 'Create Goal'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SleepGoals;


