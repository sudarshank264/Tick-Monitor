"use client";

import React, { useEffect, useState } from "react";
import "./styles.scss";
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import StarterKit from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Blockquote from "@tiptap/extension-blockquote";
import TextStyle from "@tiptap/extension-text-style";
import ListItem from "@tiptap/extension-list-item";
import { Color } from "@tiptap/extension-color";
import Text from "@tiptap/extension-text";

const MyEditor = () => {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: "p-2 bg-white rounded outline-none",
      },
    },
    extensions: [
      Paragraph,
      Document,
      Text,
      StarterKit,
      ListItem,
      Color,
      BulletList,
      OrderedList,
      Blockquote,
      TextStyle,
    ],
    content: `
      <p>
        This is a radically reduced version of Tiptap. It has support for a document, with paragraphs and text. That’s it. It’s probably too much for real minimalists though.
      </p>
      <p>
        The paragraph extension is not really required, but you need at least one node. Sure, that node can be something different.
      </p>
      <ul>
        <li>A list item</li>
        <li>And another one</li>
      </ul>
    `,
  });
  const [isEditor, setIsEditor] = useState();
  useEffect(() => {
    if (editor) {
    }
  }, [editor, isEditor]);
  return (
    <>
      {editor && (
        <BubbleMenu className="bg-white" editor={editor} tippyOptions={{ duration: 100, }}>
          <div className="bg-white shadow-lg px-4 z-[10000] w-full flex gap-2 items-center h-7">
            {/* <div className="flex"> */}
            <input
              type="color"
              onInput={(event) =>
                editor
                  .chain()
                  .focus()
                  .setColor((event.target as any).value as string)
                  .run()
              }
              value={editor.getAttributes("textStyle").color}
              data-testid="setColor"
            />
            <button
              onClick={() => editor.chain().focus().setColor("#958DF1").run()}
              className={`bg-[#958DF1]${
                editor.isActive("textStyle", { color: "#958DF1" }) ? "" : ""
              }`}
              data-testid="setPurple"
            >
              Purple
            </button>
            <button
              onClick={() => editor.chain().focus().setColor("#F98181").run()}
              className={
                editor.isActive("textStyle", { color: "#F98181" })
                  ? "is-active"
                  : ""
              }
              data-testid="setRed"
            >
              Red
            </button>
            <button
              onClick={() => editor.chain().focus().setColor("#FBBC88").run()}
              className={
                editor.isActive("textStyle", { color: "#FBBC88" })
                  ? "is-active"
                  : ""
              }
              data-testid="setOrange"
            >
              Orange
            </button>
            <button
              onClick={() => editor.chain().focus().setColor("#FAF594").run()}
              className={
                editor.isActive("textStyle", { color: "#FAF594" })
                  ? "is-active"
                  : ""
              }
              data-testid="setYellow"
            >
              Yellow
            </button>
            <button
              onClick={() => editor.chain().focus().setColor("#70CFF8").run()}
              className={
                editor.isActive("textStyle", { color: "#70CFF8" })
                  ? "is-active"
                  : ""
              }
              data-testid="setBlue"
            >
              Blue
            </button>
            <button
              onClick={() => editor.chain().focus().setColor("#94FADB").run()}
              className={
                editor.isActive("textStyle", { color: "#94FADB" })
                  ? "is-active"
                  : ""
              }
              data-testid="setTeal"
            >
              Teal
            </button>
            <button
              onClick={() => editor.chain().focus().setColor("#B9F18D").run()}
              className={
                editor.isActive("textStyle", { color: "#B9F18D" })
                  ? "is-active"
                  : ""
              }
              data-testid="setGreen"
            >
              Green
            </button>
            <button
              onClick={() => editor.chain().focus().unsetColor().run()}
              data-testid="unsetColor"
            >
              Unset
            </button>
            {/* </div> */}
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`h-7 px-2 rounded flex items-center justify-center ${
                editor.isActive("bold") ? "font-bold bg-slate-200" : ""
              }`}
            >
              Bold
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`h-7 px-2 rounded flex items-center justify-center ${
                editor.isActive("italic") ? "font-bold bg-slate-200" : ""
              }`}
            >
              Italic
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`h-7 px-2 rounded flex items-center justify-center ${
                editor.isActive("strike") ? "font-bold bg-slate-200" : ""
              }`}
            >
              Strike
            </button>
          </div>
        </BubbleMenu>
      )}
      <EditorContent
        style={{
          outline: "none",
        }}
        className="border-white outline-whitem mx-4"
        editor={editor}
      />
    </>
  );
};

export default MyEditor;
