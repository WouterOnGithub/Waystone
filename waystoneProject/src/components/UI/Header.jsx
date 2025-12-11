function Header({ title = "" }) {
  {/* The green bar at the top of the page */}
  return (
    <div id="title">
      <p>{title}</p>
    </div>
  );
}

export default Header;
