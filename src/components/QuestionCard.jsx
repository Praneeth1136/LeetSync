import React from 'react';
import { useAuth } from '../context/AuthContext';

const QuestionCard = ({ question, index }) => {
  const { isQuestionSolved, toggleQuestion, user } = useAuth();
  const solved = isQuestionSolved(question.id);
  const diffClass = question.difficulty.toLowerCase();
  
  const handleTick = (e) => {
    e.preventDefault(); 
    if (!user) {
      alert("Please login to track progress!");
      return;
    }
    toggleQuestion(question.id, question.topic);
  };
  
  return (
    <a 
      href={question.link} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`glass-panel animate-fade-in`}
      style={{ 
        display: 'block', 
        padding: '24px', 
        borderRadius: '12px', 
        textDecoration: 'none', 
        color: 'inherit',
        transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
        animationDelay: `${index * 0.05}s`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = 'var(--accent-color)';
        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.borderColor = 'var(--panel-border)';
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div 
            onClick={handleTick}
            style={{
              width: '24px', height: '24px', borderRadius: '50%',
              border: '2px solid var(--accent-color)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              backgroundColor: solved ? 'var(--accent-color)' : 'transparent',
              color: 'white',
              transition: 'all 0.2s ease',
              flexShrink: 0,
              marginTop: '2px'
            }}
          >
            {solved && (
              <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{question.id}. {question.title}</h3>
        </div>
        <span style={{ 
          color: `var(--${diffClass}-color)`, 
          backgroundColor: `var(--${diffClass}-bg)`, 
          padding: '4px 12px', 
          borderRadius: '999px', 
          fontSize: '0.875rem', 
          fontWeight: 600,
          border: `1px solid rgba(var(--${diffClass}-color), 0.2)` 
        }}>
          {question.difficulty}
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        <span className="glass-pill">{question.platform}</span>
        <span className="glass-pill">{question.topic} &gt; {question.subtopic}</span>
        <span className="glass-pill" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {question.year}
        </span>
        <span className="glass-pill" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {question.acceptance} Acc.
        </span>
      </div>

      {question.companies && question.companies.length > 0 && (
        <div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Asked in:</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {question.companies.map(company => (
              <span key={company} style={{ fontSize: '0.875rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--panel-border)' }}>
                {company}
              </span>
            ))}
          </div>
        </div>
      )}
    </a>
  );
};

export default QuestionCard;
