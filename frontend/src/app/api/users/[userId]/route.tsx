import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { userId: string } }
) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${params.userId}`
    );
    console.log(response.data);
    return NextResponse.json({ success: true, response: response.data });
  } catch (err) {
    return NextResponse.json({ success: false, error: err });
  }
};
