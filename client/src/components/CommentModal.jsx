import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "../styles/CommentModal.css";
import CommentForm from "./CommentForm";
import { getPostComments } from "../api/api";

const CommentModal = ({ post: initialPost, onClose }) => {
  const [post, setPost] = useState(initialPost);
  const [loadingComments, setLoadingComments] = useState(false);
  if (!post) {
    return null;
  }

  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const fetchedComments = await getPostComments(post.id);

        setPost((prevPost) => ({
          ...prevPost,
          comments: fetchedComments || [],
        }));
      } catch (e) {
        console.error("Failed to fetch comments:", e);
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
  }, [post.id]);

  const handleNewComment = (newComment) => {
    setPost((prevPost) => ({
      ...prevPost,
      comments: [newComment, ...(prevPost.comments || [])],
    }));
  };

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) {
    console.error("Modal root element not found");
    return null;
  }

  const commentsToDisplay = post.comments || [];

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="comment-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">{post.author.username}'s Post</h3>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-post-area">
          {post.mediaUrl && (
            <img
              src={post.mediaUrl}
              alt="Post Media"
              className="modal-post-media"
            />
          )}
          <p className="modal-post-content-text">{post.content}</p>
        </div>
        <div className="modal-comments-area">
          <div className="comment-list-container">
            {loadingComments ? (
              <div className="comment-placeholder">Loading comments...</div>
            ) : commentsToDisplay.length > 0 ? (
              commentsToDisplay.map((comment) => (
                <div key={comment.id} className="single-comment-item">
                  <img
                    src={
                      comment.author?.profilePhotoUrl || "/default-avatar.png"
                    }
                    alt={comment.author?.username}
                  />
                  <p>
                    <strong>
                      {comment.author?.username || "Deleted User"}
                    </strong>
                    : {comment.content}
                  </p>
                </div>
              ))
            ) : (
              <div className="comment-placeholder">
                Be the first to comment!
              </div>
            )}

            <div className="comment-form-container">
              <CommentForm
                postId={post.id}
                onCommentPosted={handleNewComment}
              />
            </div>
          </div>
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default CommentModal;
