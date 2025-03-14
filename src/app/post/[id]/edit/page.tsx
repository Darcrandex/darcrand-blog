/**
 * @name PostEdit
 * @description
 * @author darcrand
 */

"use client";
import { useEffect, useState } from "react";

export default function PostEdit(props: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fn = async () => {
      const { id } = await props.params;
      const res = await fetch(`/api/post/${id}`);
      const data = await res.json();
      console.log(data);

      setId(data?.data.id);
      setTitle(data?.data.title);
      setContent(data?.data.content);
    };

    fn();
  }, [props.params]);

  const onSubmit = async () => {
    await fetch(`/api/post/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
      }),
    });
  };

  return (
    <>
      <h1>PostEdit</h1>

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
