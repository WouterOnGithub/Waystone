/* Complete */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

function Account_Page_EDIT() {
  const navigate = useNavigate();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarFile(file);
    setAvatarPreview(url);
  };

  const handleSave = (e) => {
    e.preventDefault();
    navigate("/user/Account_Page");
  };

  return (
    <div className="account-page">
      <Sidebar />
      <div className="account-shell">
        <Header title="Account" />

        <main className="account-content">
          <section id="account-box" className="account-card">
            <div className="account-avatar-wrap">
              <label htmlFor="upload-img">
                <img
                  src={avatarPreview || UploadIMG_Logo}
                  alt="UploadIMG_Logo"
                  id="UploadIMG_Logo"
                />
              </label>
              <input
                type="file"
                id="upload-img"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <form className="account-details" id="input-box-gray" onSubmit={handleSave}>
              <label htmlFor="name">
                <b>Name</b>
              </label>
              <br />
              <input type="text" id="name" defaultValue="John Doe" />
              <br />
              <br />
              <label htmlFor="nickname">
                <b>Nickname</b>
              </label>{" "}
              <br />
              <input type="text" id="nickname" defaultValue="DM_0124" required />
              <br />
              <br />
              <label htmlFor="introduction">
                <b>Introduction</b> (max. 150 characters)
              </label>
              <br />
              <textarea
                name="introduction"
                id="introduction"
                defaultValue="Hello, my name is [Your name] !"
                maxLength="150"
              />
              <br />
              <div className="account-actions">
                <button id="button-green" type="submit">
                  Save
                </button>
              </div>
            </form>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default Account_Page_EDIT;