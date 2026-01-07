
import "../../pages/pages-css/CSS.css";
import './UI css/Header.css';

function Header({ title = "" }) 
{
  return (
    <div id="title">
      <div className="title-content">
        <p>{title}</p>
        <div className="title-glow"></div>
      </div>
    </div>
  );
}

export default Header;