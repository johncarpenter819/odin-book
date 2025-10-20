import React, { useState } from "react";
import CommentModal from "../CommentModal";
import { togglePostLike } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Post = ({ post: initialPost }) => {
  const { currentUser } = useAuth();
  const [post, setPost] = useState(initialPost);
  const { author, content, createdAt, likes = [], comments = [] } = post;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formattedDate = new Date(createdAt).toLocaleString();
  const profilePath = `/profile/${author.username}`;

  const currentUserId = currentUser ? currentUser.id : null;
  const isLiked = currentUserId
    ? likes.some((like) => like.authorId === currentUserId)
    : false;

  const handleCommentClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLikeClick = async () => {
    if (!currentUser) {
      alert("You must be logged in to like a post.");
      return;
    }

    try {
      const newLikes = isLiked
        ? likes.filter((like) => like.authorId !== currentUserId)
        : [...likes, { authorId: currentUserId }];

      setPost((prevPost) => ({ ...prevPost, likes: newLikes }));

      const response = await togglePostLike(post.id);

      console.log(`Successfully like/unliked post ${post.id}`, response.action);
    } catch (error) {
      console.error("Error toggling like:", error);
      setPost(initialPost);
      alert("Failed to toggle like. Please try again.");
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <Link to={profilePath} className="post-author-link">
          <img
            src={author.profilePhotoUrl || "/default-avatar.png"}
            alt={author.username}
            className="post-author-avatar"
          />
          <div className="author-info">
            <span className="author-username">{author.username}</span>
            <span className="post-timestamp">{formattedDate}</span>
          </div>
        </Link>
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
