import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUser, setUser } from "../api/firestore";
import "./pages-css/CSS.css";
import "./pages-css/Account_Page.css";
import Header from "../components/UI/Header";
import Footer from "../components/UI/Footer";
import Sidebar from "../components/UI/Sidebar";
import Placeholder from "../assets/PlaceholderImage.jpg"; /* Has to later be replaced by a standard stand-in */

function Account_Page() 
{
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user?.uid) {
          const data = await getUser(user.uid);
          console.debug("Loaded account user data:", data);
          setUserData(data);
          setNotes(data?.notes || "");
        } else {
          console.debug("No authenticated user in Account_Page");
          setUserData(null);
          setNotes("");
        }
      } catch (err) {
        console.error("Failed to load account user data:", err);
      }
    };
    fetchUserData();
  }, [user]);

  const handleSaveNotes = async () => {
    if (user?.uid) {
      await setUser(user.uid, { notes });
    }
  };

  const getAvatarUrl = () => {
    // Prefer the new avatarUrl field stored in Firestore
    if (userData?.avatarUrl) {
      return userData.avatarUrl;
    }
    // Backwards compatibility with legacy avatarFileName + per-user folders
    if (userData?.avatarFileName && user?.uid) {
      return `/avatars/${user.uid}/${userData.avatarFileName}`;
    }
    return Placeholder;
  };

  const handleAvatarError = (e) => {
    console.warn("Avatar image failed to load, falling back to placeholder.", {
      src: e.currentTarget?.src,
      userData,
    });
    if (e.currentTarget) {
      e.currentTarget.src = Placeholder;
    }
  };


  return (
    <div className="full-page">
      
      <Sidebar />
      
      <div id="main">

        <Header title="Account" />

        <div id="content">
          <section id="account-box" className="account-profile">
            <div className="account-avatar-wrap">
              <img src={getAvatarUrl()} alt="Account profile" id="account-profile-image" onError={handleAvatarError}/>
            </div>
            <div className="account-details">
               {/* The profile details (the edit icon) */}
              {/* aria-label="Edit profile" => For accessibility */}
              <Link to="/user/Account_Page_EDIT" className="account-edit-icon" aria-label="Edit profile">&#9998;</Link>
              
               {/* The profile details (username, description) */}
              <b>{userData?.username || "User_1"}</b>
              <p>{userData?.description || "Nothing here yet.."}</p>
            </div>
          </section>

          {/* The campaigns section (total created, last played) */}
          <section id="account-box" className="account-campaigns">
            <p> <b>Total campaigns:</b> <i>0</i> </p>
            
            <p> <b>Last played:</b> <i>Project__name</i> </p>
          </section>

          <section id="account-archived">
            {/* The archive button to see archived campaigns */}
            <button id="button-green">Archived Campaigns</button>
          </section>

          {/* The notes section */}
          <section id="account-box" className="account-notes">
            <b>Notes</b>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)}/>
            <button id="button-green" onClick={handleSaveNotes}>Save</button>
          </section>
        </div>

        <Footer />

      </div>
    </div>
  );
}

export default Account_Page;