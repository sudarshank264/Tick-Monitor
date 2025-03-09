import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const response = await axios.get(
      `${process.env.PUBLIC_NEXT_API_URL}/tasks`
    );
    return NextResponse.json({ success: true, response: response.data });
  } catch (err) {
    return NextResponse.json({ success: false, error: err });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    console.log(body);
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/tasks`,
      body
    );
    console.log(response.data);
    return NextResponse.json({ success: true, response: response.data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      error: err,
    });
  }
};
