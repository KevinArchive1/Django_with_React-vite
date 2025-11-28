import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import AdminRecycleBin from "../components/AdminRecycleBin";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import MarkdownEditor from "../components/MarkdownEditor";

function AdminHome() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userNotes, setUserNotes] = useState([]);
    const [deletedNotes, setDeletedNotes] = useState([]); // new: shared with RecycleBin
    const [expandedNoteId, setExpandedNoteId] = useState(null);
    const [editingNote, setEditingNote] = useState(null);

    const navigate = useNavigate();

    // Fetch users
    useEffect(() => {
        api.get("/api/admin/users/")
            .then(res => setUsers(res.data))
            .catch(err => console.error(err));
    }, []);

    // Fetch notes and deleted notes for selected user
    const fetchUserNotes = (userId) => {
        // active notes
        api.get(`/api/admin/users/${userId}/notes/`)
            .then(res => setUserNotes(res.data))
            .catch(err => console.error(err));

        // deleted notes
        api.get(`/api/admin/recycle/?user_id=${userId}`)
            .then(res => setDeletedNotes(res.data))
            .catch(err => console.error(err));
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
        fetchUserNotes(user.id);
        setExpandedNoteId(null);
    };

    // Edit note
    const handleEdit = (id, title, content) => {
        api.patch(`/api/admin/notes/edit/${id}/`, { title, content })
            .then(() => fetchUserNotes(selectedUser.id))
            .catch(err => console.error(err));
    };

    // Soft delete note
    const handleDelete = (id) => {
        api.post(`/api/admin/notes/delete/${id}/`)
            .then(res => {
                // move note from userNotes to deletedNotes in real-time
                const deletedNote = userNotes.find(n => n.id === id);
                if (deletedNote) {
                    setUserNotes(prev => prev.filter(n => n.id !== id));
                    setDeletedNotes(prev => [deletedNote, ...prev]);
                }
            })
            .catch(err => console.error(err));
    };

    // Restore note (called from AdminRecycleBin)
    const handleRestore = (restoredNote) => {
        setDeletedNotes(prev => prev.filter(n => n.id !== restoredNote.id));
        setUserNotes(prev => [restoredNote, ...prev]);
    };

    // Permanently delete note (called from AdminRecycleBin)
    const handlePermanentDelete = (deletedNoteId) => {
        setDeletedNotes(prev => prev.filter(n => n.id !== deletedNoteId));
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div className="Content-Holder">
            <div className="admin-sidebar">
                <h3>Users</h3>
                <ul>
                    {users.map(user => (
                        <li
                            key={user.id}
                            onClick={() => handleUserClick(user)}
                            className={selectedUser?.id === user.id ? "selected-user" : ""}
                        >
                            {user.username}
                        </li>
                    ))}
                </ul>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>

            <div className="Note-holder">
                <h2>{selectedUser ? `${selectedUser.username}'s Notes` : "Select a user"}</h2>
                <div className="Notes">
                    {userNotes.map(note => (
                        <Note
                            key={note.id}
                            note={note}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            isExpanded={expandedNoteId === note.id}
                            onExpand={() =>
                                setExpandedNoteId(prev => (prev === note.id ? null : note.id))
                            }
                            disabled={expandedNoteId !== null && expandedNoteId !== note.id}
                        />
                    ))}
                </div>

                {/* Recycle Bin */}
                {selectedUser && (
                    <AdminRecycleBin
                        selectedUser={selectedUser}
                        deletedNotes={deletedNotes}
                        onRestore={handleRestore}
                        onPermanentDelete={handlePermanentDelete}
                    />
                )}
            </div>
        </div>
    );
}

export default AdminHome;
