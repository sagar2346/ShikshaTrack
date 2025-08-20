const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS & JSON Parsing
app.use(cors());
app.use(express.json());

// In-Memory Data Store (Plain JS Arrays)
let students = [
  {
    id: "1716223200001",
    name: "Ram Prasad Devkota",
    rollNumber: "101",
    class: "10th",
    section: "A",
    gender: "Male",
    createdAt: new Date("2026-01-15T09:00:00.000Z").toISOString()
  },
  {
    id: "1716223200002",
    name: "Sita Kumari Thapa",
    rollNumber: "102",
    class: "10th",
    section: "B",
    gender: "Female",
    createdAt: new Date("2026-01-16T10:30:00.000Z").toISOString()
  },
  {
    id: "1716223200003",
    name: "Hari Bahadur Shrestha",
    rollNumber: "201",
    class: "11th",
    section: "A",
    gender: "Male",
    createdAt: new Date("2026-01-18T14:15:00.000Z").toISOString()
  },
  {
    id: "1716223200004",
    name: "Gita Devi Adhikari",
    rollNumber: "202",
    class: "11th",
    section: "B",
    gender: "Female",
    createdAt: new Date("2026-01-20T11:00:00.000Z").toISOString()
  },
  {
    id: "1716223200005",
    name: "Ramesh Kumar Karki",
    rollNumber: "301",
    class: "12th",
    section: "A",
    gender: "Male",
    createdAt: new Date("2026-01-22T08:45:00.000Z").toISOString()
  },
  {
    id: "1716223200006",
    name: "Pooja Sharma",
    rollNumber: "302",
    class: "12th",
    section: "A",
    gender: "Female",
    createdAt: new Date("2026-01-23T15:20:00.000Z").toISOString()
  }
];

let results = [
  // John Doe
  {
    id: "1716224200001",
    studentId: "1716223200001",
    subject: "Mathematics",
    marks: 85,
    grade: "A",
    status: "Pass",
    createdAt: new Date("2026-02-10T10:00:00.000Z").toISOString()
  },
  {
    id: "1716224200002",
    studentId: "1716223200001",
    subject: "Science",
    marks: 92,
    grade: "A+",
    status: "Pass",
    createdAt: new Date("2026-02-11T10:00:00.000Z").toISOString()
  },
  {
    id: "1716224200003",
    studentId: "1716223200001",
    subject: "English",
    marks: 78,
    grade: "B+",
    status: "Pass",
    createdAt: new Date("2026-02-12T10:00:00.000Z").toISOString()
  },

  // Jane Smith
  {
    id: "1716224200004",
    studentId: "1716223200002",
    subject: "Mathematics",
    marks: 45,
    grade: "D",
    status: "Pass",
    createdAt: new Date("2026-02-10T10:00:00.000Z").toISOString()
  },
  {
    id: "1716224200005",
    studentId: "1716223200002",
    subject: "Science",
    marks: 38,
    grade: "F",
    status: "Fail",
    createdAt: new Date("2026-02-11T10:00:00.000Z").toISOString()
  },
  {
    id: "1716224200006",
    studentId: "1716223200002",
    subject: "English",
    marks: 65,
    grade: "B",
    status: "Pass",
    createdAt: new Date("2026-02-12T10:00:00.000Z").toISOString()
  },

  // Alex Carter
  {
    id: "1716224200007",
    studentId: "1716223200003",
    subject: "Mathematics",
    marks: 95,
    grade: "A+",
    status: "Pass",
    createdAt: new Date("2026-02-10T10:00:00.000Z").toISOString()
  },
  {
    id: "1716224200008",
    studentId: "1716223200003",
    subject: "Science",
    marks: 88,
    grade: "A",
    status: "Pass",
    createdAt: new Date("2026-02-11T10:00:00.000Z").toISOString()
  },
  {
    id: "1716224200009",
    studentId: "1716223200003",
    subject: "Computer Science",
    marks: 99,
    grade: "A+",
    status: "Pass",
    createdAt: new Date("2026-02-13T10:00:00.000Z").toISOString()
  },

  // Emily Davis
  {
    id: "1716224200010",
    studentId: "1716223200004",
    subject: "Mathematics",
    marks: 70,
    grade: "B+",
    status: "Pass",
    createdAt: new Date("2026-02-10T10:00:00.000Z").toISOString()
  },
  {
    id: "1716224200011",
    studentId: "1716223200004",
    subject: "Science",
    marks: 75,
    grade: "B+",
    status: "Pass",
    createdAt: new Date("2026-02-11T10:00:00.000Z").toISOString()
  },
  {
    id: "1716224200012",
    studentId: "1716223200004",
    subject: "English",
    marks: 82,
    grade: "A",
    status: "Pass",
    createdAt: new Date("2026-02-12T10:00:00.000Z").toISOString()
  },

  // Michael Brown
  {
    id: "1716224200013",
    studentId: "1716223200005",
    subject: "Mathematics",
    marks: 58,
    grade: "C",
    status: "Pass",
    createdAt: new Date("2026-02-10T10:00:00.000Z").toISOString()
  },
  {
    id: "1716224200014",
    studentId: "1716223200005",
    subject: "Science",
    marks: 60,
    grade: "B",
    status: "Pass",
    createdAt: new Date("2026-02-11T10:00:00.000Z").toISOString()
  },
  {
    id: "1716224200015",
    studentId: "1716223200005",
    subject: "History",
    marks: 52,
    grade: "C",
    status: "Pass",
    createdAt: new Date("2026-02-14T10:00:00.000Z").toISOString()
  },

  // Sarah Wilson
  {
    id: "1716224200016",
    studentId: "1716223200006",
    subject: "Mathematics",
    marks: 30,
    grade: "F",
    status: "Fail",
    createdAt: new Date("2026-02-10T10:00:00.000Z").toISOString()
  },
  {
    id: "1716224200017",
    studentId: "1716223200006",
    subject: "Science",
    marks: 42,
    grade: "D",
    status: "Pass",
    createdAt: new Date("2026-02-11T10:00:00.000Z").toISOString()
  },
  {
    id: "1716224200018",
    studentId: "1716223200006",
    subject: "History",
    marks: 35,
    grade: "F",
    status: "Fail",
    createdAt: new Date("2026-02-14T10:00:00.000Z").toISOString()
  }
];

