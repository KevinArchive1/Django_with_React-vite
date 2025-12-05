import { useState, useEffect } from "react";
import api from "../api";
import Story from "../components/Story";
import AdminRecycleBin from "../components/AdminRecycleBin";
import "../styles/AdminHome.css";
import { useNavigate } from "react-router-dom";

function AdminHome() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userStories, setUserStories] = useState([]);
  const [deletedStories, setDeletedStories] = useState([]);
  const [expandedStoryId, setExpandedStoryId] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const navigate = useNavigate();

  // Fetch all users
  useEffect(() => {
    api.get("/api/admin/users/")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  // Fetch active and deleted stories for a user
  const fetchUserStories = (userId) => {
    api.get(`/api/admin/users/${userId}/stories/`)
      .then(res => setUserStories(res.data))
      .catch(err => console.error(err));

    api.get(`/api/admin/recycle/?user_id=${userId}`)
      .then(res => setDeletedStories(res.data))
      .catch(err => console.error(err));
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    fetchUserStories(user.id);
    setExpandedStoryId(null);
  };

  // Edit story
  const handleEditStory = (id, title, content, genre) => {
    api.patch(`/api/admin/stories/edit/${id}/`, { title, content, genre })
      .then(() => fetchUserStories(selectedUser.id))
      .catch(err => console.error(err));
  };

  // Soft delete story
  const handleDeleteStory = (id) => {
    api.post(`/api/admin/stories/delete/${id}/`)
      .then(() => {
        const deletedStory = userStories.find(s => s.id === id);
        if (deletedStory) {
          setUserStories(prev => prev.filter(s => s.id !== id));
          setDeletedStories(prev => [deletedStory, ...prev]);
        }
      })
      .catch(err => console.error(err));
  };

// Restore story
const handleRestoreStory = async (restoredStory) => {
    try {
      await api.post(`/api/admin/stories/restore/${restoredStory.id}/`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` }
      });
      fetchUserStories(selectedUser.id); // refresh stories and deleted list
    } catch (err) {
      console.error(err);
    }
  };
  
  // Permanently delete story
  const handlePermanentDeleteStory = async (deletedStoryId) => {
    try {
      await api.delete(`/api/admin/stories/permanent-delete/${deletedStoryId}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` }
      });
      fetchUserStories(selectedUser.id); // refresh stories and deleted list
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Refresh function for Story components
  const refreshUserStories = () => {
    if (selectedUser) fetchUserStories(selectedUser.id);
  };

  return (
    <div className="Content-Holder1">
      {/* Sidebar */}
      <div className="admin-sidebar">
      <h3>Users</h3>
        <input
              type="text"
              placeholder="Search user..."
              className="user-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
        <div className="search-holder">
          

          <ul>
            {filteredUsers.map(user => (
              <li
                key={user.id}
                onClick={() => handleUserClick(user)}
                className={selectedUser?.id === user.id ? "selected-user" : ""}
              >
                {user.username}
              </li>
            ))}
          </ul>
        </div>

        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      {/* Stories */}
      <div className="Note-holder1">
        <h2>{selectedUser ? `${selectedUser.username}'s Stories` : "Select a user"}</h2>
        <div className="Notes">
          {userStories.map(story => (
            <Story
              key={story.id}
              story={story}
              isExpanded={expandedStoryId === story.id}
              onExpand={() => setExpandedStoryId(prev => (prev === story.id ? null : story.id))}
              onClose={() => setExpandedStoryId(null)}
              onEditStory={handleEditStory}
              onAddChapter={() => refreshUserStories()} // real-time chapter refresh
              onDeleteStory={handleDeleteStory}
              disabled={expandedStoryId !== null && expandedStoryId !== story.id}
              showCloseButton={true}
              refresh={refreshUserStories}
            />
          ))}
        </div>

        {/* Recycle Bin */}
        {selectedUser && (
          <AdminRecycleBin
            selectedUser={selectedUser}
            deletedNotes={deletedStories}
            onRestore={handleRestoreStory}
            onPermanentDelete={handlePermanentDeleteStory}
            refresh={refreshUserStories}
          />
        )}
      </div>
    </div>
  );
}

export default AdminHome;
