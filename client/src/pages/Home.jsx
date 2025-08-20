import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileSpreadsheet, CheckCircle2, XCircle, PlusCircle, Search, BarChart3, Award, BookOpen } from 'lucide-react';
import api from '../api';

const Home = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalResults: 0,
    passCount: 0,
    failCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/stats');
        setStats(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to connect to the backend server. Please make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const actionCards = [
    {
      title: 'Register Student',
      description: 'Add a new student profile with name, roll number, class, and section.',
      link: '/students/add',
      btnText: 'Add Student',
      icon: <PlusCircle size={24} />,
      color: 'var(--primary-color)'
    },
    {
      title: 'Enter Results',
      description: 'Input marks for a student and let the system auto-calculate grades.',
      link: '/results/add',
      btnText: 'Add Result',
      icon: <Award size={24} />,
      color: 'var(--accent-color)'
    },
    {
      title: 'Grade Analytics',
      description: 'Analyze subject averages, view top scorers, and trace overall performance.',
      link: '/reports',
      btnText: 'View Reports',
      icon: <BarChart3 size={24} />,
      color: 'var(--success-color)'
    },
  ];

  return (
    <div>
      {/* Intro Banner */}
      <div className="banner">
        <h1>Welcome to ShikshaTrack</h1>
        <p>
          A minimal, professional Student Result Management system. Seamlessly register students, 
          record subject marks, auto-calculate letter grades, and review student progress reports in real-time.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/search" className="btn btn-accent">
            <Search size={18} /> Search Students
          </Link>
          <Link to="/students" className="btn btn-outline" style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.4)' }}>
            View All Students
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          <strong>Connection Error:</strong> {error}
        </div>
      )}

      {/* Stats Cards Section */}
      <h2 style={{ marginBottom: '1.5rem' }}>Dashboard Overview</h2>
      {loading ? (
        <div className="loading-spinner-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="grid-layout">
          <div className="stat-card">
            <div className="stat-icon" style={{ color: 'var(--primary-color)' }}>
              <Users size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.totalStudents}</span>
              <span className="stat-label">Total Students</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ color: 'var(--accent-color)' }}>
              <FileSpreadsheet size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.totalResults}</span>
              <span className="stat-label">Total Results</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ color: 'var(--success-color)' }}>
              <CheckCircle2 size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.passCount}</span>
              <span className="stat-label">Passed Marks</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ color: 'var(--error-color)' }}>
              <XCircle size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.failCount}</span>
              <span className="stat-label">Failed Marks</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Pathways */}
      <h2 style={{ marginBottom: '1.5rem', marginTop: '3rem' }}>Quick Actions</h2>
      <div className="grid-layout" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        {actionCards.map((card, idx) => (
          <div key={idx} className="report-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ color: card.color }}>{card.icon}</div>
                <h3 style={{ margin: 0 }}>{card.title}</h3>
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>{card.description}</p>
            </div>
            <Link to={card.link} className={`btn ${idx === 1 ? 'btn-accent' : 'btn-primary'}`} style={{ width: '100%' }}>
              {card.btnText}
            </Link>
          </div>
        ))}
      </div>

      {/* Grading System Reference */}
      <h2 style={{ marginBottom: '1.5rem', marginTop: '3rem' }}>Grading Reference Scheme</h2>
      <div className="table-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <table className="responsive-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Marks Range</th>
              <th>Letter Grade</th>
              <th>Pass / Fail Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>90 - 100</td>
              <td><span className="badge badge-success">A+</span></td>
              <td><span className="badge badge-success">Pass</span></td>
            </tr>
            <tr>
              <td>80 - 89</td>
              <td><span className="badge badge-success">A</span></td>
              <td><span className="badge badge-success">Pass</span></td>
            </tr>
            <tr>
              <td>70 - 79</td>
              <td><span className="badge badge-primary">B+</span></td>
              <td><span className="badge badge-success">Pass</span></td>
            </tr>
            <tr>
              <td>60 - 69</td>
              <td><span className="badge badge-primary">B</span></td>
              <td><span className="badge badge-success">Pass</span></td>
            </tr>
            <tr>
              <td>50 - 59</td>
              <td><span className="badge badge-orange">C</span></td>
              <td><span className="badge badge-success">Pass</span></td>
            </tr>
            <tr>
              <td>40 - 49</td>
              <td><span className="badge badge-orange">D</span></td>
              <td><span className="badge badge-success">Pass</span></td>
            </tr>
            <tr>
              <td>Below 40</td>
              <td><span className="badge badge-danger">F</span></td>
              <td><span className="badge badge-danger">Fail</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
