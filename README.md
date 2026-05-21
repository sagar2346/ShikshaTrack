# ShikshaTrack

ShikshaTrack is a clean, modern, and professional **Student Result Management Web Application** designed on the **MERN** stack but built **without a database** (utilizing an in-memory Express data storage mechanism). It features a beautiful, responsive user interface styled with vanilla CSS variables and imports Google Fonts (Poppins & Inter).

---

## Active Development Servers

- **Express REST API Backend**: Served on [http://localhost:5000](http://localhost:5000)
- **Vite React Frontend SPA**: Served on [http://localhost:5173](http://localhost:5173)

---

Features Summary

- **In-Memory Storage Registry**: Store, update, and manage student records and subject grades in Express plain JavaScript arrays. Data resets on server restart.
- **Auto-Calculating Letter Grades**: Live calculation preview as you type numerical marks (0-100) based on the grading system (A+, A, B+, B, C, D, F).
- **Responsive Navbar & Design**: Designed with custom colors: Deep Blue (`#1E3A5F`), Accent Orange (`#F97316`), Dark Gray (`#1F2937`), and Light Gray (`#F9FAFB`). Equipped with full mobile sidebar navigations.
- **Comprehensive Grade Reports**: Analytics panels computing passing percentages, high performers ranking (**Top 5 Scorers**), and visual progress bars showing averages for **Mathematics, Science, English, History, and Computer Science**.
- **Multi-Dimensional Advanced Search**: Filter student cards simultaneously across name, roll number, class, section, and gender.
- **Robust CRUD**: Complete creation, reading, updates, and cascading deletions (deleting a student profile automatically cascades to delete all their marks).

---

Project Architecture

```
/ShikshaTrack
├── /server                 # Express backend server
│   ├── .env                # Port configuration
│   ├── package.json        # Server scripts & dependencies
│   └── server.js           # Server routes & mock in-memory data
└── /client                 # React Vite frontend application
    ├── index.html          # Main HTML document title & entries
    ├── package.json        # Client dependencies & scripts
    └── src
        ├── api.js          # Axios configuration middleware
        ├── App.jsx         # React Router v6 pages registrar
        ├── index.css       # Styling sheet & layout system
        ├── main.jsx        # Mounting registry
        ├── /components
        │   └── Navbar.jsx  # Interactive logo header with toggle
        └── /pages
            ├── Home.jsx           # Landing stats dashboard
            ├── AllStudents.jsx    # Students list & search registry
            ├── AddStudent.jsx     # Student registration form
            ├── StudentDetail.jsx  # Profile cards & subject marks sheet
            ├── AddResult.jsx      # Input grades with live calculator
            ├── ResultsTable.jsx   # Master spreadsheet table with filters
            ├── GradeReport.jsx    # Analytics dashboard
            ├── EditStudent.jsx    # Modify profile form
            ├── EditResult.jsx     # Modify marks form
            └── SearchFilter.jsx   # Advanced multi-filter cards page
```

---

## Seeding Mock Data

To enable immediate testing of analytics cards, charts, and table lists, the in-memory arrays come pre-seeded with **6 authentic Nepali student profiles** and **18 subject results**:
- **Ram Prasad Devkota** (Roll: 101, Class: 10th, Sec: A)
- **Sita Kumari Thapa** (Roll: 102, Class: 10th, Sec: B)
- **Hari Bahadur Shrestha** (Roll: 201, Class: 11th, Sec: A)
- **Gita Devi Adhikari** (Roll: 202, Class: 11th, Sec: B)
- **Ramesh Kumar Karki** (Roll: 301, Class: 12th, Sec: A)
- **Pooja Sharma** (Roll: 302, Class: 12th, Sec: A)

---

## 🛠️ Startup Instructions

### 1. Launch the Backend
```bash
cd server
npm install
npm start
```

### 2. Launch the Frontend
```bash
cd client
npm install
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.
