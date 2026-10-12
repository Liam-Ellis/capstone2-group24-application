import "./StudentList.css";
import Dropdown from "./Dropdown";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentList({ unitName, unitTitle, students: initialStudents }) {
    const navigate = useNavigate();

    const [students, setStudents] = useState(initialStudents);

    const [editingId, setEditingId] = useState(null);
    const [pendingDelete, setPendingDelete] = useState(null);

    const [studentDetails, setStudentDetails] = useState({
        name: "",
        email: "",
        course: "",
        cwa: ""
    });

    const sidebar = [
        {
            name: "Units",
            path: "/ucdashboard"
        },
        {
            name: "Rounds",
            path: "/ucdashboard/rounds"
        },
        {
            name: "Group Allocation",
            path: "/ucdashboard/groups"
        }
    ];

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
        setStudents(prevStudents =>
            prevStudents.filter(student => student.id !== id)
        );

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
                            unitName={unitName}
                            items={[
                                /*{
                                    name: "Announcements",
                                    path: `/ucdashboard/${unitName}/announcements`
                                },*/
                                {
                                    name: "Student List",
                                    path: `/ucdashboard/${unitName}`
                                }
                            ]}
                        />
                    </ul>
                </nav>
            </aside>


            {/* Main Content */}
            <main className="main-content">

                <section className="unit-name">
                    <h1>{unitTitle} | {unitName}</h1>
                    <p>Student List</p>
                </section>

                <div className="studentlist-box">

                    <div className="studentlist-header">

                        <h2>Student Details</h2>

                        <button
                            className="add-student-btn"
                            onClick={() => {
                                navigate(`/ucdashboard/${unitName.toLowerCase()}/addstudent`);
                            }}
                        >
                            + Add Student (Manual)
                        </button>

                        <button
                            className="add-student-btn"
                            onClick={() => {
                                navigate(`/ucdashboard/${unitName.toLowerCase()}/addstudents`);
                            }}
                        >
                            + Add Students (CSV)
                        </button>

                    </div>

                    <div className="form-box">

                        {students.map((student) => {

                            const isEditing = editingId === student.id;
                            const isDeleting = pendingDelete === student.id;

                            return (
                                <div key={student.id} className="student">

                                    {isEditing ? (

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
                                                value={studentDetails.email}
                                                onChange={inputChanges}
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

                                            <button
                                                onClick={handleSave}
                                                title="Save student"
                                            >
                                                Save
                                            </button>

                                            <button
                                                onClick={() => setEditingId(null)}
                                                title="Cancel Editing"
                                            >
                                                Cancel
                                            </button>

                                        </div>

                                    ) : isDeleting ? (

                                        <div className="delete-container">

                                            <div className="confirm-delete-container">

                                                <p>
                                                    Are you sure you want to remove{" "}
                                                    <strong>{student.name}</strong>?
                                                </p>

                                                <button
                                                    onClick={() => setPendingDelete(null)}
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    onClick={() => confirmDelete(student.id)}
                                                >
                                                    Remove
                                                </button>

                                            </div>

                                        </div>

                                    ) : (

                                        <div className="student-details">

                                            <div className="student-detail-text">

                                                <h4>{student.name}</h4>
                                                <h4>{student.email}</h4>
                                                <h4>{student.course}</h4>
                                                <h4>CWA: {student.cwa}</h4>

                                            </div>

                                            <div>

                                                <button
                                                    onClick={() => handleEdit(student)}
                                                    title="Edit student"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => handleRemove(student.id)}
                                                    title="Remove student"
                                                >
                                                    Remove
                                                </button>

                                            </div>

                                        </div>

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