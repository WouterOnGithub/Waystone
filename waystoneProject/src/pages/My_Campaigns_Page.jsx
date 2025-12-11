import React from "react";
import "./pages-css/CSS.css";
import Header from "../components/UI/Header";
import Footer from "../components/UI/Footer";
import Sidebar from "../components/UI/Sidebar";

const campaignSections = [
  {
    title: "Recent Campaigns",
    items: [
      { name: "Project__Name", color: "#E7D665" },
      { name: "Project__Name", color: "#447DC9" },
      { name: "Project__Name", color: "#D34848" },
    ],
  },
  {
    title: "All Campaigns",
    items: [
      { name: "Project__Name", color: "#E7D665" },
      { name: "Project__Name", color: "#447DC9" },
      { name: "Project__Name", color: "#D34848" },
      { name: "Project__Name", color: "#E7D665" },
      { name: "Project__Name", color: "#447DC9" },
    ],
  },
  {
    title: "Free Campaigns",
    items: [
      { name: "Project__Name", color: "#E7D665" },
      { name: "Project__Name", color: "#447DC9" },
    ],
  },
];

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