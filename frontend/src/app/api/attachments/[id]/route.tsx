import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/attachments/${params.id}`
    );
    return NextResponse.json({ success: true, response: res });
  } catch (err) {
    return NextResponse.json({ success: false, error: err });
  }
};
