/**
 * @name PostAdd
 * @description
 * @author darcrand
 */

"use client";

import { useState } from "react";

export default function PostAdd() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const onSubmit = async () => {
    const res = await fetch("/api/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
      }),
    });

    const data = await res.json();

    console.log(data);
  };

  return (
    <>
      <h1>PostAdd</h1>

      <input
        type="text"
        className="w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <hr />

      <textarea
        className="w-full"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>

      <button type="button" className="block m-4" onClick={onSubmit}>
        Submit
      </button>
    </>
  );
}
