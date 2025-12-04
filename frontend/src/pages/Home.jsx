import { useState, useEffect, useRef } from "react";
import api from "../api";
import Story from "../components/Story";
import RecycleBin from "../components/RecycleBin";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import AddImage from "../assets/plus.png"

function Home() {
  const [stories, setStories] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [isRecycleOpen, setIsRecycleOpen] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newGenre, setNewGenre] = useState("");

  const titleRef = useRef(null);

  useEffect(() => {
    fetchStories();
  }, []);

  useEffect(() => {
    // Autofocus on create title when expanded
    if (expandedCard === "create" && titleRef.current) {
      titleRef.current.focus();
    }

    // Scroll back to top when collapsed
    if (expandedCard === null) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [expandedCard]);

  const fetchStories = () => {
    api.get("/api/stories/")
      .then(res => setStories(res.data))
      .catch(err => alert(err));
  };

  const handleCardToggle = (cardId) => {
    setExpandedCard(prev => prev === cardId ? null : cardId);
  };

  const createStory = (e) => {
    e.preventDefault();
    api.post("/api/stories/", { 
      title: newTitle, 
      content: newContent, 
      genre: newGenre 
    })
    .then(res => {
      if (res.status === 201) {
        fetchStories();
        setNewTitle("");
        setNewContent("");
        setNewGenre("");
        setExpandedCard(null);
      }
    })
    .catch(err => alert(err));
  };

  const editStory = (id, title, content, genre) => {
    api.patch(`/api/stories/${id}/edit/`, { title, content, genre })
      .then(res => { if (res.status === 200) fetchStories(); })
      .catch(err => alert(err));
  };

  const deleteStory = (id) => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    api.delete(`/api/notes/delete/${id}/`)
      .then(res => { if (res.status === 204) fetchStories(); })
      .catch(err => alert(err));
  };

  const addChapter = (storyId) => {
    api.post("/api/chapters/create/", { story: storyId })
      .then(res => { if (res.status === 201) fetchStories(); })
      .catch(err => alert(err));
  };

  return (
    <div>
      {/* Navigation */}
      <div className="navigationBar">
        <h4>Welcome</h4>
        <div className="nav-buttons">
          <button onClick={() => setIsRecycleOpen(true)}>Recycle Bin</button>
          <Link to="/logout"><button>Logout</button></Link>
        </div>
      </div>

      <div className="Content-Holder">
        <div className="Note-holder">
          <h2>Stories</h2>
          <div className="Notes">

            {/* Create Story Card */}
            <div
              className={`create-note-card ${expandedCard === "create" ? "open" : ""}`} onClick={() => handleCardToggle("create")}
            >
              {expandedCard !== "create" ? (
                <div
                  className="create-note-collapsed"
                  
                >
                  <img src={AddImage} alt="Add" className="plus-icon" />
                  <p>Create Story</p>
                </div>
              ) : (
                <form
                  onSubmit={createStory}
                  onClick={e => e.stopPropagation()}
                >
                  <h2>Create a Story</h2>

                  <label>Title:</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    ref={titleRef}
                  />

                  <label>Genre:</label>
                  <input
                    type="text"
                    required
                    value={newGenre}
                    onChange={e => setNewGenre(e.target.value)}
                  />

                  <label>Description:</label>
                  <textarea
                    required
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                  />

                  <div className="button-holder-create">
                    <button className="submit" type="submit">Submit</button>
                    <button className="close" type="button" onClick={() => setExpandedCard(null)}>
                      Close
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Existing Stories */}
            {stories.map(story => (
              <Story
                key={story.id}
                story={story}
                isExpanded={expandedCard === story.id}
                onExpand={() => handleCardToggle(story.id)}
                onEditStory={editStory}
                onAddChapter={addChapter}
                onDeleteStory={deleteStory}
                disabled={expandedCard !== null && expandedCard !== story.id}
                refresh={fetchStories}
                showCloseButton={true} // new prop
                onClose={() => setExpandedCard(null)} // new prop
              />
            ))}

          </div>
        </div>
      </div>

      <RecycleBin
        isOpen={isRecycleOpen}
        onClose={() => setIsRecycleOpen(false)}
        refresh={fetchStories}
      />
    </div>
  );
}

export default Home;
