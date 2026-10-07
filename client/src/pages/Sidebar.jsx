import { useNavigate } from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();

    const sidebar = [
        {
            name: "Institution Page",
            path: "/ucdashboard/institution"
        },
        {
            name: "Units",
            path: "/ucdashboard"
        },
        {
            name: "Settings",
            path: "/ucdashboard/settings"
        }
    ];

    return (
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

                    <li
                        onClick={() =>
                            navigate("/ucdashboard/isad3000/students")
                        }
                    >
                        Student List
                    </li>

                    <li
                        onClick={() =>
                            navigate("/ucdashboard/isad3000/groups")
                        }
                    >
                        Group Allocation
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;