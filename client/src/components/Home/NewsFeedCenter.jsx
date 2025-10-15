import React from "react";
import PostComposer from "./PostComposer";
import StoryTray from "./StoryTray";
import Post from "./Post";

const NewsFeedCenter = ({ posts }) => {
  return (
    <div className="news-feed-center">
      <div className="stories-section">
        <StoryTray />
      </div>

      <div className="post-commposer-section">
        <PostComposer />
      </div>

      <div className="feed-posts">
        {posts.length > 0 ? (
          posts.map((post) => <Post key={post.id} post={post} />)
        ) : (
          <p className="no-posts-message">
            Follow people to see posts in your feed
          </p>
        )}
      </div>
    </div>
  );
};

export default NewsFeedCenter;
