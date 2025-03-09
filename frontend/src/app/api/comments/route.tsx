import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    console.log(body);
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/comments`,
      body
    ).then(res => {
      console.log(res.data);
      return res;
    });
    return NextResponse.json({ sucess: true, response: response.data });
  } catch (err) {
    return NextResponse.json({ sucess: false, error: err });
  }
};
