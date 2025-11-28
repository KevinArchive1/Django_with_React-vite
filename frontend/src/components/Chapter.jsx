import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import SimpleMDE from "react-simplemde-editor";
import api from "../api";

function Chapter({ chapter, storyId, disabled, refresh }) {
  const [isEditingChapter, setIsEditingChapter] = useState(false);
  const [editTitle, setEditTitle] = useState(chapter.title);
  const [editContent, setEditContent] = useState(chapter.content);
  const [isContentFocused, setIsContentFocused] = useState(false); // new state

  const handleSaveChapter = () => {
    api.patch(`/api/chapters/edit/${chapter.id}/`, {
      title: editTitle,
      content: editContent
    })
      .then(() => {
        setIsEditingChapter(false);
        setIsContentFocused(false); // reset
        if (refresh) refresh();
      })
      .catch(err => alert(err.response?.data || err.message));
  };

  return (
    <div className="chapter-container">
      {isEditingChapter ? (
        <>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            disabled={disabled}
            onFocus={() => setIsContentFocused(false)} // focus is on title
          />
          <SimpleMDE
            value={editContent}
            onChange={setEditContent}
            options={{
              spellChecker: false,
              autofocus: isContentFocused, // only autofocus if user clicked content
              placeholder: "Write your chapter content...",
              status: false,
            }}
            onFocus={() => setIsContentFocused(true)} // user clicked content
          />
          <button onClick={handleSaveChapter}>Save Chapter</button>
          <button onClick={() => {
            setIsEditingChapter(false);
            setIsContentFocused(false);
          }}>Cancel</button>
        </>
      ) : (
        <>
          <h3>{chapter.title}</h3>
          <div className="chapter-content">
            <ReactMarkdown>{chapter.content}</ReactMarkdown>
          </div>
          <button onClick={() => setIsEditingChapter(true)} disabled={disabled}>
            Edit Chapter
          </button>
        </>
      )}
    </div>
  );
}

export default React.memo(Chapter);
