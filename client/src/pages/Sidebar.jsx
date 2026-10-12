import { useNavigate } from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();

    const sidebar = [
        {
            name: "Units",
            path: "/ucdashboard"
        },
        {
            name: "Rounds",
            path: "/ucdashboard/rounds",

        },
        {
            name: "Group Allocation",
            path: "/ucdashboard/groups"
        }
    ];

    return (
        <aside className="sidebar">
            <h2>UC Dashboard</h2>

                <nav>
                    <ul>
                        {sidebar.map((item) => (
                            <li key={item.name}>
                                <div onClick={() => navigate(item.path)}>
                                    {item.name}
                                </div>

                                {item.children && (
                                    <ul className="sidebar-submenu">
                                        {item.children.map((child) => (
                                            <li
                                                key={child.name}
                                                onClick={() => navigate(child.path)}
                                            >
                                                {child.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
        </aside>
    );
}

export default Sidebar;