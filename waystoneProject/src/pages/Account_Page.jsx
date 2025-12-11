/* Complete */
import React from "react";
import { Link } from "react-router-dom";
import "./pages-css/CSS.css";
import "./pages-css/Account_Page.css";
import Header from "../components/UI/Header";
import Footer from "../components/UI/Footer";
import Sidebar from "../components/UI/Sidebar";
import Waystone_Logo from "../assets/PlaceholderImage.jpg";
import UploadIMG_Logo from "../assets/PlaceholderImage.jpg";
import Required_Logo from "../assets/Required_Logo.webp";
import Delete_Logo from "../assets/Delete_Logo.webp";
import Add_Logo from "../assets/Add_Logo.webp";
import Placeholder from "../assets/PlaceholderImage.jpg";

function Account_Page() {
  return (
    <div className="account-page">
      <Sidebar />
      <div className="account-shell">
        <Header title="Account" />

        <main className="account-content">
          <section id="account-box" className="account-card">
            <div className="account-avatar-wrap">
              <img src={Placeholder} alt="Account profile" id="Account_Profile" />
            </div>
            <div className="account-details">
              <Link to="/user/Account_Page_EDIT" className="edit-icon" aria-label="Edit profile">
                ✏️
              </Link>
              <b>Username</b>
              <p>
                Lorem contrary to popular belief, Lorem Ipsum is not simply random
                text. It has roots in a piece of classical Latin literature from 45
                BC, making it over 2000 years old.
              </p>
            </div>
          </section>

          <section id="account-box" className="account-stats">
            <p>
              <b>Total campaigns:</b> 0
            </p>
            <p>
              <b>Last played:</b> Project__name
            </p>
          </section>

          <div className="account-actions">
            <button id="button-green">Archived Campaigns</button>
          </div>

          <section id="account-notes" className="account-notes-block">
            <b>Notes</b>
            <textarea
              defaultValue="Lorem contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words."
            />
            <div className="account-actions">
              <button id="button-green">Save</button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default Account_Page;