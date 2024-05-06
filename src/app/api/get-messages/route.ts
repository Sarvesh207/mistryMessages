import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth";
import mongoose, { mongo } from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  console.log(session)

  const user: User = session?.user as User;
  console.log(user)
  if (!session || !session.user) {
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

  const userId = new mongoose.Types.ObjectId(user._id);

  console.log(userId)
  try {
    const user = await UserModel.aggregate([
      { $match: { id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    console.log(user)

	if(!user || user.length === 0){
		return Response.json(
			{
			  success: false,
			  message: "User not found",
			},
			{
			  status: 401,
			}
		  );
	}

	return Response.json(
		{
		  success: true,
		  message: user[0].messages
		},
		{
		  status:200
		}
	  );
  } catch (error) {
	console.log("An unexpected error occcured",error)
	return Response.json(
        {
          success: false,
          message: "Internal server error",
        },
        {
          status: 500,
        }
      );
  }
}
