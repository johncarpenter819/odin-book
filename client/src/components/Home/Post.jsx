import React, { useState } from "react";
import CommentModal from "../CommentModal";

const Post = ({ post }) => {
  const { author, content, createdAt, likes = [], comments = [] } = post;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formattedDate = new Date(createdAt).toLocaleString();

  const handleCommentClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLikeClick = () => {
    console.log("Liking post:", post.id);
  };

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
        <button onClick={handleLikeClick} className="action-btn">
          Like
        </button>
        <button onClick={handleCommentClick} className="action-btn">
          Comment
        </button>
        <button className="action-btn">Share</button>
      </div>
      {isModalOpen && <CommentModal post={post} onClose={handleCloseModal} />}
    </div>
  );
};

export default Post;
