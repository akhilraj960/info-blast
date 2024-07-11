import User from "@/lib/models/User";
import { connectDb } from "@/lib/mongoose";
import { EmailAddressJSON } from "@clerk/backend";
import { NextResponse } from "next/server";

interface UserProps {
  clerkId: string | null;
  first_name: string | null;
  last_name: string | null;
  image_url: string;
  email_addresses: EmailAddressJSON[];
  username: string | null;
}

export const createUser = async ({
  clerkId,
  first_name,
  last_name,
  image_url,
  email_addresses,
  username,
}: UserProps): Promise<any> => {
  try {
    await connectDb();

    const user = await new User({
      clerkId,
      personal_info: {
        firstName: first_name,
        lastName: last_name,
        profile_img: image_url,
        email: email_addresses[0].email_address,
        username: username,
      },
    });

    const newUser = await user.save();

    console.log("new User Created ", newUser);

    return newUser;
  } catch (error) {
    console.log("Error : ", error);
  }
};

export const updateUser = async ({
  clerkId,
  first_name,
  last_name,
  image_url,
  email_addresses,
  username,
}: UserProps): Promise<any> => {
  try {
    await connectDb();

    const updateData: any = {
      "personal_info.firstName": first_name,
      "personal_info.lastName": last_name,
      "personal_info.profile_img": image_url,
      "personal_info.email": email_addresses?.[0]?.email_address,
      "personal_info.username": username,
    };

    const updateUser = await User.findOneAndUpdate(
      { clerkId },
      { $set: updateData },
      { new: true }
    );

    if (!updateUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User Updated" }, { status: 200 });
  } catch (error) {
    console.log(error);
  }
};

export const deleteUser = async (id: string) => {
  try {
    await connectDb();
    User.findByIdAndDelete({ clerkId: id });
  } catch (error) {
    console.log(error);
  }
};
