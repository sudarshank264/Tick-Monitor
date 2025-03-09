import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";
import { setCookie } from "nookies";

export const POST = async (req: Request) => {
  try {
    const { email, password } = await req.json();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/signin`,
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
    const nextResponse = NextResponse.json({
      success: true,
      response: { email: response.data.email, accessToken },
    });
    nextResponse.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60,
      path: "/",
    });
    nextResponse.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60,
      path: "/",
    });
    return nextResponse;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err });
  }
};
