import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { PlusSquare, ArrowLeft, AlertCircle, Award, CheckCircle2 } from 'lucide-react';
import api from '../api';

const AddResult = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedStudentId = searchParams.get('studentId') || '';

  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: preSelectedStudentId,
    subject: '',
    marks: ''
  });
  
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Computer Science'];

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get('/students');
        setStudents(res.data);
      } catch (err) {
        console.error('Error fetching students list:', err);
        setError('Failed to fetch student registry. Please make sure server is online.');
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Live Auto Grade Calculation on the fly!
  const calculateLiveGrade = (marksInput) => {
    if (marksInput === '' || isNaN(marksInput)) return { grade: '—', status: '—' };
    const m = Number(marksInput);
    if (m < 0 || m > 100) return { grade: 'Invalid Marks', status: 'Invalid' };

    let grade = 'F';
    if (m >= 90) grade = 'A+';
    else if (m >= 80) grade = 'A';
    else if (m >= 70) grade = 'B+';
    else if (m >= 60) grade = 'B';
    else if (m >= 50) grade = 'C';
    else if (m >= 40) grade = 'D';
    else grade = 'F';

    const status = m >= 40 ? 'Pass' : 'Fail';
    return { grade, status };
  };

  const { grade: liveGrade, status: liveStatus } = calculateLiveGrade(formData.marks);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const { studentId, subject, marks } = formData;
    if (!studentId || !subject || marks === '') {
      setError('Please fill in all result fields.');
      return;
    }

    const numericMarks = Number(marks);
    if (isNaN(numericMarks) || numericMarks < 0 || numericMarks > 100) {
      setError('Marks must be a valid number between 0 and 100.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/results', {
        studentId,
        subject,
        marks: numericMarks
      });
      setSuccess(true);
      
      // Clear form except studentId for convenience
      setFormData({
        studentId: formData.studentId,
        subject: '',
        marks: ''
      });

      // Redirect back to student details page if it was preselected, otherwise go to all results
      setTimeout(() => {
        if (preSelectedStudentId) {
          navigate(`/students/${preSelectedStudentId}`);
        } else {
          navigate('/results');
        }
      }, 2000);
    } catch (err) {
      console.error('Error adding result:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to record result. Please check connectivity.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link 
          to={preSelectedStudentId ? `/students/${preSelectedStudentId}` : "/results"} 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-light)', fontWeight: 500 }}
        >
          <ArrowLeft size={16} /> Back
        </Link>
      </div>

      <div className="form-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <div style={{ color: 'var(--primary-color)' }}><PlusSquare size={28} /></div>
          <h1 style={{ margin: 0, fontSize: '1.75rem' }}>Enter Student Marks</h1>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <div>{error}</div>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <CheckCircle2 size={18} />
            <div>Subject result recorded successfully! Redirecting...</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Student selection */}
          <div className="form-group">
            <label className="form-label">Select Student *</label>
            {loadingStudents ? (
              <div style={{ padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', color: 'var(--text-muted)' }}>
                Loading student directory...
              </div>
            ) : (
              <select
                name="studentId"
                className="form-control"
                value={formData.studentId}
                onChange={handleChange}
                disabled={submitting || success || !!preSelectedStudentId}
                required
              >
                <option value="">Select Student...</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} (Roll: {student.rollNumber} - Class: {student.class})
                  </option>
                ))}
              </select>
            )}
            {preSelectedStudentId && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                Note: Locked to the student profile you navigated from.
              </span>
            )}
          </div>

          {/* Subject selection */}
          <div className="form-group">
            <label className="form-label">Subject *</label>
            <select
              name="subject"
              className="form-control"
              value={formData.subject}
              onChange={handleChange}
              disabled={submitting || success}
              required
            >
              <option value="">Choose Subject...</option>
              {subjects.map((subj) => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>
          </div>

          {/* Marks input */}
          <div className="form-group">
            <label className="form-label">Marks Obtained (Out of 100) *</label>
            <input
              type="number"
              name="marks"
              className="form-control"
              placeholder="e.g. 85"
              min="0"
              max="100"
              value={formData.marks}
              onChange={handleChange}
              disabled={submitting || success}
              required
            />
          </div>

          {/* Dynamic Grading System Preview */}
          {formData.marks !== '' && !isNaN(formData.marks) && (
            <div style={{ margin: '1.5rem 0', padding: '1.25rem', backgroundColor: 'var(--card-bg)', borderRadius: 'var(--border-radius-sm)', border: `1px solid var(--border-color)` }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Grading Engine Live Status
              </div>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Letter Grade:</span>
                  <span className={`badge ${liveStatus === 'Pass' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '1rem', padding: '0.3rem 0.8rem' }}>
                    {liveGrade}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Final Status:</span>
                  <span className={`badge ${liveStatus === 'Pass' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '1rem', padding: '0.3rem 0.8rem' }}>
                    {liveStatus}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flexGrow: 1 }}
              disabled={submitting || success || loadingStudents}
            >
              {submitting ? 'Recording...' : 'Record Result'}
            </button>
            <Link
              to={preSelectedStudentId ? `/students/${preSelectedStudentId}` : "/results"}
              className="btn btn-outline"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddResult;
