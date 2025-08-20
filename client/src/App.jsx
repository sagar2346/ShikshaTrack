import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';

// Page Imports
import Home from './pages/Home';
import AllStudents from './pages/AllStudents';
import AddStudent from './pages/AddStudent';
import StudentDetail from './pages/StudentDetail';
import AddResult from './pages/AddResult';
import ResultsTable from './pages/ResultsTable';
import GradeReport from './pages/GradeReport';
import EditStudent from './pages/EditStudent';
import EditResult from './pages/EditResult';
import SearchFilter from './pages/SearchFilter';

// Custom 404 Component
const NotFound = () => {
  return (
    <div className="empty-state" style={{ margin: '4rem auto', maxWidth: '600px' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>404</h2>
      <h3>Page Not Found</h3>
      <p>The page you are looking for does not exist or has been relocated.</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
        Return to Dashboard
      </Link>
    </div>
  );
};

// Import Link so that NotFound works correctly
import { Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Navigation Bar */}
        <Navbar />

        {/* Core Layout Content */}
        <main className="main-content">
          <Routes>
            {/* Page 1: Home landing page */}
            <Route path="/" element={<Home />} />

            {/* Page 2: All Students list */}
            <Route path="/students" element={<AllStudents />} />

            {/* Page 3: Add Student profile form */}
            <Route path="/students/add" element={<AddStudent />} />

            {/* Page 4: View Student details sheet */}
            <Route path="/students/:id" element={<StudentDetail />} />

            {/* Page 8: Edit Student profile form */}
            <Route path="/students/edit/:id" element={<EditStudent />} />

            {/* Page 6: Results list table */}
            <Route path="/results" element={<ResultsTable />} />

            {/* Page 5: Add Student results form */}
            <Route path="/results/add" element={<AddResult />} />

            {/* Page 9: Edit Student results entry */}
            <Route path="/results/edit/:id" element={<EditResult />} />

            {/* Page 7: Grade analytics metrics report */}
            <Route path="/reports" element={<GradeReport />} />

            {/* Page 10: Advanced multi-faceted Search and Filter */}
            <Route path="/search" element={<SearchFilter />} />

            {/* Redirection fallback/404 Page */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>

        {/* Premium footer */}
        <footer style={{
          backgroundColor: 'var(--card-bg)',
          borderTop: '1px solid var(--border-color)',
          padding: '1.5rem 0',
          textAlign: 'center',
          color: 'var(--text-light)',
          fontSize: '0.85rem',
          fontWeight: 500
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              &copy; {new Date().getFullYear()} <strong>ShikshaTrack</strong> result manager. All rights reserved.
            </div>
            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)' }}>
              <span>Built with React + Vite</span>
              <span>&bull;</span>
              <span>Express Server (In-Memory)</span>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
