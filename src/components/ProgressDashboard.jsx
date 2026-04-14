import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const ProgressDashboard = ({ allQuestions }) => {
  const { progress, token, toggleQuestion, isQuestionSolved } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && progress && progress.length > 0) {
      const fetchRecommendations = async () => {
        setLoading(true);
        try {
          const res = await api.get('/recommendations');
          setRecommendations(res.data.recommended);
          setAnalysis(res.data);
        } catch (error) {
          console.error("Error fetching defaults", error);
        }
        setLoading(false);
      };
      
      fetchRecommendations();
    }
  }, [token, progress]);

  if (!progress || progress.length === 0) {
    return (
      <div style={{ textAlign: 'center', margin: '2rem 0', color: 'var(--text-secondary)' }}>
        <p>Start solving questions to see your progress and get personalized recommendations!</p>
      </div>
    );
  }

  // Calculate totals per topic from live database questions
  const topicStats = (allQuestions || []).reduce((acc, q) => {
    if (!acc[q.topic]) {
      acc[q.topic] = { total: 0, solved: 0 };
    }
    acc[q.topic].total += 1;
    return acc;
  }, {});

  progress.forEach(p => {
    // using the topic from the progress array
    if (topicStats[p.topic]) {
      topicStats[p.topic].solved += 1;
    }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '32px' }}>
      
      {/* Subject Progress Rings */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
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

      {/* Daily Personalized Set */}
      {analysis && recommendations.length > 0 && (
        <div className="glass-panel animate-fade-in" style={{ padding: '24px', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🎯</span> Daily Personalized Set
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
            Based on your weakness in <strong>{analysis.weakTopics.slice(0, 2).join(' and ')}</strong> and your <strong>{analysis.favorDifficulty}</strong> proficiency level.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recommendations.map(q => {
               const solved = isQuestionSolved(q._id);
               return (
                 <div key={q._id} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.02)' }}>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <a href={q.leetcodeUrl} target="_blank" rel="noreferrer" style={{ fontWeight: '600', color: 'var(--accent-color)', textDecoration: 'none', fontSize: '1.05rem' }}>
                         {q.title}
                       </a>
                       <span style={{ 
                         fontSize: '0.75rem', 
                         padding: '2px 8px', 
                         borderRadius: '12px', 
                         fontWeight: 'bold',
                         background: q.difficulty === 'Easy' ? 'rgba(74, 222, 128, 0.2)' : q.difficulty === 'Medium' ? 'rgba(250, 204, 21, 0.2)' : 'rgba(248, 113, 113, 0.2)',
                         color: q.difficulty === 'Easy' ? '#4ade80' : q.difficulty === 'Medium' ? '#facc15' : '#f87171' 
                       }}>
                         {q.difficulty}
                       </span>
                     </div>
                     <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '12px' }}>
                       <span>Platform: {q.platform}</span>
                       <span>Topics: {q.topicTags.slice(0, 3).join(', ')}</span>
                     </div>
                   </div>
                   
                   <button 
                     onClick={() => toggleQuestion(q._id, q.topicTags[0] || 'Uncategorized')}
                     className="glass-button"
                     style={{ 
                       padding: '8px 16px', 
                       display: 'flex', 
                       alignItems: 'center', 
                       gap: '6px',
                       background: solved ? 'rgba(74, 222, 128, 0.1)' : undefined,
                       borderColor: solved ? 'rgba(74, 222, 128, 0.3)' : undefined,
                       color: solved ? '#4ade80' : undefined
                     }}
                   >
                     {solved ? '✓ Solved' : 'Mark Solved'}
                   </button>
                 </div>
               );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProgressDashboard;
