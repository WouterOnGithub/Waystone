/* Complete */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./pages-css/CSS.css";
import "./pages-css/Account_Page.css";
import "./pages-css/Account_Page_EDIT.css";
import Header from "../components/UI/Header";
import Footer from "../components/UI/Footer";
import Sidebar from "../components/UI/Sidebar";
import UploadIMG_Logo from "../assets/PlaceholderImage.jpg";
import { useAuth } from "../context/AuthContext";
import { getUser, setUser } from "../api/firestore";

function Account_Page_EDIT() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [username, setUsername] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [currentAvatarFileName, setCurrentAvatarFileName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        const data = await getUser(user.uid);
        if (data) {
          setUsername(data.username || "");
          setIntroduction(data.description || "");
          setCurrentAvatarFileName(data.avatarFileName || null);
        }
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

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

  const getAvatarUrl = () => {
    if (avatarPreview) return avatarPreview;
    if (currentAvatarFileName && user?.uid) {
      return `/avatars/${user.uid}/${currentAvatarFileName}`;
    }
    return UploadIMG_Logo;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!user?.uid) return;

    let avatarFileName = currentAvatarFileName;

    // Handle avatar upload via API
    if (avatarFile) {
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      formData.append("userId", user.uid);

      try {
        const response = await fetch("/api/upload-avatar", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        if (result.fileName) {
          avatarFileName = result.fileName;
        }
      } catch (error) {
        console.error("Error uploading avatar:", error);
      }
    }

    // Save user data to Firestore
    await setUser(user.uid, {
      username,
      description: introduction,
      avatarFileName,
    });

    navigate("/user/Account_Page");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="account-page">
      <Sidebar />
      <div className="account-shell">
        <Header title="Account" />

        <main className="account-content">
          <section id="account-box" className="account-card">
            <div className="account-avatar-wrap">
              <img
                src={getAvatarUrl()}
                alt="UploadIMG_Logo"
                id="UploadIMG_Logo"
                onClick={() => document.getElementById("upload-img").click()}
                style={{ cursor: "pointer" }}
              />
              <input
                type="file"
                id="upload-img"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <form className="account-details" id="input-box-gray" onSubmit={handleSave}>
              <label htmlFor="Username">
                <b>Username</b>
              </label>{" "}
              <br />
              <input 
                type="text" 
                id="nickname" 
                placeholder="DM_0124" 
                required 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <br />
              <br />
              <label htmlFor="introduction">
                <b>Introduction</b> (max. 150 characters)
              </label>
              <br />
              <textarea
                name="introduction"
                id="introduction"
                placeholder="Hello, my name is [Your name] "
                maxLength="150"
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
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