import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getAllCampaigns,
  publishCampaign,
  unpublishCampaign,
  getFreeCampaigns,
  updateCampaignInfo
} from "../api/userCampaigns";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import "./pages-css/CSS.css";
import "./pages-css/My_Campaigns_Page.css";
import Header from "../components/UI/Header";
import Footer from "../components/UI/Footer";
import Sidebar from "../components/UI/Sidebar";

// Helper to normalise Firestore / ISO dates
const getCampaignSortDate = (campaign) => {
  const value = campaign.lastUpdatedAt || campaign.createdAt || null;
  if (!value) return 0;

  // Firestore Timestamp
  if (value && typeof value === "object" && typeof value.toDate === "function") {
    return value.toDate().getTime();
  }

  // ISO string or anything Date can parse
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
};

function My_Campaigns_Page() 
{
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [freeCampaigns, setFreeCampaigns] = useState([]);

  useEffect(() => {
    const loadCampaigns = async () => {
      if (!user?.uid) return;
      setLoading(true);
      setError(null);
      try {
        const campaigns = await getAllCampaigns(user.uid);

        // Sort by most recently edited (lastUpdatedAt), fallback to createdAt
        const sorted = [...campaigns].sort(
          (a, b) => getCampaignSortDate(b) - getCampaignSortDate(a)
        );

        setAllCampaigns(sorted);
      } catch (err) {
        console.error("Failed to load campaigns:", err);
        setError("Failed to load campaigns");
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns();
  }, [user]);

  useEffect(() => {
    // Real-time listener for FreeCampaigns
    const freeCampaignsRef = collection(db, "FreeCampaigns");
    
    const unsubscribe = onSnapshot(
      freeCampaignsRef,
      (snapshot) => {
        const campaigns = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFreeCampaigns(campaigns);
      },
      (error) => {
        console.error("Error listening to free campaigns:", error);
        // Fallback to one-time fetch if listener fails
        getFreeCampaigns().then(setFreeCampaigns).catch(console.error);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const recentCampaigns = allCampaigns.slice(0, 5);
  const activeCampaigns = allCampaigns.filter(campaign => !campaign.isArchived);

  const dynamicSections = [
    {
      title: "Recent Campaigns",
      items: recentCampaigns.filter(c => !c.isArchived).map((c, idx) => ({
        id: c.id,
        name: c.name || "Unnamed campaign",
        color: ["#303030", "#303030", "#303030", "#303030", "#303030"][idx % 5],
        published: c.published === true,
      })),
    },
    {
      title: "All Campaigns",
      items: activeCampaigns.map((c, idx) => ({
        id: c.id,
        name: c.name || "Unnamed campaign",
        color: ["#303030", "#303030", "#303030"][idx % 3],
      published: c.published === true,
      })),
    },
    {
  title: "Free Campaigns",
  items: freeCampaigns.map((c, idx) => ({
    id: c.campaignId || c.id,
    name: c.name || "Unnamed campaign",
    color: ["#447DC9", "#E7D665"][idx % 2],
    published: true,
  })),
}
  ];

  const handleOpenCampaign = (campaignId) => {
    if (!campaignId) return;
    navigate(`/user/New_Campaign_Page_CAMPAIGN/${campaignId}`);
  };

  const handleArchiveCampaign = async (campaignId, campaignName) => {
    if (!campaignId || !user?.uid) return;
    
    const confirmed = window.confirm(`Are you sure you want to archive "${campaignName}"?`);
    if (!confirmed) return;
    
    try {
      await updateCampaignInfo(user.uid, campaignId, { isArchived: true });
      // Refresh campaigns list
      const campaigns = await getAllCampaigns(user.uid);
      const sorted = [...campaigns].sort(
        (a, b) => getCampaignSortDate(b) - getCampaignSortDate(a)
      );
      setAllCampaigns(sorted);
    } catch (err) {
      console.error("Failed to archive campaign:", err);
      setError("Failed to archive campaign");
    }
  };

  const handlePublishCampaign = async (campaignId, campaignName, isCurrentlyPublished) => {
    if (!campaignId || !user?.uid) return;

    const action = isCurrentlyPublished ? "unpublish" : "publish";
    const confirmed = window.confirm(
      `Are you sure you want to ${action} "${campaignName}"?`
    );
    if (!confirmed) return;

    try {
      if (isCurrentlyPublished) {
        await unpublishCampaign(user.uid, campaignId);
      } else {
        await publishCampaign(user.uid, campaignId);
      }

      // Refresh campaigns list and sort
      const campaigns = await getAllCampaigns(user.uid);
      const sorted = [...campaigns].sort(
        (a, b) => getCampaignSortDate(b) - getCampaignSortDate(a)
      );
      setAllCampaigns(sorted);

      // Refresh free campaigns list to show published campaigns
      const freeCampaignsData = await getFreeCampaigns();
      setFreeCampaigns(freeCampaignsData);
    } catch (err) {
      console.error(`Failed to ${action} campaign:`, err);
      setError(`Failed to ${action} campaign`);
    }
  };


  return (
    <div className="full-page">
      
      <Sidebar />

      <div id="main">
      
      <Header title="My Campaigns" />

        <div id="content">
          {loading && <p>Loading campaigns...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {dynamicSections.map((section) => (

            <section key={section.title}>

              {/* The title per section of campaigns */}
              <b>{section.title}</b>

              {/* The area that holds the campaign boxes */}
              <div id="box-section">
                {section.items.map((item, idx) => (
                  /* A campaigns box */
                  <div id="box-text" 
                       key={item.id ? item.id : `${section.title}-${idx}`}
                       onClick={() => handleOpenCampaign(item.id)}
                       style={item.id ? { cursor: "pointer" } : undefined}
                  >
                    
                    {/* The campaigns project name */}
                    <p>{item.name}&#10240;</p>
                    
                    {/* The bottom part of the box (the white) which contains the buttons */}
                    <div id="box">
                      {section.title === "All Campaigns" ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePublishCampaign(item.id, item.name, item.published);
                            }}
                          >
                            {item.published ? "Unpublish" : "Publish"}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleArchiveCampaign(item.id, item.name);
                            }}
                          >
                            Archive
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArchiveCampaign(item.id, item.name);
                          }}
                        >
                          Archive
                        </button>
                      )}
                    </div>

                  </div>
                ))}
              </div>

            </section>
          ))}
        </div>

        <Footer />

      </div>
    </div>
  );
}

export default My_Campaigns_Page;