function SideBar(props) {
    return (
        <div className="sidebar">
            
            <ul style={styles.sidebarList}>
                <li>Home</li>
                <li>Studies</li>
                <li>Calendar</li>
                <li>Library</li>
                <li>Campus</li>
                <li>Help</li>
            </ul>
        </div>
    );
}

const styles = {
    sidebarList: {
        textAlign: "center",
        border: "#ccc",
        backgroundColor: "#f9f9f9",
    },
};

export default SideBar;
