'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { SleepSession, SleepQuality, SleepTrend } from '@/types/sleep';

const StyledCard = styled(Card)`
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-4px);
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface SleepAnalyticsProps {
  sleepSessions: SleepSession[];
}

const SleepAnalytics: React.FC<SleepAnalyticsProps> = ({ sleepSessions }) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [chartType, setChartType] = useState<'duration' | 'quality' | 'stages'>('duration');

  const getTimeRangeData = () => {
    const now = new Date();
    const filteredSessions = sleepSessions.filter(session => {
      const sessionDate = new Date(session.startTime);
      switch (timeRange) {
        case 'week':
          return sessionDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case 'month':
          return sessionDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        case 'year':
          return sessionDate >= new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        default:
          return true;
      }
    });
    return filteredSessions;
  };

  const getDurationData = () => {
    const sessions = getTimeRangeData();
    return sessions.map(session => ({
      date: new Date(session.startTime).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      duration: session.duration,
      quality: session.quality,
    }));
  };

  const getQualityData = () => {
    const sessions = getTimeRangeData();
    const qualityCounts = {
      [SleepQuality.EXCELLENT]: 0,
      [SleepQuality.GOOD]: 0,
      [SleepQuality.FAIR]: 0,
      [SleepQuality.POOR]: 0,
    };

    sessions.forEach(session => {
      qualityCounts[session.quality]++;
    });

    return Object.entries(qualityCounts).map(([quality, count]) => ({
      quality: quality.charAt(0).toUpperCase() + quality.slice(1),
      count,
      color: COLORS[Object.keys(qualityCounts).indexOf(quality)],
    }));
  };

  const getSleepStagesData = () => {
    const sessions = getTimeRangeData();
    if (sessions.length === 0) return [];

    const totalDeep = sessions.reduce((acc, session) => acc + session.deepSleep, 0);
    const totalLight = sessions.reduce((acc, session) => acc + session.lightSleep, 0);
    const totalREM = sessions.reduce((acc, session) => acc + session.remSleep, 0);
    const totalAwake = sessions.reduce((acc, session) => acc + session.awakeTime, 0);

    return [
      { name: 'Deep Sleep', value: totalDeep, color: '#1e40af' },
      { name: 'Light Sleep', value: totalLight, color: '#3b82f6' },
      { name: 'REM Sleep', value: totalREM, color: '#8b5cf6' },
      { name: 'Awake Time', value: totalAwake, color: '#ef4444' },
    ];
  };

  const getSleepTrends = (): SleepTrend[] => {
    const sessions = getTimeRangeData();
    return sessions.map(session => ({
      date: new Date(session.startTime).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      duration: session.duration,
      quality: session.quality,
      efficiency: Math.round((session.duration / (session.duration + session.awakeTime)) * 100),
    }));
  };

  const calculateAverages = () => {
    const sessions = getTimeRangeData();
    if (sessions.length === 0) return null;

    const totalDuration = sessions.reduce((acc, session) => acc + session.duration, 0);
    const averageDuration = Math.round(totalDuration / sessions.length);
    
    const qualityScores = sessions.map(s => {
      switch (s.quality) {
        case SleepQuality.EXCELLENT: return 4;
        case SleepQuality.GOOD: return 3;
        case SleepQuality.FAIR: return 2;
        case SleepQuality.POOR: return 1;
        default: return 3;
      }
    });
    const averageQuality = qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length;

    const totalEfficiency = sessions.reduce((acc, session) => {
      return acc + (session.duration / (session.duration + session.awakeTime)) * 100;
    }, 0);
    const averageEfficiency = Math.round(totalEfficiency / sessions.length);

    return { averageDuration, averageQuality, averageEfficiency };
  };

  const averages = calculateAverages();

  const renderChart = () => {
    switch (chartType) {
      case 'duration':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getDurationData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="duration" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'quality':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getQualityData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ quality, count }) => `${quality}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {getQualityData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'stages':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={getSleepStagesData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="value" 
                stackId="1" 
                stroke="#0ea5e9" 
                fill="#0ea5e9" 
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          📊 Sleep Analytics
        </Typography>
      </motion.div>

      {/* Controls */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <ToggleButtonGroup
          value={timeRange}
          exclusive
          onChange={(_, newValue) => newValue && setTimeRange(newValue)}
          aria-label="time range"
        >
          <ToggleButton value="week" aria-label="week">
            Week
          </ToggleButton>
          <ToggleButton value="month" aria-label="month">
            Month
          </ToggleButton>
          <ToggleButton value="year" aria-label="year">
            Year
          </ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={(_, newValue) => newValue && setChartType(newValue)}
          aria-label="chart type"
        >
          <ToggleButton value="duration" aria-label="duration">
            Duration
          </ToggleButton>
          <ToggleButton value="quality" aria-label="quality">
            Quality
          </ToggleButton>
          <ToggleButton value="stages" aria-label="stages">
            Stages
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <StyledCard>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Average Duration
                </Typography>
                <Typography variant="h3" component="div" sx={{ color: 'primary.main' }}>
                  {averages ? `${Math.floor(averages.averageDuration / 60)}h ${averages.averageDuration % 60}m` : '0h 0m'}
                </Typography>
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StyledCard>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Sleep Efficiency
                </Typography>
                <Typography variant="h3" component="div" sx={{ color: 'primary.main' }}>
                  {averages ? `${averages.averageEfficiency}%` : '0%'}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={averages ? averages.averageEfficiency : 0} 
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </StyledCard>
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
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Average Quality
                </Typography>
                <Typography variant="h3" component="div" sx={{ color: 'primary.main' }}>
                  {averages ? Math.round(averages.averageQuality * 10) / 10 : '0'}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {[1, 2, 3, 4].map((star) => (
                    <span key={star} style={{ color: star <= (averages?.averageQuality || 0) ? '#fbbf24' : '#d1d5db' }}>
                      ★
                    </span>
                  ))}
                </Box>
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>
      </Grid>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {chartType === 'duration' && 'Sleep Duration Over Time'}
              {chartType === 'quality' && 'Sleep Quality Distribution'}
              {chartType === 'stages' && 'Sleep Stages Breakdown'}
            </Typography>
            {renderChart()}
          </CardContent>
        </Card>
      </motion.div>

      {/* Sleep Trends */}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Sleep Trends
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={getSleepTrends()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="efficiency" stroke="#0ea5e9" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Sleep Quality
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {getTimeRangeData().slice(-5).reverse().map((session) => (
                    <Box key={session.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <QualityIndicator quality={session.quality} />
                        <Typography variant="body2">
                          {new Date(session.startTime).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Chip 
                        label={session.quality.toUpperCase()} 
                        size="small"
                        sx={{ 
                          bgcolor: session.quality === SleepQuality.EXCELLENT ? '#10b981' :
                                  session.quality === SleepQuality.GOOD ? '#3b82f6' :
                                  session.quality === SleepQuality.FAIR ? '#f59e0b' : '#ef4444',
                          color: 'white'
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SleepAnalytics;





