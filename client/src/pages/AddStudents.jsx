import "./ISAD3000.css";
import "./Projects.css";
import AddStudentsPage from "./AddStudentsPage";

function AddStudents({unitName, unitTitle}) {
    return (
        <AddStudentsPage
            unitName={unitName}
            unitTitle={unitTitle}
        />
    );
}

export default AddStudents;