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
      if (user?.uid) {
        const data = await getUser(user.uid);
        setUserData(data);
        setNotes(data?.notes || "");
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
    if (userData?.avatarFileName) {
      return `/avatars/${user.uid}/${userData.avatarFileName}`;
    }
    return Placeholder;
  };


  return (
    <div>
      
      <Sidebar />
      
      <div id="main">

        <Header title="Account" />

        <div id="content">

          <section id="account-box" className="account-profile">
            {/* The profile image */}
            <div><img src={getAvatarUrl()} alt="Account profile" id="account-profile-image"/></div>

            {/* The profile details*/}
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