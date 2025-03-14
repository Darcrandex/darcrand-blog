import { neon } from "@neondatabase/serverless";
import { customAlphabet } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

// generate id from [a-z0-9]{8}
const generateId = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 8);

type PostDTO = {
  id: string;
  title: string;
  cover?: string;
  content?: string;
};

// get all posts
export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);

  const res = await sql("SELECT * FROM post;");

  return NextResponse.json({
    message: "Success",
    data: res,
  });
}

// insert post
export async function POST(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);

  const body: Omit<PostDTO, "id"> = await req.json();
  const id = generateId(8);
  const res = await sql(
    "INSERT INTO post (id, title, cover, content) VALUES ($1, $2, $3, $4);",
    [id, body.title, body.cover, body.content]
  );

  return NextResponse.json({
    message: "Success",
    data: res,
  });
}
