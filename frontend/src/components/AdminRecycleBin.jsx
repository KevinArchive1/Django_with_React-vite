import api from "../api";

function AdminRecycleBin({ selectedUser, deletedNotes, onRestore, onPermanentDelete }) {

    if (!selectedUser) return null;

    const handleRestoreClick = (note) => {
        api.post(`/api/admin/notes/restore/${note.id}/`)
            .then(() => onRestore(note))
            .catch(err => console.error(err));
    };

    const handlePermanentDeleteClick = (note) => {
        api.delete(`/api/admin/notes/permanent-delete/${note.id}/`)
            .then(() => onPermanentDelete(note.id))
            .catch(err => console.error(err));
    };

    return (
        <div className="admin-recycle-bin">
            <h3>{selectedUser.username}'s Deleted Notes</h3>
            {deletedNotes.length === 0 ? (
                <p>No deleted notes.</p>
            ) : (
                deletedNotes.map(note => (
                    <div key={note.id} className="note-item deleted">
                        <h4>{note.title}</h4>
                        <p>{note.content}</p>
                        <button onClick={() => handleRestoreClick(note)}>Restore</button>
                        <button onClick={() => handlePermanentDeleteClick(note)}>Delete Permanently</button>
                    </div>
                ))
            )}
        </div>
    );
}

export default AdminRecycleBin;
