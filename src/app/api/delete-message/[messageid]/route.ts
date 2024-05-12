import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  const messageId = params.messageid;

  await dbConnect();
  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;
  console.log(user);

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const updateResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );
    
    console.log(updateResult)
    if (updateResult.modifiedCount === 0) {
      return Response.json(
        { message: "Message not found or already deleted", success: false },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message Deleted",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error is delete message route", error);
    return Response.json(
      {
        success: false,
        mesfsage: "Error deleting message",
      },
      {
        status: 500,
      }
    );
  }
}
