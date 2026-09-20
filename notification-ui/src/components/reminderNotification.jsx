import { useEffect, useState } from "react";

function ReminderNotification() {
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const reminder = [
            {
                id: 1,
                title: "Census Date",
                message: "Is your enrolment correct? The census date for Semseter 1 2027 is 10 Febrary 2027"
            },
            {
                id: 2,
                title: "Due Dates and Deadlines",
                message: "You have 3 upcoming due dates and deadlines for your courses"
            }
        ];
        setNotifications(reminder);

    }, []);

    return (
        <div className="notification">
            <button onClick={() => setOpen(!open)}>
                {notifications.length > 0 
                    ? (open ? "Hide Reminder" : "Show Reminder 🔔") 
                    : "No reminders"}
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

export default ReminderNotification;