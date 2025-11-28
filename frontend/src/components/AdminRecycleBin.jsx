import React from "react";
import api from "../api";

function AdminRecycleBin({ selectedUser, deletedNotes, onRestore, onPermanentDelete, refresh }) {
  if (!selectedUser) return null;

  const token = localStorage.getItem("access");

  const handleRestoreClick = async (story) => {
    try {
      await api.post(`/api/admin/stories/restore/${story.id}/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh from backend to avoid state mismatch / 404
      refresh();
    } catch (err) {
      console.error("Restore error:", err.response || err);
    }
  };

  const handlePermanentDeleteClick = async (story) => {
    try {
      await api.delete(`/api/admin/stories/permanent-delete/${story.id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh deleted stories list
      refresh();
    } catch (err) {
      console.error("Permanent delete error:", err.response || err);
    }
  };

  return (
    <div className="admin-recycle-bin">
      <h3>{selectedUser.username}'s Deleted Stories</h3>
      {deletedNotes.length === 0 ? (
        <p>No deleted stories.</p>
      ) : (
        deletedNotes.map(story => (
          <div key={story.id} className="note-item deleted">
            <h4>{story.title}</h4>
            <p>{story.content}</p>
            <div className="button-group">
              <button onClick={() => handleRestoreClick(story)}>Restore</button>
              <button onClick={() => handlePermanentDeleteClick(story)}>Delete Permanently</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminRecycleBin;
