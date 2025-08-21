import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Award, Trophy, Star, AlertCircle, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import api from '../api';

const GradeReport = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.get('/results');
        setResults(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching results for report:', err);
        setError('Failed to fetch data for analysis. Verify backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  // Performance calculations
  const totalResults = results.length;
  const passResults = results.filter(r => r.status === 'Pass').length;
  const failResults = results.filter(r => r.status === 'Fail').length;
  const passPercentage = totalResults > 0 ? ((passResults / totalResults) * 100).toFixed(1) : 0;
  
  // Calculate top 5 scorers (results with highest marks)
  const topScorers = [...results]
    .sort((a, b) => b.marks - a.marks)
    .slice(0, 5);

  // Calculate average marks per subject
  const subjectsList = ['Mathematics', 'Science', 'English', 'History', 'Computer Science'];
  const subjectStats = subjectsList.map(subj => {
    const subjResults = results.filter(r => r.subject.toLowerCase() === subj.toLowerCase());
    const total = subjResults.reduce((acc, curr) => acc + curr.marks, 0);
    const avg = subjResults.length > 0 ? (total / subjResults.length).toFixed(1) : '0';
    return {
      subject: subj,
      average: Number(avg),
      count: subjResults.length
    };
  });

  if (loading) {
    return (
      <div className="loading-spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <BarChart3 size={32} /> Grade Analytics Report
        </h1>
        <p style={{ color: 'var(--text-light)', marginTop: '0.25rem' }}>
          Real-time metrics and school-wide performance tracking.
        </p>
      </div>

      {totalResults === 0 ? (
        <div className="empty-state">
          <AlertCircle size={40} className="empty-state-icon" />
          <h3>No Data Available</h3>
          <p>
            Add student profiles and record subject marks to populate analytics gauges.
          </p>
          <Link to="/results/add" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Record First Result
          </Link>
        </div>
      ) : (
        <div>
          {/* Top Row - Dashboard Summary Cards */}
          <div className="grid-layout" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '2.5rem' }}>
            <div className="stat-card" style={{ borderLeft: '4px solid var(--primary-color)' }}>
              <div className="stat-icon" style={{ backgroundColor: '#EFF6FF', color: 'var(--primary-color)' }}>
                <TrendingUp size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{passPercentage}%</span>
                <span className="stat-label">School Pass Rate</span>
              </div>
            </div>

            <div className="stat-card" style={{ borderLeft: '4px solid var(--success-color)' }}>
              <div className="stat-icon" style={{ backgroundColor: '#DCFCE7', color: 'var(--success-color)' }}>
                <CheckCircle size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{passResults}</span>
                <span className="stat-label">Passed Papers</span>
              </div>
            </div>

            <div className="stat-card" style={{ borderLeft: '4px solid var(--error-color)' }}>
              <div className="stat-icon" style={{ backgroundColor: '#FEE2E2', color: 'var(--error-color)' }}>
                <XCircle size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{failResults}</span>
                <span className="stat-label">Failed Papers</span>
              </div>
            </div>
          </div>

          <div className="report-grid">
            {/* Left Column: Top 5 Scorers */}
            <div className="report-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                <Trophy size={22} style={{ color: 'var(--accent-color)' }} />
                <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Top 5 High Scorers</h2>
              </div>
              
              <div className="top-students-list">
                {topScorers.map((scorer, idx) => (
                  <div key={scorer.id} className="top-student-item">
                    <div className="top-student-info">
                      <span className="top-student-name" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {idx === 0 && <Star size={16} fill="var(--accent-color)" stroke="var(--accent-color)" />}
                        {scorer.studentId ? (
                          <Link to={`/students/${scorer.studentId}`} style={{ color: 'var(--primary-color)' }}>
                            {scorer.studentName}
                          </Link>
                        ) : (
                          scorer.studentName
                        )}
                      </span>
                      <span className="top-student-meta">
                        {scorer.subject} &bull; Class {scorer.class}-{scorer.section}
                      </span>
                    </div>
                    <div className="top-student-score">
                      {scorer.marks}<span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 500 }}>/100</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Subject Averages */}
            <div className="report-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                <Award size={22} style={{ color: 'var(--primary-color)' }} />
                <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Subject Performance Averages</h2>
              </div>

              <div className="subject-averages-list">
                {subjectStats.map((stat) => (
                  <div key={stat.subject} className="subject-item">
                    <div className="subject-header">
                      <span>{stat.subject}</span>
                      <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                        Avg: <strong>{stat.average}%</strong> ({stat.count} {stat.count === 1 ? 'result' : 'results'})
                      </span>
                    </div>
                    <div className="subject-progress-bg">
                      <div 
                        className="subject-progress-bar" 
                        style={{ width: `${stat.average}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradeReport;
