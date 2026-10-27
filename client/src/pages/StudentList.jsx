import "./StudentList.css";
import Dropdown from "./Dropdown";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentList({ unitName, unitTitle }) {
    const navigate = useNavigate();

    const [students, setStudents] = useState([]);

    const [editingId, setEditingId] = useState(null);
    const [pendingDelete, setPendingDelete] = useState(null);
    const [error, setError] = useState("");


    const [studentDetails, setStudentDetails] = useState({
        ID: "",
        Name: "",
        Email: "",
        Major: "",
        CWA: 0.0
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
        setEditingId(student.StudentID);

        setStudentDetails({
            ID: student.StudentID, 
            Name: student.Name,
            Email: student.Email,
            Major: student.Major,
            CWA: student.CWA
        });
    };

    const handleRemove = (id) => {
        setEditingId(null);
        setPendingDelete(id);
    };

    const handleSave = async () => {
        try {
            const response = await fetch(
                `http://localhost:3000/studentManage/capstone/updatebyID/${studentDetails.ID}`,
                {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(studentDetails),
                }
            );

            const data = await response.text();
            if(!response.ok) {
                if (data.includes("{") && data.includes("error")) {
                    setError(JSON.parse(data).error);
                } else {
                    setError(data);
                }
            } else {
                setStudents(prevStudents =>
                    prevStudents.map(student =>
                        student.StudentID === editingId
                            ? {
                                ...student,
                                ...studentDetails
                            }
                            : student
                    )
                );

                setEditingId(null);
            }
        }
        catch (err) {
            setError(err);
        }
    };

    const confirmDelete = async (id) => {
        try {
            const response = await fetch(
                `http://localhost:3000/studentManage/capstone/delete/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }
            );

            const data = await response.text();
            if(!response.ok) {
                if (data.includes("{") && data.includes("error")) {
                    setError(JSON.parse(data).error);
                } else {
                    setError(data);
                }
            } else {
                setStudents(prevStudents =>
                    prevStudents.filter(student => student.StudentID !== id)
                );

                setPendingDelete(null);
            }
        }
        catch (err) {
            setError(err);
        }
    };

    useEffect(() => {
        const fetchStudents = async () => {
            let requestString = "http://localhost:3000/UC/api/requestAllCapstoneStudents";
            if (unitName.toUpperCase() === "ICTE3002") {
                requestString = "http://localhost:3000/UC/api/requestAllHCIStudents";
            }

            try {
                const response = await fetch(
                    requestString,
                    {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                    }
                );

                const data = await response.json();
                if(!response.ok) {
                    throw new Error(data.message);
                }
                
                setStudents(data);
            }
            catch (err) {
                console.error("Unable to get students: ", err);
            }
        };

        fetchStudents();
    }, []);

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

                    <div className="form-box2">

                        {students.map((student) => {

                            const isEditing = editingId === student.StudentID;
                            const isDeleting = pendingDelete === student.StudentID;

                            return (
                                <div>
                                <div key={student.StudentID} className="student-card">

                                    {isEditing ? (

                                        <div className="form-section">
                                            <label> Name
                                                <input
                                                    type="text"
                                                    name="Name"
                                                    value={studentDetails.Name}
                                                    onChange={inputChanges}
                                                />
                                            </label>

                                            <label> Email
                                                <input
                                                    type="email"
                                                    name="Email"
                                                    value={studentDetails.Email}
                                                    onChange={inputChanges}
                                                />                                 
                                            </label>

                                            <label> Major
                                                <input
                                                    type="text"
                                                    name="Major"
                                                    value={studentDetails.Major}
                                                    onChange={inputChanges}
                                                />
                                            </label>

                                            <label> CWA
                                                <input
                                                    type="number"
                                                    name="CWA"
                                                    value={studentDetails.CWA}
                                                    onChange={inputChanges}
                                                />
                                            </label>

                                            <div className="student-detail-buttons">
                                                <button
                                                    onClick={handleSave}
                                                    title="Save student"
                                                    className="edit-student-btn"
                                                >
                                                    Save
                                                </button>

                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    title="Cancel Editing"
                                                    className="cancel-edit-btn"
                                                >
                                                    Cancel
                                                </button>
                                            </div>

                                            {error && (
                                                <div className="error-msg-div">
                                                    <p>{error}</p>
                                                </div>)}
                                        </div>

                                    ) : isDeleting ? (

                                        <div className="delete-container">

                                            <div className="confirm-delete-container">

                                                <p>
                                                    Are you sure you want to remove
                                                </p>

                                                <p>
                                                    <strong>{student.Name}</strong>?
                                                </p>

                                                <div className="confirm-delete-buttons">
                                                    <button
                                                        onClick={() => setPendingDelete(null)}
                                                        className="cancel-delete-btn"
                                                    >
                                                        Cancel
                                                    </button>

                                                    <button
                                                        onClick={() => confirmDelete(student.StudentID)}
                                                        className="confirm-delete-btn"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>

                                                {error && (
                                                <div className="error-msg-div">
                                                    <p>{error}</p>
                                                </div>)}
                                            </div>

                                        </div>

                                    ) : (

                                        <div className="form-section">

                                            <div className="student-detail-text">
                                                <p><b>Name: </b>{student.Name}</p>
                                                <p><b>Email: </b>{student.Email}</p>  
                                                <p><b>Major: </b>{student.Major}</p>           
                                                <p><b>CWA: </b>{student.CWA}</p>
                                            </div>

                                            <div className="student-detail-buttons">

                                                <button
                                                    onClick={() => handleEdit(student)}
                                                    title="Edit student"
                                                    className="edit-student-btn"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => handleRemove(student.StudentID)}
                                                    title="Remove student"
                                                    className="delete-student-btn"
                                                >
                                                    Remove
                                                </button>

                                            </div>

                                        </div>

                                    )}

                                </div>
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