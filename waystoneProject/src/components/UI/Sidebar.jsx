import { Link, useNavigate } from "react-router-dom";
import Waystone_Logo from "../../assets/Waystone_Logo.png";
import { logout } from "../../firebase/Auth";
import "./UI css/Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const navItems = [
    { to: "/user/Account_Page", label: "Account" },
    { to: "/user/My_Campaigns_Page", label: "My Campaigns" },
    { to: "/user/New_Campaign_Page_CAMPAIGN", label: "New Campaign" },
    { to: "/user/Settings_Page", label: "Settings" },
    { to: "/", label: "Help" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/user/Login_Page");
  };

  return (
    <div className="sidebar-container">
      <nav className="sidebar-nav">
        {/* Logo */}
        <div
          role="button"
          tabIndex={0}
          className="logo-container"
          aria-label="Go to main page"
          onClick={() => navigate("/user/Main_Page")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              navigate("/user/Main_Page");
            }
          }}
        >
          <img
            src={Waystone_Logo}
            alt="Waystone Logo"
            className="logo-image"
          />
        </div>

        {/* Navigation */}
        <div className="nav-links">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className="nav-link">
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Logout */}
        <div className="logout-section">
          <button
            onClick={handleLogout}
            className="nav-link logout-link"
          >
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
