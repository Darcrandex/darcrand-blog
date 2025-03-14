/**
 * @name PostListPage
 * @description
 * @author darcrand
 */

"use client";

import { useEffect, useState } from "react";

type PostDTO = {
  id: string;
  title: string;
  cover?: string;
  content?: string;
};

export default function PostListPage() {
  const [list, setList] = useState<PostDTO[]>([]);

  useEffect(() => {
    fetch("/api/post").then(async (res) => {
      const data = await res.json();
      console.log(data);
      if (Array.isArray(data.data)) {
        setList(data.data);
      }
    });
  }, []);

  const onRemove = async (id: string) => {
    await fetch(`/api/post/${id}`, {
      method: "DELETE",
    });
  };

  return (
    <>
      <h1>PostListPage</h1>

      <ol>
        {list.map((v) => (
          <li key={v.id}>
            <h2>{v.title}</h2>
            <button type="button" onClick={() => onRemove(v.id)}>
              delete
            </button>
          </li>
        ))}
      </ol>
    </>
  );
}
