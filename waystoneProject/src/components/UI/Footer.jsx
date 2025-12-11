import { Link } from 'react-router-dom';

function Footer(){
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/about">About</Link> | 
        <Link to="/contact">Contact</Link> | 
      </div>
      <div className="footer-copy">
        &copy; {new Date().getFullYear()} Waystone. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
