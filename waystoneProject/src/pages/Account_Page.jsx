/* Complete */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./pages-css/CSS.css";
import "./pages-css/Account_Page.css";
import Header from "../components/UI/Header";
import Footer from "../components/UI/Footer";
import Sidebar from "../components/UI/Sidebar";
import Placeholder from "../assets/PlaceholderImage.jpg";
import { useAuth } from "../context/AuthContext";
import { getUser, setUser } from "../api/firestore";

function Account_Page() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        const data = await getUser(user.uid);
        setUserData(data);
        setNotes(data?.notes || "");
        setLoading(false);
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
              <img src={getAvatarUrl()} alt="Account profile" id="Account_Profile" />
            </div>
            <div className="account-details">
              <Link to="/user/Account_Page_EDIT" className="edit-icon" aria-label="Edit profile">
                ✏️
              </Link>
              <b>{userData?.username || "Username"}</b>
              <p>
                {userData?.description || "No description yet."}
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
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="account-actions">
              <button id="button-green" onClick={handleSaveNotes}>Save</button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default Account_Page;