import { Link, useNavigate } from "react-router-dom";
import Waystone_Logo from "../../assets/Waystone_Logo.png";
import { logout } from "../../firebase/Auth";
import "../../pages/pages-css/CSS.css";
import './UI css/Sidebar.css';

function Sidebar() 
{
  const navigate = useNavigate();

  /* All the links in the navigation bar */
  const navItems = [
    { to: "/user/Account_Page", label: "Account" },
    { to: "/user/My_Campaigns_Page", label: "My Campaigns" },
    { to: "/user/New_Campaign_Page_CAMPAIGN", label: "New Campaign" },
    { to: "/user/Settings_Page", label: "Settings" },
  ];

  /* The log-out process when you click on the Exit button */
  const handleLogout = async () => 
  {
    await logout();
    navigate("/user/Login_Page");
  };

  return (
    <div className="navigation">
      <nav>

        {/* Waystone_Logo */}
        <div
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
          <img src={Waystone_Logo} alt="Waystone_Logo" id="Waystone_Logo-sidebar"/>
        </div>

        {/* Navigation section */}
        <div>
          {navItems.map((item) => (
            <Link key={item.to} to={item.to}><br />{item.label}<br /></Link> ))}
        </div>

        {/* Exit button (to log-out) */}
        <button id="button-green-sidebar" onClick={handleLogout}>Exit</button>

      </nav>
    </div>
  );
}

export default Sidebar;

