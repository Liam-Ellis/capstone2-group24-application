import "./ISAD3000.css";
import "./Projects.css";
import AddStudentPage from "./AddStudentPage";

function AddStudent({unitName, unitTitle}) {
    return (
        <AddStudentPage
            unitName={unitName}
            unitTitle={unitTitle}
        />
    );
}

export default AddStudent;