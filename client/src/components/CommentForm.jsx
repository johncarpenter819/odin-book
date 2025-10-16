import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { postComment } from "../api/api";

const CommentForm = ({ postId, onCommentPosted }) => {
  const { currentUser } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentUser) {
    return <div className="comment-login-promp">Please log in to comment.</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (commentText.trim() === "") return;

    setIsSubmitting(true);

    try {
      const newComment = await postComment(postId, commentText);

      if (onCommentPosted) {
        onCommentPosted(newComment);
      }

      setCommentText("");
    } catch (erorr) {
      console.erorr("Failed to post comment:", erorr);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <img
        src={currentUser.profilePhotoUrl || "/default-avatar.png"}
        alt={currentUser.username}
        className="comment-author-avatar"
      />
      <div className="comment-input-wrapper">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          className="comment-input-field"
          disabled={isSubmitting}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="comment-submit-btn"
      >
        {isSubmitting ? "Posting..." : "Post"}
      </button>
    </form>
  );
};

export default CommentForm;
