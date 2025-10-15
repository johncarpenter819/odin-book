import React from "react";

const Post = ({ post }) => {
  const { author, content, createdAt, likes = [], comments = [] } = post;

  const formattedDate = new Date(createdAt).toLocaleString();

  return (
    <div className="post-card">
      <div className="post-header">
        <img
          src={author.profilePhotoUrl || "/default-avatar.png"}
          alt={author.username}
          className="post-author-avatar"
        />
        <div className="author-info">
          <span className="author-username">{author.username}</span>
          <span className="post-timestamp">{formattedDate}</span>
        </div>
      </div>

      <div className="post-content">
        <p>{content}</p>
      </div>

      <div className="post-stats">
        <span className="like-count">👍 {likes.length} Likes</span>
        <span className="comments-count">{comments.length} Comments</span>
      </div>

      <div className="post-actions">
        <button className="action-btn">Like</button>
        <button className="action-btn">Comment</button>
        <button className="action-btn">Share</button>
      </div>
    </div>
  );
};

export default Post;
