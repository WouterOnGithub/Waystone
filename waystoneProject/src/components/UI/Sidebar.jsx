import { Link, useNavigate } from "react-router-dom";
import Waystone_Logo from "../../assets/Waystone_Logo.png"; // adjust path if needed

function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="navigation">
      <nav>
        <br />
        <div
          role="button"
          tabIndex={0}
          onClick={() => navigate("/user/Main_Page")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") navigate("/user/Main_Page");
          }}
          style={{ display: "inline-block", cursor: "pointer" }}
          aria-label="Go to main page"
        >
          <img src={Waystone_Logo} alt="Waystone Logo" id="Waystone_Logo" />
        </div>
        <br />
        <br />
        <br />
        <Link to="/user/Account_Page">Account</Link>
        <br />
        <br />
        <Link to="/user/My_Campaigns_Page">My Campaigns</Link>
        <br />
        <br />
        <Link to="/user/New_Campaign_Page_CAMPAIGN">New Campaign</Link>
        <br />
        <br />
        <Link to="/user/Settings_Page">Settings</Link>
        <br />
        <br />
        <Link to="/">Help</Link>
        <br />
        <br />
        <Link to="/user/Login_Page">Logout</Link>
      </nav>
    </div>
  );
}

export default Sidebar;
