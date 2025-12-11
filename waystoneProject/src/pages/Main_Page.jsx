/* Complete */
import React from "react";
import "./pages-css/CSS.css";
import "./pages-css/Main_Page.css";
import UploadIMG_Logo from "../assets/PlaceholderImage.jpg";
import Required_Logo from "../assets/Required_Logo.webp";
import Delete_Logo from "../assets/Delete_Logo.webp";
import Add_Logo from "../assets/Add_Logo.webp";
import Placeholder from "../assets/PlaceholderImage.jpg";
import Sidebar from "../components/UI/Sidebar";
import Header from "../components/UI/Header";
import Footer from "../components/UI/Footer";

function Main_Page() {
  return (
    <div className="page-layout">
      <Sidebar />

      <div className="main-wrapper">
        <Header title="Welcome" />

        <div id="content">
          <b>Recent Campaigns</b>

          <div id="box-section">
            <div id="box-text">
              <p>Project_name &nbsp;</p>
              <div id="box"></div>
            </div>

            <div id="box-text">
              <p>Project_name &nbsp;</p>
              <div id="box"></div>
            </div>

            <div id="box-text">
              <p>Project_name &nbsp;</p>
              <div id="box"></div>
            </div>

            <div id="box-text">
              <p>Project_name &nbsp;</p>
              <div id="box"></div>
            </div>
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