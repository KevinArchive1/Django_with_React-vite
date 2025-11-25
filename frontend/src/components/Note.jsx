import React, { useState, useEffect, useRef } from "react";

function Note({ note, onDelete, onEdit, isExpanded, onExpand, disabled }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(note.title);
    const [editContent, setEditContent] = useState(note.content);

    const holderRef = useRef(null);
    const formattedDate = new Date(note.create_at).toLocaleDateString("en-PH");

    const toggleExpand = () => {
        if (!isEditing && !disabled) {
            onExpand();
        }
    };

    const handleSave = () => {
        onEdit(note.id, editTitle, editContent);
        setIsEditing(false);
    };

    // Scroll to top when collapsing
    useEffect(() => {
        if (!isExpanded && holderRef.current) {
            holderRef.current.scrollTop = 0;
        }
    }, [isExpanded]);

    return (
        <div
            className={`note-container ${isExpanded ? "expanded" : ""} ${disabled ? "disabled" : ""}`}
            onClick={toggleExpand}
        >
            <div className="note-holder" ref={holderRef}>
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                        <textarea
                            className="content-edit"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </>
                ) : (
                    <>
                        <p className="note-title">{note.title}</p>
                        <div className="note-content">{note.content}</div>
                    </>
                )}
            </div>

            <div className="button-holder">
                <p className="note-date">{formattedDate}</p>
                {isEditing ? (
                    <>
                        <button
                            className="save-button"
                            onClick={(e) => { e.stopPropagation(); handleSave(); }}
                        >
                            Save
                        </button>
                        <button
                            className="cancel-button"
                            onClick={(e) => { e.stopPropagation(); setIsEditing(false); }}
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className="edit-button"
                            onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                            disabled={disabled}
                        >
                            Edit
                        </button>
                        <button
                            className="delete-button"
                            onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
                            disabled={disabled}
                        >
                            Delete
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Note;
