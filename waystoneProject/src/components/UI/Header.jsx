function Header({ title = "" }) {
  return (
    <div id="main">
      {/* The green bar at the top of the page */}
      <div id="title">
        <p>{title}</p>
      </div>
    </div>
  );
}

export default Header;
