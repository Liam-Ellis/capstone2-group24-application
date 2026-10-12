import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dropdown.css";

function Dropdown({ unitName, items }) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <li className="dropdown">
      <button
        className="dropdown-button"
        onClick={() => setOpen(!open)}
      >
        {unitName}
      </button>

      {open && (
        <ul className="dropdown-content">
          {items.map((item) => (
            <li
              key={item.name}
              onClick={() => navigate(item.path)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default Dropdown;