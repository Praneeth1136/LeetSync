import React from 'react';
import QuestionCard from './QuestionCard';

const QuestionList = ({ questions }) => {
  if (questions.length === 0) {
    return (
      <div className="glass-panel animate-fade-in" style={{ flex: 1, padding: '48px', borderRadius: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>😕</div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>No questions found</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Results ({questions.length})</h2>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {questions.map((question, index) => (
          <QuestionCard key={question.id} question={question} index={index} />
        ))}
      </div>
    </div>
  );
};

export default QuestionList;
