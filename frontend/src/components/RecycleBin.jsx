import { useEffect, useState } from "react";
import api from "../api";
import "../styles/RecycleBin.css";

function RecycleBin({ isOpen, onClose, refresh }) {  // <-- add refresh prop
  const [deletedNotes, setDeletedNotes] = useState([]);

  const fetchDeletedNotes = () => {
    api.get("/api/notes/deleted/")
      .then(res => setDeletedNotes(res.data))
      .catch(err => alert(err.response?.data || err.message));
  };

  useEffect(() => {
    if (isOpen) fetchDeletedNotes();
  }, [isOpen]);

  const restoreNote = (id) => {
    api.patch(`/api/notes/restore/${id}/`)
      .then(() => {
        fetchDeletedNotes(); // refresh recycle bin
        if (refresh) refresh(); // <-- refresh main Home list
      })
      .catch(err => alert(err.response?.data || err.message));
  };

  const permanentDelete = (id) => {
    api.delete(`/api/notes/permanent-delete/${id}/`)
      .then(() => fetchDeletedNotes())
      .catch(err => alert(err.response?.data || err.message));
  };

  if (!isOpen) return null;

  return (
    <div className="recycle-bin-overlay">
      <div className="recycle-bin-container">
        <h3>Recycling Bin</h3>
        <button className="close-btn" onClick={onClose}>X</button>

        {deletedNotes.length === 0 && <p>No deleted notes</p>}

        <div className="deleted-notes-list">
          {deletedNotes.map(note => (
            <div key={note.id} className="note-container">
              <p className="note-title">{note.title}</p>
              <div className="note-content">{note.content}</div>
              <button onClick={() => restoreNote(note.id)}>Restore</button>
              <button onClick={() => permanentDelete(note.id)}>Delete Permanently</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecycleBin;
