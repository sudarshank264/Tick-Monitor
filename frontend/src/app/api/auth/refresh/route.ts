import axios from "axios";
import { NextResponse } from "next/server";
import { parseCookies, setCookie } from "nookies";

export const POST = async (req: Request) => {
  try {
    const cookies = parseCookies({ req });
    const storedRefreshToken = cookies.refreshToken;

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {}, {
        headers: {
          'Authorization': `Bearer ${storedRefreshToken}`
        }
      }
    );
    const { accessToken, refreshToken } = response.data;
    setCookie({ res: NextResponse }, "accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60,
      path: "/",
    });
    setCookie({ res: NextResponse }, "refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 150,
      path: "/",
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err });
  }
};
