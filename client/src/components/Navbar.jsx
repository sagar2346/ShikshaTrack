import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { GraduationCap, Users, PlusCircle, FileSpreadsheet, PlusSquare, BarChart3, Search, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Home', icon: <GraduationCap size={18} /> },
    { path: '/students', label: 'Students', icon: <Users size={18} /> },
    { path: '/students/add', label: 'Add Student', icon: <PlusCircle size={18} /> },
    { path: '/results', label: 'Results', icon: <FileSpreadsheet size={18} /> },
    { path: '/results/add', label: 'Add Result', icon: <PlusSquare size={18} /> },
    { path: '/reports', label: 'Grade Report', icon: <BarChart3 size={18} /> },
    { path: '/search', label: 'Search & Filter', icon: <Search size={18} /> },
  ];

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand" onClick={closeMenu}>
          <GraduationCap size={32} strokeWidth={2.5} />
          Shiksha<span>Track</span>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="navbar-links">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? 'navbar-link active' : 'navbar-link'
              }
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile Toggle button */}
        <button className="navbar-mobile-toggle" onClick={toggleMenu} aria-label="Toggle navigation menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation Dropdown */}
        {isOpen && (
          <nav className="navbar-links mobile-open">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive ? 'navbar-link active' : 'navbar-link'
                }
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%', padding: '0.75rem 1rem' }}
                onClick={closeMenu}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
