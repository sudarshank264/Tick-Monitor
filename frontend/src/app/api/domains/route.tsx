import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const response = await axios.get(
      `${process.env.PUBLIC_NEXT_API_URL}/domains`
    );
    console.log(response.data);
    return NextResponse.json({ success: true, response: response.data });
  } catch (err) {
    return NextResponse.json({ success: false, error: err });
  }
};
