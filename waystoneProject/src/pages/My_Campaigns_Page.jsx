import React from "react";
import "./pages-css/CSS.css";
import "./pages-css/My_Campaigns_Page.css";
import Header from "../components/UI/Header";
import Footer from "../components/UI/Footer";
import Sidebar from "../components/UI/Sidebar";

const campaignSections = [
  {
    /* A way to only show the 3 most recent campaigns */
    /* The name and color are dummy date / placeholders (?) */
    title: "Recent Campaigns",
    items: [
      { name: "Project__Name", color: "#303030" },
      { name: "Project__Name", color: "#303030" },
      { name: "Project__Name", color: "#303030" },
      { name: "Project__Name", color: "#303030" },
    ],
  },

  {
    title: "All Campaigns",
    items: [
      { name: "Project__Name", color: '#303030' },
      { name: "Project__Name", color: "#303030" },
      { name: "Project__Name", color: "#303030" },
      { name: "Project__Name", color: "#303030" },
      { name: "Project__Name", color: "#303030" },
      { name: "Project__Name", color: "#303030" },
    ],
  },

  {
    title: "Free Campaigns",
    items: [
      { name: "Project__Name", color: "#E7D665" },
      { name: "Project__Name", color: "#447DC9" },
      { name: "Project__Name", color: "#D34848" },
      { name: "Project__Name", color: "#E7D665" },
      { name: "Project__Name", color: "#447DC9" },
      { name: "Project__Name", color: "#D34848" },
    ],
  },
];

function My_Campaigns_Page() 
{
  return (
    <div>
      
      <Sidebar />

      <div id="main">
      
      <Header title="My Campaigns" />

        <div id="content">
          {campaignSections.map((section) => (

            <section key={section.title}>

              {/* The title per section of campaigns */}
              <b>{section.title}</b>

              {/* The area that holds the campaign boxes */}
              <div id="box-section">
                {section.items.map((item, idx) => (
                  /* A campaigns box */
                  <div id="box-text" key={`${section.title}-${idx}`}>
                    
                    {/* The campaigns project name */}
                    <p>{item.name}&#10240;</p>
                    
                    {/* The bottom part of the box (the white) which contains the archive button */}
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