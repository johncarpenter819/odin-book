import React, { useState, useEffect } from "react";
import LeftSidebar from "../components/Home/LeftSidebar";
import NewsFeedCenter from "../components/Home/NewsFeedCenter";
import RightSidebar from "../components/Home/RightSidebar";
import { getNewsFeed } from "../api/api";
import "../styles/Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const feedData = await getNewsFeed();
        setPosts(feedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching new feed:", err);
        setError("Failed to load feed. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  if (loading) {
    return <div className="loading-container">Loading feed...</div>;
  }

  if (error) {
    return <div className="erorr-message">{error}</div>;
  }

  return (
    <div className="home-page-container">
      <div className="home-content-wrapper">
        <div className="home-left-sidebar">
          <LeftSidebar />
        </div>

        <div className="home-center-feed">
          <NewsFeedCenter posts={posts} />
        </div>

        <div className="home-right-sidebar">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default Home;
