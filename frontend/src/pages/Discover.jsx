// src/pages/Discover.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Story from "../components/Story";
import "../styles/Discover.css";

function Discover() {
  const [publicStories, setPublicStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState(null); // ← This makes cards expandable!

  useEffect(() => {
    api
      .get("/api/stories/public/")
      .then((res) => {
        setPublicStories(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load public stories:", err);
        setLoading(false);
      });
  }, []);

  const handleCardToggle = (cardId) => {
    setExpandedCard((prev) => (prev === cardId ? null : cardId));
  };

  return (
    <div className="discover-page">
      <div className="discover-header">
      <div>
        <h1>Discover Stories</h1>
        <p>Browse stories published by the Nobela community</p>
      </div>
      <Link to="/">
          <button className="back-home-btn">
            Back to My Stories
          </button>
        </Link>
      </div>

      {/* Loading & Empty State */}
      {loading ? (
        <div className="loading">Loading published stories...</div>
      )  : publicStories.length === 0 ? (
        <p className="no-stories">No published stories yet. Be the first to share!</p>
      ) : (
        <div className="Notes"> {/* ← Same class as Home.jsx */}
          {publicStories.map((story) => (
            <Story
              key={story.id}
              story={story}
              readOnly={true}                              // ← No edit/delete/add chapter
              isExpanded={expandedCard === story.id}       // ← Controls expand
              onExpand={() => handleCardToggle(story.id)}  // ← Makes it clickable!
              onClose={() => setExpandedCard(null)}        // ← Close button works
              showCloseButton={true}                       // ← Shows X when expanded
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Discover;