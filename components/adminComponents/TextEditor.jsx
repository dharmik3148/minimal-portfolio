"use client";

import dynamic from "next/dynamic";
import React, { useRef, useState } from "react";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const TextEditor = ({ content, setContent }) => {
  const editor = useRef(null);

  const [config, setConfig] = useState({
    height: 500,
    readOnly: false,
  });

  const handleTextEditorChange = (content) => {
    setContent(content);
  };

  return (
    <div>
      <JoditEditor
        value={content}
        config={config}
        ref={editor}
        onChange={handleTextEditorChange}
        className="text-black"
      />
    </div>
  );
};

export default TextEditor;
