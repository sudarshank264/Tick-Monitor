import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    console.log(formData);
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/attachments`,
      formData
    );
    return NextResponse.json({ success: true, response: res });
  } catch (err) {
    return NextResponse.json({ success: false, error: err });
  }
};
