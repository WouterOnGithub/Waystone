import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./pages-css/CSS.css";
import "./pages-css/My_Campaigns_Page.css";
import Header from "../components/UI/Header";
import Footer from "../components/UI/Footer";
import Sidebar from "../components/UI/Sidebar";
import { useAuth } from "../context/AuthContext";
import { getAllCampaigns } from "../api/userCampaigns";

// Static dummy data for free campaigns (kept as-is)
const freeCampaignSection = {
  title: "Free Campaigns",
  items: [
    { name: "Project__Name", color: "#E7D665" },
    { name: "Project__Name", color: "#447DC9" },
  ],
};

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

function My_Campaigns_Page() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const recentCampaigns = allCampaigns.slice(0, 5);

  const dynamicSections = [
    {
      title: "Recent Campaigns",
      items: recentCampaigns.map((c, idx) => ({
        id: c.id,
        name: c.name || "Unnamed campaign",
        color: ["#E7D665", "#447DC9", "#D34848", "#E7D665", "#447DC9"][idx % 5],
      })),
    },
    {
      title: "All Campaigns",
      items: allCampaigns.map((c, idx) => ({
        id: c.id,
        name: c.name || "Unnamed campaign",
        color: ["#E7D665", "#447DC9", "#D34848"][idx % 3],
      })),
    },
    freeCampaignSection,
  ];

  const handleOpenCampaign = (campaignId) => {
    if (!campaignId) return;
    navigate(`/user/New_Campaign_Page_CAMPAIGN/${campaignId}`);
  };

  return (
    <div className="campaigns-page">
      <Sidebar />
      <div id="main" className="campaigns-shell">
        <Header title="My Campaigns" />

        <div id="content" className="campaigns-content">
          {loading && <p>Loading campaigns...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {dynamicSections.map((section) => (
            <section key={section.title}>
              <b>{section.title}</b>
              <div id="box-section">
                {section.items.map((item, idx) => (
                  <div
                    id="box-text"
                    key={item.id ? item.id : `${section.title}-${idx}`}
                    onClick={() => handleOpenCampaign(item.id)}
                    style={item.id ? { cursor: "pointer" } : undefined}
                  >
                    <p style={{ backgroundColor: item.color }}>{item.name}</p>
                    <div id="box">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: implement archive behaviour
                        }}
                      >
                        Archive
                      </button>
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