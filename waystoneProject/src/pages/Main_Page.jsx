import React from "react";
import { useAuth } from "../context/AuthContext";
import "./pages-css/CSS.css";
import "./pages-css/Main_Page.css";
import Sidebar from "../components/UI/Sidebar";
import Header from "../components/UI/Header";
import Footer from "../components/UI/Footer";
import Placeholder from "../assets/PlaceholderImage.jpg";

function Main_Page() 
{
  console.log("Main_Page loaded");
  const { user } = useAuth();
  console.log("Context user:", user.uid);
  
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