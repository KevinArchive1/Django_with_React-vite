import { useState } from "react";
import ReactMarkdown from "react-markdown";
import SimpleMDE from "react-simplemde-editor";
import Chapter from "./Chapter";

function Story({
  story,
  onEditStory,
  onAddChapter,
  onDeleteStory,
  disabled,
  refresh,
  isExpanded,
  onExpand,
  showCloseButton,
  onClose
}) {
  const [isEditingStory, setIsEditingStory] = useState(false);
  const [editTitle, setEditTitle] = useState(story.title);
  const [editContent, setEditContent] = useState(story.content);
  const [editGenre, setEditGenre] = useState(story.genre || "");
  const [isContentFocused, setIsContentFocused] = useState(false);
  const [activeChapter, setActiveChapter] = useState(
    story.chapters.length ? story.chapters[0].id : null
  );

  const handleSaveStory = () => {
    onEditStory(story.id, editTitle, editContent, editGenre);
    setIsEditingStory(false);
    setIsContentFocused(false);
  };

  const handleAddChapter = () => {
    onAddChapter(story.id);
  };

  return (
    <div
      className={`story-container ${isExpanded ? "expanded" : ""}`}
      onClick={() => {
        if (!isExpanded) onExpand(); // Only expand if not already expanded
      }}
    >
      {isEditingStory ? (
        <>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            disabled={disabled}
            onFocus={() => setIsContentFocused(false)}
          />
          <input
            type="text"
            value={editGenre}
            onChange={(e) => setEditGenre(e.target.value)}
            disabled={disabled}
            placeholder="Genre"
          />
          <SimpleMDE
            value={editContent}
            onChange={setEditContent}
            options={{
              spellChecker: false,
              autofocus: isContentFocused,
              placeholder: "Write your story description...",
              status: false,
            }}
            onFocus={() => setIsContentFocused(true)}
          />
          <div className="button-holder">
            <button onClick={handleSaveStory}>Save Story</button>
            <button
              onClick={() => {
                setIsEditingStory(false);
                setIsContentFocused(false);
              }}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h2>{story.title}</h2>
          <p className="story-author">by {story.author_username}</p>
          {story.genre && <p className="story-genre">Genre: {story.genre}</p>}
          <h3>Synopsis:</h3>
          <div className="story-description">
            <ReactMarkdown>{story.content}</ReactMarkdown>
          </div>

          <div className="button-holder">
            <button onClick={() => setIsEditingStory(true)} disabled={disabled}>
              Edit Story
            </button>
            <button onClick={() => onDeleteStory(story.id)} disabled={disabled}>
              Delete Story
            </button>
            {showCloseButton && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
              >
                Close
              </button>
            )}
          </div>
        </>
      )}

      {/* Chapters Section – Always Visible */}
      <div className="chapter-holder">
        <div className="chapter-nav">
          {story.chapters.map((chapter) => (
            <button
              key={chapter.id}
              className={chapter.id === activeChapter ? "active" : ""}
              onClick={(e) => {
                e.stopPropagation();
                setActiveChapter(chapter.id);
              }}
            >
              Chapter {chapter.chapter_number}
            </button>
          ))}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddChapter();
            }}
          >
            + Add Chapter
          </button>
        </div>

        {story.chapters.map(
          (chapter) =>
            chapter.id === activeChapter && (
              <Chapter
                key={chapter.id}
                chapter={chapter}
                storyId={story.id}
                disabled={disabled}
                refresh={refresh}
              />
            )
        )}
      </div>
    </div>
  );
}

export default Story;
