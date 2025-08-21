import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { UserPlus, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../api';

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    class: '',
    section: '',
    gender: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const classes = ['10th', '11th', '12th'];
  const sections = ['A', 'B', 'C', 'D'];

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await api.get(`/students/${id}`);
        const { name, rollNumber, class: className, section, gender } = response.data;
        setFormData({ name, rollNumber, class: className, section, gender });
        setError(null);
      } catch (err) {
        console.error('Error fetching student for edit:', err);
        setError('Failed to fetch student profile. Verify server is online.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const { name, rollNumber, class: className, section, gender } = formData;
    if (!name.trim() || !rollNumber.trim() || !className || !section || !gender) {
      setError('Please fill in all student details.');
      return;
    }

    setSubmitting(true);
    try {
      await api.put(`/students/${id}`, formData);
      setSuccess(true);
      
      // Navigate back to student detail page after 1.5 seconds
      setTimeout(() => {
        navigate(`/students/${id}`);
      }, 1500);
    } catch (err) {
      console.error('Error updating student profile:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to update student profile. Verify server is online.');
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
        <Link to={`/students/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-light)', fontWeight: 500 }}>
          <ArrowLeft size={16} /> Back to Student Profile
        </Link>
      </div>

      <div className="form-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <div style={{ color: 'var(--primary-color)' }}><UserPlus size={28} /></div>
          <h1 style={{ margin: 0, fontSize: '1.75rem' }}>Edit Student Profile</h1>
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
            <div>Student profile updated successfully! Redirecting...</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={handleChange}
              disabled={submitting || success}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Roll Number *</label>
            <input
              type="text"
              name="rollNumber"
              className="form-control"
              placeholder="e.g. 101"
              value={formData.rollNumber}
              onChange={handleChange}
              disabled={submitting || success}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Class *</label>
              <select
                name="class"
                className="form-control"
                value={formData.class}
                onChange={handleChange}
                disabled={submitting || success}
                required
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Section *</label>
              <select
                name="section"
                className="form-control"
                value={formData.section}
                onChange={handleChange}
                disabled={submitting || success}
                required
              >
                <option value="">Select Section</option>
                {sections.map((sec) => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Gender *</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  className="radio-input"
                  checked={formData.gender === 'Male'}
                  onChange={handleChange}
                  disabled={submitting || success}
                  required
                />
                Male
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  className="radio-input"
                  checked={formData.gender === 'Female'}
                  onChange={handleChange}
                  disabled={submitting || success}
                />
                Female
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  className="radio-input"
                  checked={formData.gender === 'Other'}
                  onChange={handleChange}
                  disabled={submitting || success}
                />
                Other
              </label>
            </div>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flexGrow: 1 }}
              disabled={submitting || success}
            >
              {submitting ? 'Updating...' : 'Save Changes'}
            </button>
            <Link
              to={`/students/${id}`}
              className="btn btn-outline"
              style={{ flexShrink: 0 }}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudent;
