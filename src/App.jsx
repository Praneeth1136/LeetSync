import { useState, useMemo } from 'react';
import './index.css';
import { mockQuestions } from './utils/mockData';
import { filterQuestions } from './utils/helpers';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import QuestionList from './components/QuestionList';
import ProgressDashboard from './components/ProgressDashboard';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    platforms: [],
    difficulties: [],
    topics: [],
    subtopics: [],
    companies: [],
    years: []
  });

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const current = prev[filterType];
      if (current.includes(value)) {
        return { ...prev, [filterType]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [filterType]: [...current, value] };
      }
    });
  };

  const clearFilters = () => {
    setFilters({
      platforms: [],
      difficulties: [],
      topics: [],
      subtopics: [],
      companies: [],
      years: []
    });
    setSearchQuery('');
  };

  const filteredQuestions = useMemo(() => {
    return filterQuestions(mockQuestions, filters, searchQuery);
  }, [filters, searchQuery]);

  return (
    <div className="app-container">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <main className="main-content">
        <Sidebar filters={filters} onFilterChange={handleFilterChange} onClearFilters={clearFilters} />
        <div style={{ flex: '1' }}>
          <ProgressDashboard />
          <QuestionList questions={filteredQuestions} />
        </div>
      </main>
    </div>
  );
}

export default App;
