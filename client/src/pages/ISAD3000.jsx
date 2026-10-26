import "./ISAD3000.css";
import "./Projects.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import StudentList from "./StudentList";

function ISAD3000() {
    return (
        <StudentList
            unitName="ISAD3000"
            unitTitle="Capstone Project 1"
        />
    );
}

export default ISAD3000;