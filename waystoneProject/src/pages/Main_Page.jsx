import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getAllCampaigns } from "../api/userCampaigns";
import "./pages-css/CSS.css";
import "./pages-css/Main_Page.css";
import Sidebar from "../components/UI/Sidebar";
import Header from "../components/UI/Header";
import Footer from "../components/UI/Footer";
import CampaignBox from "../components/CampaignBox";
import Placeholder from "../assets/PlaceholderImage.jpg";

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

function Main_Page() 
{
  console.log("Main_Page loaded");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentCampaigns, setRecentCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log("Context user:", user.uid);

  useEffect(() => {
    const loadRecentCampaigns = async () => {
      if (!user?.uid) return;
      setLoading(true);
      try {
        const campaigns = await getAllCampaigns(user.uid);
        
        // Filter active campaigns and sort by most recently edited
        const activeCampaigns = campaigns.filter(campaign => !campaign.isArchived);
        const sorted = [...activeCampaigns].sort(
          (a, b) => getCampaignSortDate(b) - getCampaignSortDate(a)
        );
        
        // Take only the first 4 for recent campaigns
        const recent = sorted.slice(0, 4).map((c, idx) => ({
          id: c.id,
          name: c.name || "Unnamed campaign",
          color: ["#303030", "#303030", "#303030", "#303030", "#303030"][idx % 5],
          published: c.published === true,
          mainMapUrl: c.mainMapUrl || null,
        }));
        
        setRecentCampaigns(recent);
      } catch (err) {
        console.error("Failed to load recent campaigns:", err);
      } finally {
        setLoading(false);
      }
    };

    loadRecentCampaigns();
  }, [user]);

  const handleOpenCampaign = (campaignId) => {
    if (!campaignId) return;
    navigate(`/user/New_Campaign_Page_CAMPAIGN/${campaignId}`);
  };

  const handleArchiveCampaign = async (campaignId, campaignName) => {
    if (!campaignId || !user?.uid) return;
    
    const confirmed = window.confirm(`Are you sure you want to archive "${campaignName}"?`);
    if (!confirmed) return;
    
    try {
      const { updateCampaignInfo } = await import("../api/userCampaigns");
      await updateCampaignInfo(user.uid, campaignId, { isArchived: true });
      
      // Refresh recent campaigns list
      const campaigns = await getAllCampaigns(user.uid);
      const activeCampaigns = campaigns.filter(campaign => !campaign.isArchived);
      const sorted = [...activeCampaigns].sort(
        (a, b) => getCampaignSortDate(b) - getCampaignSortDate(a)
      );
      const recent = sorted.slice(0, 5).map((c, idx) => ({
        id: c.id,
        name: c.name || "Unnamed campaign",
        color: ["#303030", "#303030", "#303030", "#303030", "#303030"][idx % 5],
        published: c.published === true,
        mainMapUrl: c.mainMapUrl || null,
      }));
      setRecentCampaigns(recent);
    } catch (err) {
      console.error("Failed to archive campaign:", err);
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
      const { publishCampaign, unpublishCampaign } = await import("../api/userCampaigns");
      
      if (isCurrentlyPublished) {
        await unpublishCampaign(user.uid, campaignId);
      } else {
        await publishCampaign(user.uid, campaignId);
      }

      // Refresh recent campaigns list
      const campaigns = await getAllCampaigns(user.uid);
      const activeCampaigns = campaigns.filter(campaign => !campaign.isArchived);
      const sorted = [...activeCampaigns].sort(
        (a, b) => getCampaignSortDate(b) - getCampaignSortDate(a)
      );
      const recent = sorted.slice(0, 5).map((c, idx) => ({
        id: c.id,
        name: c.name || "Unnamed campaign",
        color: ["#303030", "#303030", "#303030", "#303030", "#303030"][idx % 5],
        published: c.published === true,
        mainMapUrl: c.mainMapUrl || null,
      }));
      setRecentCampaigns(recent);
    } catch (err) {
      console.error(`Failed to ${action} campaign:`, err);
    }
  };
  
  return (
    <div className="full-page">
      
      <Sidebar />

      <div id="main">
      
      <Header title="Welcome" />

        <div id="content">
          <b>Recent Campaigns</b>

          <div id="box-section">
            {loading ? (
              <p>Loading recent campaigns...</p>
            ) : recentCampaigns.length > 0 ? (
              recentCampaigns.map((item, idx) => (
                <CampaignBox
                  key={item.id}
                  item={item}
                  idx={idx}
                  sectionTitle="Recent Campaigns"
                  onOpenCampaign={handleOpenCampaign}
                  onPublishCampaign={handlePublishCampaign}
                  onArchiveCampaign={handleArchiveCampaign}
                  onAddToMyCampaigns={() => {}} // Empty function since Main Page doesn't have free campaigns
                />
              ))
            ) : (
              <p>No recent campaigns found</p>
            )}
          </div>

          <br />
          <b>News</b>

          <div id="news-box-section">
            <div id="news-box">
              <img src={Placeholder} alt="NewsImages" id="news-box-img" />
              <div id="news-box-text">
                <b>News_Title</b>
                <p>
                  This is a very long description that explains whatever the
                  news is about, this will be repeated. This is a very long
                  description that explains whatever the news is about, this
                  will be repeated. This is a very long description that
                  explains whatever the news is about, this will be repeated.
                  This is a very long description that explains whatever the
                  news is about, this will be repeated.
                </p>
              </div>
            </div>

            <div id="news-box">
              <img src={Placeholder} alt="NewsImages" id="news-box-img" />
              <div id="news-box-text">
                <b>News_Title</b>
                <p>
                  This is a very long description that explains whatever the
                  news is about, this will be repeated. This is a very long
                  description that explains whatever the news is about, this
                  will be repeated. This is a very long description that
                  explains whatever the news is about, this will be repeated.
                  This is a very long description that explains whatever the
                  news is about, this will be repeated.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      
      </div>
    </div>
  );
}

export default Main_Page;