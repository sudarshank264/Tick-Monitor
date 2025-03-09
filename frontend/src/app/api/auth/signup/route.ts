import axios from "axios";
import { NextResponse } from "next/server";
import { setCookie } from "nookies";

export const POST = async (req: Request) => {
  try {
    const { email, password } = await req.json();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
      { email, password }
    );
    console.log(response.data);
    if (response.data.error) {
      return NextResponse.json({
        success: false,
        message: response.data.error.message,
      });
    }
    const { accessToken, refreshToken } = response.data;
    setCookie({ res: NextResponse }, "accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60,
      path: "/",
    });
    setCookie({ res: NextResponse }, "refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60 * 2,
      path: "/",
    });
    return NextResponse.json({ success: true, response: response.data });
  } catch (err) {
    return NextResponse.json({ success: false, error: err });
  }
};
