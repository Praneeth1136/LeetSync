import { useState, useMemo, useEffect } from 'react';
import './index.css';
import { filterQuestions } from './utils/helpers';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import QuestionList from './components/QuestionList';
import ProgressDashboard from './components/ProgressDashboard';
import api from './api/axios';

function App() {
  const [questions, setQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    platforms: [],
    difficulties: [],
    topics: [],
    subtopics: [],
    companies: [],
    years: []
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get('/questions');
        setQuestions(res.data);
      } catch (error) {
        console.error("Failed to fetch questions", error);
      }
    };
    fetchQuestions();
  }, []);

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
    return filterQuestions(questions, filters, searchQuery);
  }, [questions, filters, searchQuery]);

  return (
    <div className="app-container">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <main className="main-content">
        <Sidebar filters={filters} onFilterChange={handleFilterChange} onClearFilters={clearFilters} />
        <div style={{ flex: '1' }}>
          <ProgressDashboard allQuestions={questions} />
          <QuestionList questions={filteredQuestions} />
        </div>
      </main>
    </div>
  );
}

export default App;
