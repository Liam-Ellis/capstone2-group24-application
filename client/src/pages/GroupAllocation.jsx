import { useState } from "react";
import "./GroupAllocation.css";
import Sidebar from "./Sidebar";

const initialStudents = [
    {
        id: "21433273",
        firstName: "Jeffrey",
        familyName: "Hale",
        cwa: 67.905,
        major: "Computer Science"
    },
    {
        id: "21425286",
        firstName: "Santiago",
        familyName: "Rice",
        cwa: 65.579,
        major: "Software Engineering"
    },
    {
        id: "21983473",
        firstName: "Sondra",
        familyName: "Esparza",
        cwa: 72.625,
        major: "Cyber Security"
    },
    {
        id: "21093723",
        firstName: "Coleen",
        familyName: "Park",
        cwa: 66.867,
        major: "Information Technology"
    },
    {
        id: "21493023",
        firstName: "Carla",
        familyName: "Lutz",
        cwa: 86.208,
        major: "Information Technology"
    },
    {
        id: "19883023",
        firstName: "Cory",
        familyName: "Hall",
        cwa: 59.294,
        major: "Software Engineering"
    },
    {
        id: "19799999",
        firstName: "Beverly",
        familyName: "Ellis",
        cwa: 75.714,
        major: "Information Technology"
    },
    {
        id: "19789783",
        firstName: "Lawrence",
        familyName: "Watts",
        cwa: 50.3,
        major: "Cyber Security"
    }
];

const majors = [
    "Computer Science",
    "Software Engineering",
    "Cyber Security",
    "Information Technology"
];



