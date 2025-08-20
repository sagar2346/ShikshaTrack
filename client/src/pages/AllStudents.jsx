import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Edit, Trash2, UserPlus, AlertCircle } from 'lucide-react';
import api from '../api';

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      setStudents(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Could not retrieve student list. Please make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete student "${name}"? This will also cascade delete all their marks!`)) {
      try {
        await api.delete(`/students/${id}`);
        setStudents(students.filter(s => String(s.id) !== String(id)));
        setFeedbackMessage({
          type: 'success',
          text: `Student "${name}" and all associated results deleted successfully!`
        });
        // Clear feedback after 3 seconds
        setTimeout(() => setFeedbackMessage(null), 3500);
      } catch (err) {
        console.error('Error deleting student:', err);
        setFeedbackMessage({
          type: 'danger',
          text: 'Failed to delete the student. Please try again.'
        });
        setTimeout(() => setFeedbackMessage(null), 3500);
      }
    }
  };

  // Client-side filtering by name or roll number
  const filteredStudents = students.filter(student => {
    const query = searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(query) ||
      student.rollNumber.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>Registered Students</h1>
        <Link to="/students/add" className="btn btn-primary">
          <UserPlus size={18} /> Add New Student
        </Link>
      </div>

      {feedbackMessage && (
        <div className={`alert alert-${feedbackMessage.type}`}>
          {feedbackMessage.text}
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Top Search Controls */}
      <div className="search-bar-container">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-control"
            placeholder="Search by Name or Roll Number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', fontWeight: 500 }}>
          Showing {filteredStudents.length} of {students.length} Students
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner-container">
          <div className="spinner"></div>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="empty-state">
          <AlertCircle size={40} className="empty-state-icon" />
          <h3>No Students Found</h3>
          <p>
            {searchQuery 
              ? `No student profiles match your search criteria "${searchQuery}".` 
              : 'The school records are currently empty. Get started by adding a student.'}
          </p>
          {!searchQuery && (
            <Link to="/students/add" className="btn btn-accent" style={{ marginTop: '1rem' }}>
              Add Your First Student
            </Link>
          )}
        </div>
      ) : (
        <div className="table-container">
          <table className="responsive-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll Number</th>
                <th>Class</th>
                <th>Section</th>
                <th>Gender</th>
                <th>Date Added</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{student.name}</td>
                  <td>{student.rollNumber}</td>
                  <td><span className="badge badge-primary">{student.class}</span></td>
                  <td><span className="badge badge-orange">{student.section}</span></td>
                  <td>{student.gender}</td>
                  <td>
                    {new Date(student.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <Link
                        to={`/students/${student.id}`}
                        className="btn btn-outline btn-sm"
                        title="View Details"
                        style={{ padding: '0.4rem' }}
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        to={`/students/edit/${student.id}`}
                        className="btn btn-outline btn-sm"
                        title="Edit Student"
                        style={{ padding: '0.4rem', color: 'var(--accent-color)' }}
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(student.id, student.name)}
                        className="btn btn-outline btn-sm"
                        title="Delete Student"
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

export default AllStudents;
