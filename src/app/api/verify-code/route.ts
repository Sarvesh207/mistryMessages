import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const requestBody = await request.json();
    console.log(requestBody)

    const username = requestBody.username;
    const code = requestBody.code;

    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 400,
        }
      );
    }

    const isCodevalid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodevalid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "Account verified successfully",
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code has expired please singup agaian to get new code ",
        },
        {
          status: 400,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Inncorrect verification code",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.log("Error verifying user", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      {
        status: 500,
      }
    );
  }
}