// Grade & Status Calculator Helper
function calculateGradeAndStatus(marksInput) {
  const marks = Number(marksInput);
  let grade = 'F';
  if (marks >= 90) grade = 'A+';
  else if (marks >= 80) grade = 'A';
  else if (marks >= 70) grade = 'B+';
  else if (marks >= 60) grade = 'B';
  else if (marks >= 50) grade = 'C';
  else if (marks >= 40) grade = 'D';
  else grade = 'F';

  const status = marks >= 40 ? 'Pass' : 'Fail';
  return { grade, status };
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. STATS ROUTE
// GET /api/stats -> return total students, total results, pass count, fail count
app.get('/api/stats', (req, res) => {
  const totalStudents = students.length;
  const totalResults = results.length;
  const passCount = results.filter(r => r.status === 'Pass').length;
  const failCount = results.filter(r => r.status === 'Fail').length;

  res.json({
    totalStudents,
    totalResults,
    passCount,
    failCount
  });
});

// 2. STUDENT ROUTES

// GET /api/students -> get all students
app.get('/api/students', (req, res) => {
  res.json(students);
});

// GET /api/students/:id -> get single student
app.get('/api/students/:id', (req, res) => {
  const student = students.find(s => String(s.id) === String(req.params.id));
  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }
  res.json(student);
});

// POST /api/students -> add new student
app.post('/api/students', (req, res) => {
  const { name, rollNumber, class: className, section, gender } = req.body;

  if (!name || !rollNumber || !className || !section || !gender) {
    return res.status(400).json({ message: 'All student fields are required' });
  }

  // Roll Number Validation (check duplicate roll number in same class)
  const isDuplicate = students.some(
    s => s.rollNumber.toLowerCase() === rollNumber.toLowerCase() && s.class.toLowerCase() === className.toLowerCase()
  );

  if (isDuplicate) {
    return res.status(400).json({ message: `Roll number ${rollNumber} already exists in ${className}` });
  }

  const newStudent = {
    id: String(Date.now()),
    name,
    rollNumber,
    class: className,
    section,
    gender,
    createdAt: new Date().toISOString()
  };

  students.push(newStudent);
  res.status(201).json(newStudent);
});

