import React from 'react';
import { useAuth } from '../context/AuthContext';
import { mockQuestions } from '../utils/mockData';

const ProgressDashboard = () => {
  const { progress } = useAuth();
  
  if (!progress || progress.length === 0) return null;

  // Calculate totals per topic
  const topicStats = mockQuestions.reduce((acc, q) => {
    if (!acc[q.topic]) {
      acc[q.topic] = { total: 0, solved: 0 };
    }
    acc[q.topic].total += 1;
    return acc;
  }, {});

  progress.forEach(p => {
    if (topicStats[p.topic]) {
      topicStats[p.topic].solved += 1;
    }
  });

  return (
    <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
      {Object.entries(topicStats).map(([topic, stats]) => {
        if (stats.solved === 0) return null;
        const percentage = Math.round((stats.solved / stats.total) * 100);
        const radius = 30;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;

        return (
          <div key={topic} className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '12px' }}>
            <div style={{ position: 'relative', width: '70px', height: '70px' }}>
              <svg width="70" height="70" style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx="35"
                  cy="35"
                  r={radius}
                  stroke="var(--panel-border)"
                  strokeWidth="6"
                  fill="none"
                />
                <circle
                  cx="35"
                  cy="35"
                  r={radius}
                  stroke="var(--accent-color)"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                />
              </svg>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                {percentage}%
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{topic}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{stats.solved} / {stats.total} Solved</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressDashboard;
