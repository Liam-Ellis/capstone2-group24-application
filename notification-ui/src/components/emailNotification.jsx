import { useEffect, useState } from "react";

function Notification() {
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const notificationData = [
            {
                id: 1,
                title: "Welcome to Semester 1 2027",
                message: "Get ready for your new semester"
            },
            {
                id: 2,
                title: "Important 2027 Dates and Deadlines",
                message: "Check out the important dates and deadlines for the upcoming semester"
            },
            {
                id: 3,
                title: "Cetrally Scheduled Final Examinations Timetable",
                message: "View your personalised exam timetable by entering your student ID"
            }
        ];
        setNotifications(notificationData);

    }, []);

    return (
        <div className="notification">
            <button onClick={() => setOpen(!open)}>
                {notifications.length > 0 
                    ? (open ? "Hide Notifications" : "Show Notifications ✉️") 
                    : "No notifications"}
            </button>
            
            {
                open && 
                <div className="dropdown">
                    {
                        notifications.map(item => (
                            <div 
                                key={item.id} 
                                style={styles.notificationCard}
                            >
                                <h4>
                                    {item.title}
                                </h4>
                                <p>
                                    {item.message}
                                </p>
                            </div>
                        ))
                    }
                </div>
            }
        </div>
    );
}

const styles = {
    notificationCard: {
        textAlign: "left",
        border: "1px solid #ccc",
        borderRadius: "5px",
        padding: "7px",
        marginBottom: "10px",
        backgroundColor: "#f9f9f9",
    },
};

export default Notification;