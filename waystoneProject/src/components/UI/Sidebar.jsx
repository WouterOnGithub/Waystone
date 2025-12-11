import { Link } from "react-router-dom";
import Waystone_Logo from "../../assets/Waystone_Logo.png"; // adjust path if needed

function Sidebar() {
  return (
    <div className="navigation">
      <nav>
        <br />
        <img src={Waystone_Logo} alt="Waystone Logo" id="Waystone_Logo" />
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
        <Link to="">Settings</Link>
        <br />
        <br />
        <Link to="/">Help</Link>
      </nav>
    </div>
  );
}

export default Sidebar;
