import axios from "axios";
import { parseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const cookiesString = req.headers.get("cookie");
    if (cookiesString === null) {
      return NextResponse.json({ success: false, message: "No user Found!" });
    }
    const cookies = parseCookie(cookiesString);
    if (!cookies.has("accessToken")) {
      return NextResponse.json({ success: false, message: "No user Found!" });
    }
    const token = cookies.get("accessToken");
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("=====>", response.data);
    if (!response.data.user) {
      return NextResponse.json({
        success: false,
        message: response.data.message,
      });
    }
    return NextResponse.json({ success: true, response: response.data });
  } catch (err) {
    console.error({ success: false, error: err });
    return NextResponse.json({ success: false, error: err });
  }
};
