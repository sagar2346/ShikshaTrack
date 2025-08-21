import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Filter, AlertCircle, Eye, BookOpen } from 'lucide-react';
import api from '../api';

const SearchFilter = () => {
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Advanced Search States
  const [nameOrRoll, setNameOrRoll] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [sectionFilter, setSectionFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');

  const classes = ['All', '10th', '11th', '12th'];
  const sections = ['All', 'A', 'B', 'C', 'D'];
  const genders = ['All', 'Male', 'Female', 'Other'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsRes = await api.get('/students');
        const resultsRes = await api.get('/results');
        
        setStudents(studentsRes.data);
        setResults(resultsRes.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching advanced search data:', err);
        setError('Failed to download student catalog. Verify server is online.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Multi-dimensional filtering logic
  const filteredStudents = students.filter(student => {
    // 1. Name or Roll Number search
    const textQuery = nameOrRoll.toLowerCase().trim();
    const matchesText = textQuery === '' ||
      student.name.toLowerCase().includes(textQuery) ||
      student.rollNumber.toLowerCase().includes(textQuery);

    // 2. Class Filter
    const matchesClass = classFilter === 'All' || student.class === classFilter;

    // 3. Section Filter
    const matchesSection = sectionFilter === 'All' || student.section === sectionFilter;

    // 4. Gender Filter
    const matchesGender = genderFilter === 'All' || student.gender === genderFilter;

    return matchesText && matchesClass && matchesSection && matchesGender;
  });

  // Helper to count subjects graded for a student
  const getSubjectCount = (studentId) => {
    return results.filter(r => String(r.studentId) === String(studentId)).length;
  };

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
          <Search size={32} /> Advanced Student Search
        </h1>
        <p style={{ color: 'var(--text-light)', marginTop: '0.25rem' }}>
          Perform precise queries across name, roll number, class, section, and gender.
        </p>
      </div>

      {/* Advanced Query Control Console */}
      <div className="search-controls">
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Search size={14} /> Name / Roll Number</label>
          <input
            type="text"
            className="form-control"
            placeholder="Type student name or roll..."
            value={nameOrRoll}
            onChange={(e) => setNameOrRoll(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Filter size={14} /> Class</label>
          <select
            className="form-control"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          >
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Filter size={14} /> Section</label>
          <select
            className="form-control"
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
          >
            {sections.map(sec => (
              <option key={sec} value={sec}>{sec}</option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Filter size={14} /> Gender</label>
          <select
            className="form-control"
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
          >
            {genders.map(gen => (
              <option key={gen} value={gen}>{gen}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Search Results</h2>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', fontWeight: 500 }}>
          Found {filteredStudents.length} matching students
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="empty-state">
          <AlertCircle size={40} className="empty-state-icon" />
          <h3>No Matching Students</h3>
          <p>
            Adjust your advanced filters or type a different query to find registry records.
          </p>
        </div>
      ) : (
        <div className="grid-layout" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {filteredStudents.map(student => {
            const subjectsGraded = getSubjectCount(student.id);
            return (
              <div
                key={student.id}
                className="report-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.25s ease',
                  border: '1px solid var(--border-color)',
                  height: '100%'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                      <User size={22} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      <span className="badge badge-primary">{student.class}</span>
                      <span className="badge badge-orange">{student.section}</span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem', color: 'var(--primary-color)' }}>{student.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
                    Roll Number: <strong>{student.rollNumber}</strong> &bull; {student.gender}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 550 }}>
                    <BookOpen size={14} style={{ color: 'var(--text-muted)' }} />
                    <span>Graded: <strong>{subjectsGraded}</strong> subjects</span>
                  </div>

                  <Link to={`/students/${student.id}`} className="btn btn-outline btn-sm" style={{ gap: '0.25rem' }}>
                    <Eye size={14} /> Profile
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