// PUT /api/students/:id -> update student
app.put('/api/students/:id', (req, res) => {
  const studentIndex = students.findIndex(s => String(s.id) === String(req.params.id));
  if (studentIndex === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const { name, rollNumber, class: className, section, gender } = req.body;

  if (!name || !rollNumber || !className || !section || !gender) {
    return res.status(400).json({ message: 'All student fields are required' });
  }

  // Check duplicate roll number for other students in same class
  const isDuplicate = students.some(
    s => String(s.id) !== String(req.params.id) &&
         s.rollNumber.toLowerCase() === rollNumber.toLowerCase() &&
         s.class.toLowerCase() === className.toLowerCase()
  );

  if (isDuplicate) {
    return res.status(400).json({ message: `Roll number ${rollNumber} already exists in ${className}` });
  }

  students[studentIndex] = {
    ...students[studentIndex],
    name,
    rollNumber,
    class: className,
    section,
    gender
  };

  res.json(students[studentIndex]);
});

// DELETE /api/students/:id -> delete student and cascade delete results
app.delete('/api/students/:id', (req, res) => {
  const studentIndex = students.findIndex(s => String(s.id) === String(req.params.id));
  if (studentIndex === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }

  // Remove student
  students.splice(studentIndex, 1);

  // Cascade delete results
  results = results.filter(r => String(r.studentId) !== String(req.params.id));

  res.json({ message: 'Student and associated results deleted successfully' });
});

// 3. RESULT ROUTES

// GET /api/results -> get all results with student details joined
app.get('/api/results', (req, res) => {
  const populatedResults = results.map(r => {
    const student = students.find(s => String(s.id) === String(r.studentId));
    return {
      ...r,
      studentName: student ? student.name : 'Unknown Student',
      rollNumber: student ? student.rollNumber : 'N/A',
      class: student ? student.class : 'N/A',
      section: student ? student.section : 'N/A'
    };
  });
  res.json(populatedResults);
});

// GET /api/results/student/:id -> get results for specific student
app.get('/api/results/student/:id', (req, res) => {
  const studentResults = results.filter(r => String(r.studentId) === String(req.params.id));
  res.json(studentResults);
});

// POST /api/results -> add new result
app.post('/api/results', (req, res) => {
  const { studentId, subject, marks } = req.body;

  if (!studentId || !subject || marks === undefined) {
    return res.status(400).json({ message: 'studentId, subject, and marks are required' });
  }

  const studentExists = students.some(s => String(s.id) === String(studentId));
  if (!studentExists) {
    return res.status(404).json({ message: 'Student not found' });
  }

  // Check if subject result already exists for this student
  const subjectExists = results.some(
    r => String(r.studentId) === String(studentId) && r.subject.toLowerCase() === subject.toLowerCase()
  );
  if (subjectExists) {
    return res.status(400).json({ message: `Result for ${subject} already exists for this student` });
  }

  const { grade, status } = calculateGradeAndStatus(marks);

  const newResult = {
    id: String(Date.now()),
    studentId,
    subject,
    marks: Number(marks),
    grade,
    status,
    createdAt: new Date().toISOString()
  };

  results.push(newResult);
  res.status(201).json(newResult);
});

// PUT /api/results/:id -> update result
app.put('/api/results/:id', (req, res) => {
  const resultIndex = results.findIndex(r => String(r.id) === String(req.params.id));
  if (resultIndex === -1) {
    return res.status(404).json({ message: 'Result not found' });
  }

  const { subject, marks, studentId } = req.body;

  if (!subject || marks === undefined || !studentId) {
    return res.status(400).json({ message: 'studentId, subject, and marks are required' });
  }

  // Check duplicate subject result for other entries of this student
  const duplicateSubject = results.some(
    r => String(r.id) !== String(req.params.id) &&
         String(r.studentId) === String(studentId) &&
         r.subject.toLowerCase() === subject.toLowerCase()
  );
  if (duplicateSubject) {
    return res.status(400).json({ message: `Result for ${subject} already exists for this student` });
  }

  const { grade, status } = calculateGradeAndStatus(marks);

  results[resultIndex] = {
    ...results[resultIndex],
    studentId,
    subject,
    marks: Number(marks),
    grade,
    status
  };

  res.json(results[resultIndex]);
});

// DELETE /api/results/:id -> delete result
app.delete('/api/results/:id', (req, res) => {
  const resultIndex = results.findIndex(r => String(r.id) === String(req.params.id));
  if (resultIndex === -1) {
    return res.status(404).json({ message: 'Result not found' });
  }

  results.splice(resultIndex, 1);
  res.json({ message: 'Result deleted successfully' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
