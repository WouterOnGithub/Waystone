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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentCampaigns, setRecentCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

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

          {/* Getting Started Section */}
          <br />
          <b>Getting Started</b>
          
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">🌍</div>
              <h4>Worldbuilding</h4>
              <p>Create rich, immersive worlds with detailed lore, factions, and history for your players to explore.</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon">🗺️</div>
              <h4>Maps</h4>
              <p>Design interactive maps with locations, regions, and points of interest to guide your campaign.</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon">👥</div>
              <h4>Characters</h4>
              <p>Manage player characters, NPCs, and enemies with detailed stats, backgrounds, and relationships.</p>
            </div>
          </div>

          {/* How to Play Link */}
          <div className="help-link-box">
            <div className="help-icon">❓</div>
            <div className="help-content">
              <h4>How to Play?</h4>
              <p>New to D&D or Waystone? Check out our comprehensive guide!</p>
              <button 
                id="button-green" 
                onClick={() => navigate('/user/HelpPage')}
              >
                Go to Help Page
              </button>
            </div>
          </div>

          <br />
          <b>News</b>

          <div id="news-box-section">
            <div id="news-box">
              <img src={Placeholder} alt="NewsImages" id="news-box-img" />
              <div id="news-box-text">
                <b>Huisregels Update</b>
                <p>
                  Na feedback van spelers zijn enkele huisregels aangepast. Korte rust duurt nu 15 minuten in plaats van 1 uur, en bepaalde rituelen zijn herschreven om roleplay te bevorderen. Bekijk de volledige wijzigingen op de Rules-pagina voordat je volgende sessie begint.
                </p>
              </div>
            </div>

            <div id="news-box">
              <img src={Placeholder} alt="NewsImages" id="news-box-img" />
              <div id="news-box-text">
                <b>Free campaign: Big John's Big Adventure</b>
                <p>
                  Big John the knight rode out at dawn,
                  His armor tight, his confidence drawn.
                  He bragged of his reach and the heft of his sword,
                  Said size really mattered when facing a lord.

                Through castles and caverns he proudly would roam,
                Pulling that long blade out far from its home.
                He’d polish it daily, swore balance was key,
                And said, “It handles better the harder it is”
                </p>
              </div>
            </div>
          </div>

          {/* Community and Resources */}
          <br />
          <b>Community & Resources</b>

          <div className="community-resources-grid">
            <div className="community-card">
              <div className="community-icon">💬</div>
              <h4>Join Our Community</h4>
              <p>Connect with fellow DMs and players on Discord!</p>
              <a 
                href="https://discord.gg/EFETw5Mv" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <button id="button-green">Join Discord</button>
              </a>
            </div>

            <div className="community-card">
              <div className="community-icon">🎲</div>
              <h4>D&D Fun Facts</h4>
              <p>Did you know? The first edition of D&D was published in 1974 by Gary Gygax and Dave Arneson. The game has since become the most popular tabletop RPG in the world!</p>
            </div>

            <div className="community-card">
              <div className="community-icon">🎬</div>
              <h4>Get Inspired</h4>
              <p>Watch this amazing D&D campaign highlight for inspiration!</p>
              <a 
                href="https://youtu.be/nJ-ehbVQYxI?si=nG6pQ60DXOxSAfcR" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <button id="button-green">Watch Video</button>
              </a>
            </div>
          </div>

        </div>

        <Footer />
      
      </div>
    </div>
  );
}

export default Main_Page;