import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUser, setUser } from "../api/firestore";
import { getAllCampaigns } from "../api/userCampaigns";
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
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;
      setLoading(true);
      
      try {
        // Fetch user data
        const data = await getUser(user.uid);
        console.debug("Loaded account user data:", data);
        setUserData(data);
        setNotes(data?.notes || "");
        
        // Fetch campaigns
        const userCampaigns = await getAllCampaigns(user.uid);
        setCampaigns(userCampaigns);
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleSaveNotes = async () => {
    if (user?.uid) {
      await setUser(user.uid, { notes });
    }
  };

  const getLastPlayedCampaign = () => {
    if (campaigns.length === 0) return null;
    
    // Sort by lastUpdatedAt, fallback to createdAt
    const sorted = [...campaigns].sort((a, b) => {
      const aTime = new Date(a.lastUpdatedAt || a.createdAt || 0).getTime();
      const bTime = new Date(b.lastUpdatedAt || b.createdAt || 0).getTime();
      return bTime - aTime;
    });
    
    return sorted[0];
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
    <div>
      
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
            <p> <b>Total campaigns:</b> <i>{campaigns.length}</i> </p>
            
            <p> <b>Last played:</b> <i>{getLastPlayedCampaign()?.name || "No campaigns yet"}</i> </p>
          </section>

          <section id="account-archived">
            {/* The archive button to see archived campaigns */}
            <Link to="/user/Archived_Campaigns" id="button-green">Archived Campaigns</Link>
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