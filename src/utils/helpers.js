export const filterQuestions = (questions, filters, searchQuery) => {
  return questions.filter(q => {
    // Search query
    if (searchQuery && !q.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Platform filter
    if (filters.platforms && filters.platforms.length > 0) {
      if (!filters.platforms.includes(q.platform)) return false;
    }

    // Difficulty filter
    if (filters.difficulties && filters.difficulties.length > 0) {
      if (!filters.difficulties.includes(q.difficulty)) return false;
    }

    // Hierarchical Taxonomy Filter (Topics / Subtopics)
    const hasTopicFilters = filters.topics && filters.topics.length > 0;
    const hasSubtopicFilters = filters.subtopics && filters.subtopics.length > 0;
    
    if (hasTopicFilters || hasSubtopicFilters) {
      // Passes if its exact main topic is selected OR its exact subtopic is selected
      const matchesTopic = hasTopicFilters && filters.topics.includes(q.topic);
      const matchesSubtopic = hasSubtopicFilters && filters.subtopics.includes(q.subtopic);
      
      if (!matchesTopic && !matchesSubtopic) {
        return false;
      }
    }

    // Companies filter
    if (filters.companies && filters.companies.length > 0) {
      const hasCompany = (q.companies || []).some(c => filters.companies.includes(c));
      if (!hasCompany) return false;
    }

    // Years filter
    if (filters.years && filters.years.length > 0) {
      if (!filters.years.includes(String(q.year))) return false;
    }

    return true;
  });
};
