import "./StudentList.css";
import logo from "./logo.webp";
import Dropdown from "./Dropdown";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentList() {
  const navigate = useNavigate();

  const sidebar = [
    {
      name: "Institution Page",
      path: "/ucdashboard/institution"
    },
    {
      name: "Units",
      path: "/ucdashboard"
    },
    {
      name: "Settings",
      path: "/ucdashboard/settings"
    }
  ];

  const [student, setStudents] = useState([
        {
            id: 1, 
            name: "Josiah Barnes",
            email: "josiah@student.curtin.edu.au",
            course: "Software Engineering",
            cwa: 68.6
        },
        {
            id: 2, 
            name: "Noel Kapadia",
            email: "noel@student.curtin.edu.au",
            course: "Information Technology",
            cwa: 61.2
        },
        {
            id: 3, 
            name: "Amelia Koh",
            email: "amelia@student.curtin.edu.au",
            course: "Computer Science",
            cwa: 61.2
        }
    ]);

    const [editingId, setEditingId] = useState(null);
    const [pendingDelete, setPendingDelete] = useState(null);  

    const [studentDetails, setStudentDetails] = useState({
        name: "",
        email: "",
        course: "",
        cwa: ""
    });

    const inputChanges = (e) => {
        const { name, value } = e.target;

        setStudentDetails(prevDetails => ({
            ...prevDetails, 
            [name]: value
        }));
    };

    const handleEdit = (student) => {
        setPendingDelete(null);
        setEditingId(student.id);

        setStudentDetails({
            name: student.name,
            email: student.email,
            course: student.course,
            cwa: student.cwa
        });
    };

    const handleRemove = (id) => {
        setEditingId(null);
        setPendingDelete(id);
    };

    const handleSave = () => {
        setStudents(prevStudents => 
            prevStudents.map(student => 
                student.id === editingId
                    ? {
                        ...student,
                        ...studentDetails
                    }
                    : student
            )
        );
        setEditingId(null);
    };

    const confirmDelete = (id) => {
        setStudents((prevStudents) => 
            prevStudents.filter(student => student.id !== id));
        setPendingDelete(null);
    };

  return (
    <div className="isad3000-container">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2>UC Dashboard</h2>

        <nav>
          <ul>
            {sidebar.map((item) => (
              <li
                key={item.name}
                onClick={() => navigate(item.path)}
              >
                {item.name}
              </li>
            ))}

            <Dropdown
                          unitName="ISAD3000"
                          items={[
                            {
                              name: "Announcements",
                              path: "/ucdashboard/isad3000/announcements"
                            },
                            {
                              name: "Student List",
                              path: "/ucdashboard/isad3000/students"
                            },
                            {
                              name: "Group Allocation",
                              path: "/ucdashboard/isad3000/groups"
                            },
                          ]}
            />
          </ul>
        </nav>
      </aside>

      {/* Logo */}
      <img
        src={logo}
        alt="Logo"
        className="top-logo"
      />

      {/* Main Content */}
      <main className="main-content">

        <section className="unit-name">
          <h1>Capstone Project 1 | ISAD3000</h1>
          <p>Student List and Group Allocation</p>
        </section>

        <div className="studentlist-box">

          <div className="studentlist-header">

            <h2>Student Details</h2>

            <button
              className="add-student-btn"
              onClick={() => {
                navigate("/ucdashboard/isad3000/addstudent");
              }}
            >
              + Add Student (Manual)
            </button>

            <button
              className="add-student-btn"
              onClick={() => {
                navigate("/ucdashboard/isad3000/addstudents");
              }}
            >
              + Add Students (CSV)
            </button>
          </div>

          <div className="form-box">
                {student.map((student) => {
                    const isEditing = editingId === student.id;
                    const isDeleting = pendingDelete === student.id;
    
                    return (
                        <div key={student.id} className="student">
                            {isEditing ? (
                                <>
                                    <div className="edit-container">

                                    <input 
                                        type="text"
                                        name="name"
                                        value={studentDetails.name}
                                        onChange={inputChanges}
                                    />
                                    <input 
                                        type="email"
                                        name="email"
                                        value={studentDetails.email}                                            onChange={inputChanges}
                                    />
                                    <input 
                                        type="text"
                                        name="course"
                                        value={studentDetails.course}
                                        onChange={inputChanges}
                                    />
                                    <input 
                                        type="number"
                                        name="cwa"
                                        value={studentDetails.cwa}
                                        onChange={inputChanges}
                                    />
                                    
                                    <button onClick={handleSave}
                                        title="Save student">
                                        Save
                                    </button>

                                    <button onClick={() => setEditingId(null)}
                                        title="Cancel Editing">
                                        Cancel
                                    </button>
                                </div> 
                            </>
                        ) : isDeleting ? (
                            <>
                                <div className="delete-container">
                                    <div className="confirm-delete-container">
                                        <p>
                                            Are you sure you want to remove{" "}
                                            <strong>{student.name}</strong>?
                                        </p>

                                        <button onClick={() => setPendingDelete(null)}
                                        >
                                            Cancel
                                        </button>

                                        <button onClick={() => confirmDelete(student.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="student-details">
                                    <div className="student-detail-text">
                                    <h4>{student.name}</h4>
                                    <h4>{student.email}</h4>
                                    <h4>{student.course}</h4>
                                    <h4>CWA: {student.cwa}</h4>
                                    </div>
                                    <div>
                                    <button onClick={() => handleEdit(student)}
                                        title="Edit student">
                                        Edit
                                    </button>
                                    <button onClick={() => handleRemove(student.id)}
                                        title="Remove student">
                                        Remove
                                    </button>
                                    </div>
                                </div>
                            </>
                        )}

                        </div>

                    );
                })}
                </div>
        </div>

      </main>

    </div>
  );
}

export default StudentList;