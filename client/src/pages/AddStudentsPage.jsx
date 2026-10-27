import "./StudentList.css";
import Dropdown from "./Dropdown";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddStudentsComponent from "./AddStudentsComponent";

function AddStudentsPage({ unitName, unitTitle }) {
    const navigate = useNavigate();

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
                    <p>Add Student List</p>
                </section>

                <div className="studentlist-box">

                    <div className="studentlist-header">

                        <h2>Add Student List</h2>

                        <button
                            className="add-student-btn"
                            onClick={() => {
                                navigate(`/ucdashboard/${unitName.toLowerCase()}`);
                            }}
                        >
                            View Students
                        </button>

                        <button
                            className="add-student-btn"
                            onClick={() => {
                                navigate(`/ucdashboard/${unitName.toLowerCase()}/addstudent`);
                            }}
                        >
                            + Add Student (Manual)
                        </button>

                    </div>

                    <AddStudentsComponent unitName = {unitName} />
                </div>

            </main>

        </div>
    );
}

export default AddStudentsPage;