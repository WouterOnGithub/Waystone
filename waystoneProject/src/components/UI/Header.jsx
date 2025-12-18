import "../../pages/pages-css/CSS.css";

function Header({ title = "" }) 
{
  return (
    <div id="title">
      <p>{title}</p>
    </div>
  );
}

export default Header;