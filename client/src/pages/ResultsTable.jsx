import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, PlusSquare, Edit, Trash2, Filter, AlertCircle, Award } from 'lucide-react';
import api from '../api';

const ResultsTable = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Filters
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');

  const classes = ['All', '10th', '11th', '12th'];
  const sections = ['All', 'A', 'B', 'C', 'D'];

  const fetchResults = async () => {
    try {
      const response = await api.get('/results');
      setResults(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching results:', err);
      setError('Could not retrieve results list. Verify backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleDelete = async (id, studentName, subject) => {
    if (window.confirm(`Are you sure you want to delete the result of "${studentName}" in "${subject}"?`)) {
      try {
        await api.delete(`/results/${id}`);
        setResults(results.filter(r => String(r.id) !== String(id)));
        setFeedback({
          type: 'success',
          text: `Deleted academic record of "${studentName}" for "${subject}" successfully.`
        });
        setTimeout(() => setFeedback(null), 3000);
      } catch (err) {
        console.error('Error deleting result:', err);
        setFeedback({ type: 'danger', text: 'Failed to delete the result. Please try again.' });
        setTimeout(() => setFeedback(null), 3000);
      }
    }
  };

  // Filter logic
  const filteredResults = results.filter(result => {
    const matchesClass = selectedClass === 'All' || result.class === selectedClass;
    const matchesSection = selectedSection === 'All' || result.section === selectedSection;
    return matchesClass && matchesSection;
  });

  // Performance computations for filtered records
  const totalFiltered = filteredResults.length;
  const passedFiltered = filteredResults.filter(r => r.status === 'Pass').length;
  const failedFiltered = filteredResults.filter(r => r.status === 'Fail').length;
  const passRateFiltered = totalFiltered > 0 ? ((passedFiltered / totalFiltered) * 100).toFixed(0) : 0;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>Academic Results</h1>
        <Link to="/results/add" className="btn btn-primary">
          <PlusSquare size={18} /> Add Student Result
        </Link>
      </div>

      {feedback && (
        <div className={`alert alert-${feedback.type}`}>
          {feedback.text}
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Filter Toolbar Controls */}
      <div className="search-bar-container">
        <div className="filters-wrapper">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-light)', fontSize: '0.95rem', fontWeight: 550 }}>
            <Filter size={16} /> Filters:
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Class</span>
            <select
              className="filter-select"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Section</span>
            <select
              className="filter-select"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              {sections.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>
        </div>

        {totalFiltered > 0 && (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.9rem', color: 'var(--text-light)', fontWeight: 500 }}>
            <div>Records: <strong>{totalFiltered}</strong></div>
            <div>Pass Rate: <strong style={{ color: 'var(--success-color)' }}>{passRateFiltered}%</strong></div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading-spinner-container">
          <div className="spinner"></div>
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="empty-state">
          <AlertCircle size={40} className="empty-state-icon" />
          <h3>No Results Recorded</h3>
          <p>
            {selectedClass !== 'All' || selectedSection !== 'All' 
              ? 'No academic results match your selected class and section criteria.' 
              : 'There are no subject result records stored in the server registry.'}
          </p>
          {selectedClass === 'All' && selectedSection === 'All' && (
            <Link to="/results/add" className="btn btn-accent" style={{ marginTop: '1rem' }}>
              Add Your First Result Entry
            </Link>
          )}
        </div>
      ) : (
        <div className="table-container">
          <table className="responsive-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Roll Number</th>
                <th>Class</th>
                <th>Section</th>
                <th>Subject</th>
                <th>Marks</th>
                <th>Grade</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((result) => (
                <tr key={result.id}>
                  <td style={{ fontWeight: 600 }}>
                    {result.studentId ? (
                      <Link to={`/students/${result.studentId}`} style={{ color: 'var(--primary-color)' }}>
                        {result.studentName}
                      </Link>
                    ) : (
                      result.studentName
                    )}
                  </td>
                  <td>{result.rollNumber}</td>
                  <td><span className="badge badge-primary">{result.class}</span></td>
                  <td><span className="badge badge-orange">{result.section}</span></td>
                  <td style={{ fontWeight: 500, color: 'var(--text-dark)' }}>{result.subject}</td>
                  <td style={{ fontWeight: 600 }}>{result.marks}</td>
                  <td>
                    <span className={`badge ${result.marks >= 70 ? 'badge-success' : result.marks >= 40 ? 'badge-primary' : 'badge-danger'}`}>
                      {result.grade}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${result.status === 'Pass' ? 'badge-success' : 'badge-danger'}`}>
                      {result.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <Link
                        to={`/results/edit/${result.id}`}
                        className="btn btn-outline btn-sm"
                        title="Edit Marks"
                        style={{ padding: '0.4rem', color: 'var(--accent-color)' }}
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(result.id, result.studentName, result.subject)}
                        className="btn btn-outline btn-sm"
                        title="Delete Marks"
                        style={{ padding: '0.4rem', color: 'var(--error-color)' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResultsTable;
