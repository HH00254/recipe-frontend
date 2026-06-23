import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createComment, deleteComment, getComments } from "../services/api";
import "./CommentSection.css";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CommentSection({ recipeId }) {
  const { token, user } = useAuth();
  const [comments, setComments] = useState([]);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getComments(token, recipeId).then(setComments).catch(() => {});
  }, [token, recipeId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const comment = await createComment(token, recipeId, body.trim());
      setComments((prev) => [comment, ...prev]);
      setBody("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(commentId) {
    try {
      await deleteComment(token, recipeId, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="comments">
      <h2 className="comments__heading">
        💬 Comments ({comments.length})
      </h2>

      <form className="comments__form" onSubmit={handleSubmit}>
        <textarea
          className="comments__textarea"
          placeholder="Share your thoughts on this recipe…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={submitting}
        />
        {error && <p className="comments__error">{error}</p>}
        <button className="comments__submit" type="submit" disabled={submitting || !body.trim()}>
          {submitting ? "Posting…" : "Post Comment"}
        </button>
      </form>

      {comments.length === 0 ? (
        <p className="comments__empty">No comments yet. Be the first!</p>
      ) : (
        comments.map((c) => (
          <div key={c.id} className="comment">
            <div className="comment__header">
              <span className="comment__author">{c.user_name || c.user_email}</span>
              <div className="comment__meta">
                <span className="comment__date">{formatDate(c.created_at)}</span>
                {user?.email === c.user_email && (
                  <button
                    className="comment__delete"
                    onClick={() => handleDelete(c.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
            <p className="comment__body">{c.body}</p>
          </div>
        ))
      )}
    </section>
  );
}
