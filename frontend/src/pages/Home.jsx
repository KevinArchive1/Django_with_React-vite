import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import RecycleBin from "../components/RecycleBin";
import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const [notes, setNotes] = useState([]);
  const [content, setContents] = useState("");
  const [title, setTitles] = useState("");

  const [expandedCard, setExpandedCard] = useState(null);
  const [isRecycleOpen, setIsRecycleOpen] = useState(false); // For Recycle Bin toggle

  // Fetch notes on mount
  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    api.get("/api/notes/")
      .then(res => setNotes(res.data))
      .catch(err => alert(err));
  };

  // Soft delete note
  const deleteNotes = (id) => {
    api.delete(`/api/notes/delete/${id}/`)
      .then(res => {
        if (res.status === 204) {
          alert("Note deleted!");
          if (expandedCard === id) setExpandedCard(null);
          getNotes();
        } else {
          alert("Failed to delete note.");
        }
      })
      .catch(err => alert(err));
  };

  const editNotes = (id, updateTitle, updateContent) => {
    api.put(`/api/notes/edit/${id}/`, { title: updateTitle, content: updateContent })
      .then(res => {
        if (res.status === 200 || res.status === 204) {
          getNotes();
        }
      })
      .catch(err => alert(err));
  };

  const createNotes = (e) => {
    e.preventDefault();
    api.post("/api/notes/", { content, title })
      .then(res => {
        if (res.status === 201) {
          alert("Note created!");
          getNotes();
          setTitles("");
          setContents("");
          setExpandedCard(null); 
        } else {
          alert("Failed to create note.");
        }
      })
      .catch(err => alert(err));
  };

  return (
    <div>
      {/* Navigation */}
      <div className="navigationBar">
        <h4>Welcome</h4>
        <div className="nav-buttons">
          <button onClick={() => setIsRecycleOpen(true)}>Recycle Bin</button>
          <Link to="/logout">
            <button>Logout</button>
          </Link>
        </div>
      </div>

      <div className="Content-Holder">
        <div className="Note-holder">
          <h2>Notes</h2>
          <div className="Notes">

            {/* Create Note Card */}
            <div
              className={`create-note-card ${expandedCard === "create" ? "open" : ""}`}
              onClick={() => setExpandedCard(prev => prev === "create" ? null : "create")}
            >
              {expandedCard !== "create" ? (
                <div className="create-note-collapsed">
                  <img src="/plus.png" alt="Add" className="plus-icon" />
                  <p>Create Note</p>
                </div>
              ) : (
                <form className="CreateNote" onSubmit={createNotes} onClick={(e) => e.stopPropagation()}>
                  <h2>Create a Note</h2>
                  <label>Title:</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitles(e.target.value)}
                  />
                  <label>Content:</label>
                  <textarea
                    required
                    value={content}
                    onChange={(e) => setContents(e.target.value)}
                  />
                  <button type="submit">Submit</button>
                  <button type="button" onClick={() => setExpandedCard(null)}>Cancel</button>
                </form>
              )}
            </div>

            {/* Existing Notes */}
            {notes.map(note => (
              <Note
                key={note.id}
                note={note}
                onEdit={editNotes}
                onDelete={deleteNotes}
                isExpanded={expandedCard === note.id}
                onExpand={() => setExpandedCard(prev => prev === note.id ? null : note.id)}
                disabled={expandedCard !== null && expandedCard !== note.id}
              />
            ))}

          </div>
        </div>
      </div>

      {/* Recycle Bin Overlay */}
      <RecycleBin
        isOpen={isRecycleOpen}
        onClose={() => setIsRecycleOpen(false)}
      />
    </div>
  );
}

export default Home;
