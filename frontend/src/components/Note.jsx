import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

function Note({ note, onDelete, onEdit, isExpanded, onExpand, disabled }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(note.title);
    const editContentRef = useRef(note.content); // store content in ref to avoid rerender
    const holderRef = useRef(null);

    const formattedDate = new Date(note.create_at).toLocaleDateString("en-PH");

    const toggleExpand = () => {
        if (!isEditing && !disabled) onExpand();
    };

    const handleSave = () => {
        onEdit(note.id, editTitle, editContentRef.current);
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

                        <SimpleMDE
                            value={editContentRef.current}
                            onChange={(value) => (editContentRef.current = value)}
                            options={{
                                spellChecker: false,
                                autofocus: true,
                                placeholder: "Write your story using markdown...",
                                status: false,
                                toolbar: ["bold", "italic", "heading", "|", "quote", "unordered-list", "ordered-list", "|", "preview"],
                            
                            }}
                            className="textarea-holder"
                        />
                    </>
                ) : (
                    <>
                        <p className="note-title">{note.title}</p>
                        <div className="note-content">
                            <ReactMarkdown>{note.content}</ReactMarkdown>
                        </div>
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
