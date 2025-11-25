import React from "react";
import api from "../api";

function AdminNoteItem({ note, setDeletedNotes }) {
    const restoreNote = () => {
        api.post(`/api/admin/restore/${note.id}/`)
            .then(() => setDeletedNotes(prev => prev.filter(n => n.id !== note.id)))
            .catch(err => alert(err));
    };

    const deleteNotePermanent = () => {
        api.delete(`/api/admin/permanent-delete/${note.id}/`)
            .then(() => setDeletedNotes(prev => prev.filter(n => n.id !== note.id)))
            .catch(err => alert(err));
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
