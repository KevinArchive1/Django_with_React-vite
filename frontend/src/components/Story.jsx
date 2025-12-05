// src/components/Story.jsx
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import SimpleMDE from "react-simplemde-editor";
import Chapter from "./Chapter";
import "easymde/dist/easymde.min.css";

function Story({
  story,
  onEditStory,
  onAddChapter,
  onDeleteStory,
  disabled = false,
  refresh,
  isExpanded,
  onExpand,
  onClose,
  showCloseButton = false,
  readOnly = false, // Used in Discover
}) {
  const [isEditingStory, setIsEditingStory] = useState(false);
  const [editTitle, setEditTitle] = useState(story.title);
  const [editContent, setEditContent] = useState(story.content || "");
  const [editGenre, setEditGenre] = useState(story.genre || "");
  const [activeChapterId, setActiveChapterId] = useState(
    story.chapters?.length > 0 ? story.chapters[0].id : null
  );

  const handleSaveStory = () => {
    onEditStory(story.id, editTitle, editContent, editGenre);
    setIsEditingStory(false);
  };

  const handleAddChapter = (e) => {
    e.stopPropagation();
    onAddChapter(story.id);
  };

  // ========================================================================
  // READ-ONLY MODE → Discover Page (Public Stories)
  // ========================================================================
  if (readOnly) {
    return (
      <div
        className={`story-container readonly ${isExpanded ? "expanded" : ""}`}
        onClick={isExpanded ? undefined : onExpand}
      >
        {/* ==================== COLLAPSED VIEW (Card Preview) ==================== */}
        {!isExpanded && (
          <div className="story-header">
            <h2>{story.title}</h2>
            <p className="author">by {story.author_username || "Unknown"}</p>
            {story.genre && <span className="genre">{story.genre || "Unknown"}</span>}

            {/* Short synopsis preview — only shown when collapsed */}
            {story.content && (
              <div className="synopsis-preview">
                <ReactMarkdown>
                  {story.content.length > 180
                    ? story.content.slice(0, 180) + "..."
                    : story.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        )}

        {/* ==================== EXPANDED VIEW (Full Popup) ==================== */}
        {isExpanded && (
          <div className="expanded-content" onClick={(e) => e.stopPropagation()}>

            {showCloseButton && (
              <button
                className="close-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose?.();
                }}
              >
                ×
              </button>
            )}


            <h2>{story.title}</h2>
            <p className="author">by {story.author_username || "Unknown"}</p>
            {story.genre && <span className="genre">{story.genre || "Unknown"}</span>}


            <div className="story-content">
              <h3>Synopsis:</h3>
              <div className="story-description">
                <ReactMarkdown>
                  {story.content || "No synopsis available."}
                </ReactMarkdown>
              </div>
            </div>

            {/* Chapters */}
            {story.chapters?.length > 0 ? (
              <div className="chapter-holder">
                <div className="chapter-nav">
                  {story.chapters.map((chapter) => (
                    <button
                      key={chapter.id}
                      className={chapter.id === activeChapterId ? "active" : ""}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveChapterId(chapter.id);
                      }}
                    >
                      Chapter {chapter.chapter_number}
                      {chapter.title && `: ${chapter.title}`}
                    </button>
                  ))}
                </div>

                {/* Active Chapter */}
                {story.chapters.map((chapter) =>
                  chapter.id === activeChapterId ? (
                    <Chapter
                      key={chapter.id}
                      chapter={chapter}
                      storyId={story.id}
                      disabled={true}
                      refresh={refresh}
                      readOnly={true}
                    />
                  ) : null
                )}
              </div>
            ) : (
              <p style={{ textAlign: "center", color: "#777", margin: "2rem 0", fontStyle: "italic" }}>
                No chapters published yet.
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`story-container ${isExpanded ? "expanded" : ""}`}
      onClick={isExpanded ? undefined : onExpand}
    >
      {/* Collapsed View */}
      {!isExpanded && (
          <div className="story-header">
            <h2>{story.title}</h2>
            <p className="author">by {story.author_username || "Unknown"}</p>
            {story.genre && <span className="genre">{story.genre || "Unknown"}</span>}

            {/* Short synopsis preview — only shown when collapsed */}
            {story.content && (
              <div className="synopsis-preview">
                <ReactMarkdown>
                  {story.content.length > 180
                    ? story.content.slice(0, 180) + "..."
                    : story.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        )}

      {/* Expanded View */}
      {isExpanded && (
        <div className="expanded-content" onClick={(e) => e.stopPropagation()}>
          {/* Close Button */}
          {showCloseButton && (
            <button
              className="close-btn"
              onClick={(e) => {
                e.stopPropagation();
                onClose?.();
              }}
            >
              ×
            </button>
          )}

          {/* Editing Mode */}
          {isEditingStory ? (
            <>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Story Title"
                style={{ fontSize: "2rem", fontWeight: "bold", width: "100%", marginBottom: "1rem" }}
              />
              <input
                type="text"
                value={editGenre}
                onChange={(e) => setEditGenre(e.target.value)}
                placeholder="Genre (e.g. Fantasy, Romance)"
                style={{ width: "100%", marginBottom: "1rem" }}
              />
              <SimpleMDE
                value={editContent}
                onChange={setEditContent}
                options={{
                  spellChecker: false,
                  placeholder: "Write your story synopsis here...",
                }}
              />
              <div className="button-group">
                <button onClick={handleSaveStory} disabled={disabled}>
                  Save Story
                </button>
                <button
                  onClick={() => {
                    setIsEditingStory(false);
                    setEditTitle(story.title);
                    setEditContent(story.content || "");
                    setEditGenre(story.genre || "");
                  }}
                  disabled={disabled}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>

              <h2>{story.title}</h2>
              <p className="author">by {story.author_username || "Unknown"}</p>
              {story.genre && <span className="genre">{story.genre || "Unknown"}</span>}
              <div className="story-content">
                <h3>Synopsis:</h3>
                <div className="story-description">
                  <ReactMarkdown>
                    {story.content || "No synopsis available."}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Edit / Delete Buttons */}
              <div className="button-holder">
                <button onClick={() => setIsEditingStory(true)} disabled={disabled}>
                  Edit Story
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteStory(story.id);
                  }}
                  disabled={disabled}
                >
                  Delete Story
                </button>
              </div>
            </>
          )}

          {/* Chapters */}
          <div className="chapter-holder">
            <div className="chapter-nav">
              {story.chapters?.map((chapter) => (
                <button
                  key={chapter.id}
                  className={chapter.id === activeChapterId ? "active" : ""}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveChapterId(chapter.id);
                  }}
                >
                  Chapter {chapter.chapter_number}
                  {chapter.title && `: ${chapter.title}`}
                </button>
              ))}
              <button onClick={handleAddChapter}>+ Add Chapter</button>
            </div>

            {/* Active Chapter */}
            {story.chapters?.map((chapter) =>
              chapter.id === activeChapterId ? (
                <Chapter
                  key={chapter.id}
                  chapter={chapter}
                  storyId={story.id}
                  disabled={disabled}
                  refresh={refresh}
                />
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Story;