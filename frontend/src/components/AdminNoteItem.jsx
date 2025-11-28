import React from "react";
import api from "../api";

function AdminNoteItem({ note, refresh }) {
    const token = localStorage.getItem("access");

    const restoreNote = async () => {
        try {
            await api.post(`/api/admin/stories/restore/${note.id}/`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            refresh(); // refresh list from backend
        } catch (err) {
            alert(err.response?.data || err);
        }
    };

    const deleteNotePermanent = async () => {
        try {
            await api.delete(`/api/admin/stories/permanent-delete/${note.id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            refresh(); // refresh list from backend
        } catch (err) {
            alert(err.response?.data || err);
        }
    };

    return (
        <div className="admin-note-item">
            <h4>{note.title}</h4>
            <p>{note.content}</p>
            <button onClick={restoreNote}>Restore</button>
            <button onClick={deleteNotePermanent}>Delete Permanently</button>
        </div>
    );
}

export default AdminNoteItem;
