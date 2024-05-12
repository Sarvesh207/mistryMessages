import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 400,
      }
    );
  }

  const userId = user._id;

  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );


    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update user status to accept messsages",
        },
        {
          status: 401,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message acceptance status updated successfully",
        updatedUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to update user status to accept messsages",
      },
      {
        status: 500,
      }
    );
  }
}


export async function GET(request: Request) {
  // Connect to the database
  await dbConnect();

  // Get the user session
  const session = await getServerSession(authOptions);

  const user = session?.user;
  // Check if the user is authenticated
  if (!session || !user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    // Retrieve the user from the database using the ID

    const foundUser = await UserModel.findById(user._id);


    if (!foundUser) {

      // User not found
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }


    // Return the user's message acceptance status

    return Response.json(
      {
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving message acceptance status:", error);
    return Response.json(
      { success: false, message: "Error retrieving message acceptance status" },
      { status: 500 }
    );
  }
}
