import React from 'react';
import '../index.css';

const Navbar = ({ searchQuery, setSearchQuery }) => {
  return (
    <nav className="glass-panel animate-fade-in" style={{ 
      padding: '16px 24px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      position: 'sticky', 
      top: 0, 
      zIndex: 100,
      borderBottom: '1px solid var(--panel-border)',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      borderRadius: 0
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* <div style={{ 
          width: '32px', height: '32px', borderRadius: '4px', 
          background: 'var(--accent-color)', color: 'white',
          display: 'flex', justifyContent: 'center', alignItems: 'center', 
          fontWeight: 'bold' 
        }}>
          &lt;/&gt;
        </div> */}
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Redemption
        </h1>
      </div>
      
      <div style={{ flex: '0 1 400px' }}>
        <input 
          type="text" 
          placeholder="Search questions by title..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ 
            paddingLeft: '36px', 
            background: '#ffffff url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23a0a0a0\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z\'/%3E%3C/svg%3E") no-repeat 10px center', 
            backgroundSize: '16px' 
          }}
        />
      </div>
    </nav>
  );
};

export default Navbar;
