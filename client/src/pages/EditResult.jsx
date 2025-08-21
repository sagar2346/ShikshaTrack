import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Edit, ArrowLeft, AlertCircle, Award, CheckCircle2 } from 'lucide-react';
import api from '../api';

const EditResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    subject: '',
    marks: ''
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Computer Science'];

  useEffect(() => {
    const fetchResultData = async () => {
      try {
        const response = await api.get('/results');
        const matchedResult = response.data.find(r => String(r.id) === String(id));
        
        if (!matchedResult) {
          setError('Academic record not found.');
          return;
        }

        setFormData({
          studentId: matchedResult.studentId,
          studentName: matchedResult.studentName,
          subject: matchedResult.subject,
          marks: matchedResult.marks
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching result for editing:', err);
        setError('Failed to fetch result profile. Please make sure the server is online.');
      } finally {
        setLoading(false);
      }
    };

    fetchResultData();
  }, [id]);

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
      await api.put(`/results/${id}`, {
        studentId,
        subject,
        marks: numericMarks
      });
      setSuccess(true);

      // Redirect back to student details page
      setTimeout(() => {
        navigate(`/students/${studentId}`);
      }, 1500);
    } catch (err) {
      console.error('Error updating result:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to update result. Please check connectivity.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-light)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="form-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <div style={{ color: 'var(--primary-color)' }}><Edit size={28} /></div>
          <h1 style={{ margin: 0, fontSize: '1.75rem' }}>Edit Academic Record</h1>
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
            <div>Subject result updated successfully! Redirecting...</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Readonly student descriptor */}
          <div className="form-group">
            <label className="form-label">Student Name</label>
            <input
              type="text"
              className="form-control"
              value={formData.studentName}
              disabled
              style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-light)', cursor: 'not-allowed' }}
            />
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
              disabled={submitting || success}
            >
              {submitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditResult;
