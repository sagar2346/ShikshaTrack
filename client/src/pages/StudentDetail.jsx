import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { User, Calendar, BookOpen, PlusCircle, Edit, Trash2, ArrowLeft, Award, Percent, AlertCircle } from 'lucide-react';
import api from '../api';

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const studentRes = await api.get(`/students/${id}`);
      setStudent(studentRes.data);

      const resultsRes = await api.get(`/results/student/${id}`);
      setResults(resultsRes.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching student details:', err);
      setError('Student not found or failed to retrieve records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [id]);

  const handleDeleteStudent = async () => {
    if (window.confirm(`Are you sure you want to delete student "${student.name}"? This deletes all their result logs permanently.`)) {
      try {
        await api.delete(`/students/${id}`);
        navigate('/students');
      } catch (err) {
        console.error('Error deleting student:', err);
        setFeedback({ type: 'danger', text: 'Failed to delete student. Please try again.' });
      }
    }
  };

  const handleDeleteResult = async (resultId, subject) => {
    if (window.confirm(`Are you sure you want to delete the result for ${subject}?`)) {
      try {
        await api.delete(`/results/${resultId}`);
        setResults(results.filter(r => String(r.id) !== String(resultId)));
        setFeedback({ type: 'success', text: `Result for ${subject} deleted successfully!` });
        setTimeout(() => setFeedback(null), 3000);
      } catch (err) {
        console.error('Error deleting result:', err);
        setFeedback({ type: 'danger', text: 'Failed to delete result. Please try again.' });
        setTimeout(() => setFeedback(null), 3000);
      }
    }
  };

  // Performance calculations
  const totalSubjects = results.length;
  const passSubjects = results.filter(r => r.status === 'Pass').length;
  const failSubjects = results.filter(r => r.status === 'Fail').length;
  const totalMarks = results.reduce((acc, curr) => acc + curr.marks, 0);
  const averageMarks = totalSubjects > 0 ? (totalMarks / totalSubjects).toFixed(1) : 0;
  const passRate = totalSubjects > 0 ? ((passSubjects / totalSubjects) * 100).toFixed(0) : 0;

  if (loading) {
    return (
      <div className="loading-spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/students" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-light)', fontWeight: 500 }}>
            <ArrowLeft size={16} /> Back to Student Registry
          </Link>
        </div>
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link to="/students" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-light)', fontWeight: 500, marginBottom: '0.75rem' }}>
            <ArrowLeft size={16} /> Back to Registry
          </Link>
          <h1 style={{ margin: 0 }}>Student Profile</h1>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to={`/students/edit/${student.id}`} className="btn btn-outline">
            <Edit size={16} /> Edit Profile
          </Link>
          <button onClick={handleDeleteStudent} className="btn btn-danger">
            <Trash2 size={16} /> Delete Student
          </button>
        </div>
      </div>

      {feedback && (
        <div className={`alert alert-${feedback.type}`}>
          {feedback.text}
        </div>
      )}

      <div className="detail-grid">
        {/* Left Profile card */}
        <div className="student-info-sidebar">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingBottom: '1.5rem', borderBottom: `1px solid var(--border-color)` }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: 'var(--primary-color)', marginBottom: '1rem', border: `2px solid var(--border-color)` }}>
              <User size={40} />
            </div>
            <h2 style={{ fontSize: '1.35rem', margin: 0 }}>{student.name}</h2>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Roll No: {student.rollNumber}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Class</span>
            <span className="info-value">{student.class}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Section</span>
            <span className="info-value">{student.section}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Gender</span>
            <span className="info-value">{student.gender}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Registered Since</span>
            <div className="info-value" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Calendar size={16} style={{ color: 'var(--text-muted)' }} />
              <span>{new Date(student.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          {/* Quick GPA Summary */}
          {totalSubjects > 0 && (
            <div style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: `1px solid var(--border-color)` }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Performance Summary</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ backgroundColor: '#FFFFFF', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: `1px solid var(--border-color)`, textAlign: 'center' }}>
                  <Percent size={18} style={{ color: 'var(--accent-color)', marginBottom: '0.2rem' }} />
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-color)' }}>{averageMarks}%</div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontWeight: 500 }}>Average</span>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: `1px solid var(--border-color)`, textAlign: 'center' }}>
                  <Award size={18} style={{ color: 'var(--success-color)', marginBottom: '0.2rem' }} />
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--success-color)' }}>{passRate}%</div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontWeight: 500 }}>Pass Rate</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Marks Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>Academic Marks Sheet</h2>
            <Link to={`/results/add?studentId=${student.id}`} className="btn btn-accent btn-sm">
              <PlusCircle size={16} /> Add Subject Grade
            </Link>
          </div>

          {results.length === 0 ? (
            <div className="empty-state" style={{ padding: '4rem 2rem' }}>
              <BookOpen size={44} className="empty-state-icon" />
              <h3>No Academic Records</h3>
              <p>This student currently does not have any marks added for the semester.</p>
              <Link to={`/results/add?studentId=${student.id}`} className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
                Insert First Result
              </Link>
            </div>
          ) : (
            <div>
              {/* Detailed metrics row */}
              <div className="grid-layout" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ backgroundColor: 'var(--card-bg)', border: `1px solid var(--border-color)`, borderRadius: 'var(--border-radius-sm)', padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase' }}>Subjects Enrolled</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>{totalSubjects}</div>
                </div>
                <div style={{ backgroundColor: 'var(--card-bg)', border: `1px solid var(--border-color)`, borderRadius: 'var(--border-radius-sm)', padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--success-color)', textTransform: 'uppercase' }}>Passed Subjects</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success-color)' }}>{passSubjects}</div>
                </div>
                <div style={{ backgroundColor: 'var(--card-bg)', border: `1px solid var(--border-color)`, borderRadius: 'var(--border-radius-sm)', padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--error-color)', textTransform: 'uppercase' }}>Failed Subjects</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--error-color)' }}>{failSubjects}</div>
                </div>
              </div>

              {/* Table listings */}
              <div className="table-container">
                <table className="responsive-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Marks (out of 100)</th>
                      <th>Grade Letter</th>
                      <th>Status</th>
                      <th>Date Recorded</th>
                      <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => (
                      <tr key={result.id}>
                        <td style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{result.subject}</td>
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
                        <td>{new Date(result.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <Link
                              to={`/results/edit/${result.id}`}
                              className="btn btn-outline btn-sm"
                              title="Edit Result"
                              style={{ padding: '0.4rem', color: 'var(--accent-color)' }}
                            >
                              <Edit size={14} />
                            </Link>
                            <button
                              onClick={() => handleDeleteResult(result.id, result.subject)}
                              className="btn btn-outline btn-sm"
                              title="Delete Result"
                              style={{ padding: '0.4rem', color: 'var(--error-color)' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
