import StudentList from "./StudentList";
import { ICTE3002Students } from "./StudentsData";

function ICTE3002() {
    return (
        <StudentList
            unitName="ICTE3002"
            unitTitle="Human Computer Interface"
            unitPath="/ucdashboard/icte3002"
            students={ICTE3002Students}
        />
    );
}

export default ICTE3002;