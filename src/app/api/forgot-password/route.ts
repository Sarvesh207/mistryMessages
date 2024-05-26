import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import bcrypt from "bcryptjs";
export async function POST(request: Request) {
  await dbConnect();
  

  try {
    const { email, confirmPassword, password, } = await request.json();
    console.log("email",email, "password:",password, "newPassword:", confirmPassword)

    const user = await UserModel.findOne({ email });

    console.log(user)

    if (!user) {
      return Response.json(
        {
          succes: false,
          message: "User not found",
        },
        {
          status: 400,
        }
      );
    }

    // hash the password

    const hashPassword = await bcrypt.hash(password, 10);

    //  update the user password

    user.password = hashPassword;
    await user.save();

    return Response.json({
      success: true,
      message: "Password updated Successfully",
    });
  } catch (error) {
    console.error("Error while updating", error);
    return Response.json(
      {
        success: false,
        message: "Error Updating password",
      },
      {
        status: 500,
      }
    );
  }
}
