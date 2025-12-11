import React from "react";
import "./pages-css/CSS.css";
import Waystone_Logo from "../assets/PlaceholderImage.jpg";
import Placeholder from "../assets/PlaceholderImage.jpg";

function My_Campaigns_Page() {
  return (
    <div className="campaigns-page">
      <Sidebar />
      <div id="main" className="campaigns-shell">
        <Header title="My Campaigns" />

        <div id="content" className="campaigns-content">
          {campaignSections.map((section) => (
            <section key={section.title}>
              <b>{section.title}</b>
              <div id="box-section">
                {section.items.map((item, idx) => (
                  <div id="box-text" key={`${section.title}-${idx}`}>
                    <p style={{ backgroundColor: item.color }}>{item.name}</p>
                    <div id="box">
                      <button>Archive</button>
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