function GroupAllocation() {
    const [students] = useState(initialStudents);
    const [groups, setGroups] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [majorFilter, setMajorFilter] = useState("All");
    
    const [allocationFilter, setAllocationFilter] = useState("unallocated");


    const allocatedStudentIds = groups.flatMap((group) =>
        group.students.map((student) => student.id)
    );

    const filteredStudents = students.filter((student) => {
        const fullName =
            `${student.firstName} ${student.familyName}`.toLowerCase();

        const matchesSearch =
            fullName.includes(searchTerm.toLowerCase()) ||
            student.id.includes(searchTerm);

        const matchesMajor =
            majorFilter === "All" || student.major === majorFilter;

        const isAllocated = allocatedStudentIds.includes(student.id);

        const matchesAllocation =
            allocationFilter === "all" ||
            (allocationFilter === "allocated" && isAllocated) ||
            (allocationFilter === "unallocated" && !isAllocated);

        return matchesSearch && matchesMajor && matchesAllocation;
    });


    const unallocatedStudents = students.filter(
        (student) => !allocatedStudentIds.includes(student.id)
    );

    const toggleStudent = (studentId) => {
        if (allocatedStudentIds.includes(studentId)) {
            return;
        }

        setSelectedStudents((current) => {
            if (current.includes(studentId)) {
                return current.filter((id) => id !== studentId);
            }

            return [...current, studentId];
        });
    };

    const createGroup = () => {
        const nextGroupId =
            groups.length > 0
                ? Math.max(...groups.map((group) => group.id)) + 1
                : 1;

        setGroups((current) => [
            ...current,
            {
                id: nextGroupId,
                students: []
            }
        ]);
    };

    const addStudentsToGroup = (groupId) => {
        if (selectedStudents.length === 0) {
            return;
        }

        const studentsToAdd = students.filter((student) =>
            selectedStudents.includes(student.id)
        );

        setGroups((current) =>
            current.map((group) =>
                group.id === groupId
                    ? {
                          ...group,
                          students: [...group.students, ...studentsToAdd]
                      }
                    : group
            )
        );

        setSelectedStudents([]);
    };

    const removeStudentFromGroup = (groupId, studentId) => {
        setGroups((current) =>
            current.map((group) =>
                group.id === groupId
                    ? {
                          ...group,
                          students: group.students.filter(
                              (student) => student.id !== studentId
                          )
                      }
                    : group
            )
        );
    };

    const removeGroup = (groupId) => {
        setGroups((current) =>
            current.filter((group) => group.id !== groupId)
        );
    };

    const resetAllocation = () => {
        setGroups([]);
        setSelectedStudents([]);
    };

    return (
    <div className="group-allocation-layout">
        <Sidebar />    
        
        <div className="group-allocation-page">
            <div className="allocation-header">
                <div>
                    <h1>Group Allocation</h1>
                </div>

                {groups.length > 0 && (
                    <button
                        className="reset-button"
                        onClick={resetAllocation}
                    >
                        Reset Allocation
                    </button>
                )}
            </div>

            <div className="allocation-summary">
                <div className="summary-card">
                    <span className="summary-label">Students</span>
                    <span className="summary-number">{students.length}</span>
                </div>

                <div className="summary-card">
                    <span className="summary-label">Allocated</span>
                    <span className="summary-number">
                        {allocatedStudentIds.length}
                    </span>
                </div>

                <div className="summary-card">
                    <span className="summary-label">Groups</span>
                    <span className="summary-number">{groups.length}</span>
                </div>

                <div className="summary-card">
                    <span className="summary-label">Unallocated</span>
                    <span className={`summary-number ${ unallocatedStudents.length > 0 ? "has-unallocated" : "" }`} > {unallocatedStudents.length}
                    </span>
                </div>
            </div>

            <div className="allocation-content">
                <section className="students-panel">
                    <div className="panel-header">
                        <div>
                            <h2>Students List</h2>
                        </div>
                    </div>

                    <div className="student-filters">
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                        />

                        <select
                            value={majorFilter}
                            onChange={(event) =>
                                setMajorFilter(event.target.value)
                            }
                        >
                            <option value="All">All Majors</option>

                            {majors.map((major) => (
                                <option key={major} value={major}>
                                    {major}
                                </option>
                            ))}
                        </select>


                        <select
                            value={allocationFilter}
                            onChange={(event) => setAllocationFilter(event.target.value)}
                        >
                            <option value="allocated">Allocated</option>
                            <option value="unallocated">Unallocated</option>
                        </select>


                    </div>

                    <div className="student-list">
                        {filteredStudents.map((student) => {
                            const isSelected = selectedStudents.includes(
                                student.id
                            );

                            const isAllocated = allocatedStudentIds.includes(
                                student.id
                            );

                            return (
                                <div
                                    key={student.id}
                                    className={`student-item ${
                                        isSelected ? "selected" : ""
                                    } ${isAllocated ? "allocated" : ""}`}
                                    onClick={() =>
                                        toggleStudent(student.id)
                                    }
                                >
                                    <div className="student-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            disabled={isAllocated}
                                            onChange={() =>
                                                toggleStudent(student.id)
                                            }
                                            onClick={(event) =>
                                                event.stopPropagation()
                                            }
                                        />
                                    </div>

                                    <div className="student-info">
                                        <strong>
                                            {student.firstName}{" "}
                                            {student.familyName}
                                        </strong>

                                        

                                        <div className="student-meta">
                                            <span className={`student-major ${student.major
                                                .toLowerCase()
                                                .replaceAll(" ", "-")}`}>
                                                {student.major}
                                            </span>

                                            <span>{student.id}</span>

                                            <span>
                                                CWA {student.cwa.toFixed(3)}
                                            </span>
                                        </div>
                                    </div>

                                    {isAllocated && (
                                        <span className="allocated-label material-symbols-outlined">
                                            check_circle
                                        </span>
                                    )}
                                </div>
                            );
                        })}

                        {filteredStudents.length === 0 && (
                            <div className="empty-state">
                                No students match your search or filter.
                            </div>
                        )}
                    </div>

                    <div className="selection-footer">
                        <span>
                            <strong>{selectedStudents.length}</strong>{" "}
                            selected
                        </span>

                        {selectedStudents.length > 0 && (
                            <span className="selection-help">
                                Select a group to add students
                            </span>
                        )}
                    </div>
                </section>

                <section className="groups-panel">
                    <div className="panel-header groups-panel-header">
                        <div>
                            <h2>Group Allocation</h2>
                        </div>

                        <button
                            className="create-group-button"
                            onClick={createGroup}
                        >
                            + Create Group
                        </button>
                    </div>

                    {selectedStudents.length > 0 && (
                        <div className="selection-banner">
                            <div>
                                <strong>
                                    {selectedStudents.length} student
                                    {selectedStudents.length !== 1
                                        ? "s"
                                        : ""}{" "}
                                    selected
                                </strong>

                                <span>
                                    Choose a group below to add the selected
                                    students.
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="groups-list">
                        {groups.length === 0 && (
                            <div className="groups-empty-state">


                                <h3>There are currently no groups created</h3>

                                <button
                                    className="create-group-button large"
                                    onClick={createGroup}
                                >
                                    + Create First Group
                                </button>
                            </div>
                        )}

                        {groups.map((group) => (
                            <div className="group-card" key={group.id}>
                                <div className="group-card-header">
                                    <div>
                                        <h3>Group {group.id}</h3>

                                        <span>
                                            {group.students.length} student
                                            {group.students.length !== 1
                                                ? "s"
                                                : ""}
                                        </span>
                                    </div>

                                    <div className="group-actions">
                                        {selectedStudents.length > 0 && (
                                            <button
                                                className="add-to-group-button"
                                                onClick={() =>
                                                    addStudentsToGroup(
                                                        group.id
                                                    )
                                                }
                                            >
                                                + Add
                                            </button>
                                        )}

                                        <button
                                            className="remove-group-button"
                                            onClick={() =>
                                                removeGroup(group.id)
                                            }
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>

                                <div className="group-students">
                                    {group.students.length === 0 ? (
                                        <div className="empty-group">
                                            <span>
                                                No students in this group
                                            </span>

                                            <small>
                                                Select students from the list
                                                and click "Add".
                                            </small>
                                        </div>
                                    ) : (
                                        group.students.map((student) => (
                                            <div
                                                className="group-student"
                                                key={student.id}
                                            >
                                                <div className="group-student-info">
                                                    <strong>
                                                        {student.firstName}{" "}
                                                        {student.familyName}
                                                    </strong>

                                                    <span>
                                                        {student.id}
                                                    </span>
                                                </div>

                                                <div className="group-student-details">
                                                    <span className={`major-badge ${student.major
                                                        .toLowerCase()
                                                        .replaceAll(" ", "-")}`}>
                                                        {student.major}
                                                    </span>

                                                    <strong>
                                                        CWA: {student.cwa.toFixed(3)}
                                                    </strong>

                                                    <button
                                                        className="remove-student-button"
                                                        onClick={() =>
                                                            removeStudentFromGroup(
                                                                group.id,
                                                                student.id
                                                            )
                                                        }
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    </div>    
    );
    
}

export default GroupAllocation;

