import { useState } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import ReactMarkdown from "react-markdown";

function MarkdownEditor({ note, onSave }) {
  const [content, setContent] = useState(note?.content || "");

  const handleSave = () => {
    onSave({ ...note, content });
  };

  return (
    <div className="markdown-editor">
      <SimpleMDE value={content} onChange={setContent} />
      <button onClick={handleSave}>Save</button>

      <h4>Preview</h4>
      <div className="markdown-preview">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}

export default MarkdownEditor;
