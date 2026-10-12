import "./ISAD3000.css";
import "./Projects.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import StudentList from "./StudentList";
import { ISAD3000Students } from "./StudentsData";

function ISAD3000() {
    return (
        <StudentList
            unitName="ISAD3000"
            unitTitle="Capstone Project 1"
            students={ISAD3000Students}
        />
    );
}

export default ISAD3000;