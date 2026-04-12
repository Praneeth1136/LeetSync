import React, { useState } from 'react';
import { platforms, difficulties, taxonomy, companies, years } from '../utils/mockData';

const FilterSection = ({ title, options, filterKey, filters, onFilterChange }) => (
  <div style={{ marginBottom: '24px' }}>
    <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 600 }}>{title}</h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {options.map(option => (
        <label key={option} className="checkbox-label" style={{ cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            style={{ width: 'auto', cursor: 'pointer' }}
            checked={filters[filterKey].includes(option)}
            onChange={() => onFilterChange(filterKey, option)}
          />
          {option}
        </label>
      ))}
    </div>
  </div>
);

const TaxonomyGroup = ({ group, filters, onFilterChange }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Check if the main topic or any subtopic is explicitly selected
  const isTopicChecked = filters.topics.includes(group.topic);
  const hasActiveSubtopic = group.subtopics.some(sub => filters.subtopics.includes(sub));

  return (
    <div style={{ background: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: '6px', overflow: 'hidden' }}>
      <div 
        style={{ 
          padding: '10px 12px', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          background: isTopicChecked || hasActiveSubtopic ? '#f1f5f9' : 'transparent',
          borderLeft: isTopicChecked || hasActiveSubtopic ? '3px solid var(--accent-color)' : '3px solid transparent',
          transition: 'background 0.2s'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <input 
            type="checkbox" 
            style={{ width: 'auto', marginRight: '10px', cursor: 'pointer' }}
            checked={isTopicChecked}
            onChange={() => onFilterChange('topics', group.topic)}
          />
          <span 
            style={{ fontWeight: 500, fontSize: '0.9rem', color: isTopicChecked || hasActiveSubtopic ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer', flex: 1, userSelect: 'none' }}
            onClick={() => setExpanded(!expanded)}
          >
            {group.topic}
          </span>
        </div>
        
        <span 
          onClick={() => setExpanded(!expanded)}
          style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
        >
          {expanded ? '▲' : '▼'}
        </span>
      </div>
      
      {expanded && (
        <div style={{ padding: '10px 12px 10px 34px', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #e9ecef', backgroundColor: '#ffffff' }}>
          {group.subtopics.map(sub => (
            <label key={sub} className="checkbox-label" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                style={{ width: 'auto', cursor: 'pointer' }}
                checked={filters.subtopics.includes(sub)}
                onChange={() => onFilterChange('subtopics', sub)}
              />
              {sub}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const TaxonomySection = ({ filters, onFilterChange }) => {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 600 }}>DSA Patterns</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {taxonomy.map(group => (
          <TaxonomyGroup key={group.topic} group={group} filters={filters} onFilterChange={onFilterChange} />
        ))}
      </div>
    </div>
  );
};

const Sidebar = ({ filters, onFilterChange, onClearFilters }) => {
  return (
    <aside className="glass-panel animate-fade-in" style={{ width: '300px', padding: '24px', borderRadius: '12px', height: 'fit-content', position: 'sticky', top: '90px', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Filters</h2>
        <button 
          onClick={onClearFilters}
          style={{
            background: 'transparent', border: 'none', color: 'var(--accent-color)', 
            fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', padding: '4px 8px', borderRadius: '4px'
          }}
          onMouseEnter={(e) => e.target.style.background = '#eff6ff'}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
        >
          Clear All
        </button>
      </div>

      <FilterSection title="Platform" options={platforms} filterKey="platforms" filters={filters} onFilterChange={onFilterChange} />
      <div style={{ height: '1px', background: 'var(--panel-border)', margin: '24px 0' }} />
      
      <FilterSection title="Difficulty" options={difficulties} filterKey="difficulties" filters={filters} onFilterChange={onFilterChange} />
      <div style={{ height: '1px', background: 'var(--panel-border)', margin: '24px 0' }} />
      
      <TaxonomySection filters={filters} onFilterChange={onFilterChange} />
      <div style={{ height: '1px', background: 'var(--panel-border)', margin: '24px 0' }} />
      
      <FilterSection title="Companies" options={companies} filterKey="companies" filters={filters} onFilterChange={onFilterChange} />
      <div style={{ height: '1px', background: 'var(--panel-border)', margin: '24px 0' }} />
      
      <FilterSection title="Year" options={years} filterKey="years" filters={filters} onFilterChange={onFilterChange} />
    </aside>
  );
};

export default Sidebar;
