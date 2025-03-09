import axios from "axios";
import { NextResponse } from "next/server";
import { destroyCookie } from "nookies";

export const POST = async (req: Request) => {
  try {
    await axios.post('${process.env.NEXT_PUBLIC_API_URL}/auth/signout');
    destroyCookie({ res: NextResponse }, "accessToken", { path: "/" });
    destroyCookie({ res: NextResponse }, "refreshToken", { path: "/" });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err });
  }
};
