import { Link } from 'react-router-dom';
import Waystone_Logo from '../../assets/Waystone_Logo.png'; // adjust path if needed

const Header = ({ title }) => {
    return (
        <div id="main">
            {/* The green bar at the top of the page */}
            <div id="title">
                <p>{title}</p>
            </div>
        </div>
    );
};

export default Header;
