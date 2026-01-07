import { Link, useNavigate, useLocation } from "react-router-dom";
import Waystone_Logo from "../../assets/Waystone_Logo.png";
import { logout } from "../../firebase/Auth";
import "../../pages/pages-css/CSS.css";
import './UI css/Sidebar.css';

function Sidebar() 
{
  const navigate = useNavigate();
  const location = useLocation();

  /* All the links in the navigation bar */
  const navItems = [
    { to: "/user/Account_Page", label: "Account" },
    { to: "/user/My_Campaigns_Page", label: "My Campaigns" },
    { to: "/user/New_Campaign_Page_CAMPAIGN", label: "New Campaign" },
    { to: "/user/Settings_Page", label: "Settings" },
    { to: "/user/HelpPage", label: "Help" },
  ];

  /* The log-out process when you click on the Exit button */
  const handleLogout = async () => 
  {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;
    
    await logout();
    navigate("/user/Login_Page");
  };

  /* Check if current path matches nav item */
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="navigation">
      <nav>

        {/* Waystone_Logo */}
        <div
          className="logo-container"
          role="button"
          tabIndex={0}
          aria-label="Go to main page"
          onClick={() => navigate("/user/Main_Page")}
          onKeyDown={(e) => 
          {
            if (e.key === "Enter" || e.key === " ") 
            {
              navigate("/user/Main_Page");
            }
          }}
        >
          <img src={Waystone_Logo} alt="Waystone Logo" id="Waystone_Logo-sidebar"/>
        </div>

        {/* Navigation section */}
        <div className="nav-links">
          {navItems.map((item) => (
            <Link 
              key={item.to} 
              to={item.to}
              className={isActive(item.to) ? "nav-link active" : "nav-link"}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Exit button (to log-out) */}
        <div className="logout-container">
          <button id="button-green-sidebar" onClick={handleLogout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Log Out
          </button>
        </div>

      </nav>
    </div>
  );
}

export default Sidebar;