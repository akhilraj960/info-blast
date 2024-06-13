import User from "@/models/User";
import { connectDb } from "../mongoose";
import { EmailAddressJSON } from "@clerk/backend";

interface createUserProps {
  first_name: any;
  last_name: any;
  image_url: string;
  email_addresses: EmailAddressJSON[];
  username: any;
}

export const createOrUpdateUser = async ({
  first_name,
  last_name,
  image_url,
  email_addresses,
  username,
}: createUserProps): Promise<any> => {
  try {
    await connectDb();

    // const user = await User.findByIdAndUpdate(
    //   {
    //     $set: {
    //       personal_info: {
    //         firstName: first_name,
    //         lastName: last_name,
    //         profile_img: image_url,
    //         email: email_addresses[0].email_address,
    //         username: username,
    //       },
    //     },
    //   },
    //   { upsert: true, new: true }
    // );

    // await user.save();

    const user = await new User({
      firstName: first_name,
      lastName: last_name,
      profile_img: image_url,
      email: email_addresses[0].email_address,
      username: username,
    });

    await user.save();

    return user;
  } catch (error) {
    console.log(error);
  }
};

export const deleteUser = async (id: string) => {
  try {
    await connectDb();
    User.findByIdAndDelete({ clerkId: id });
  } catch (error) {}
};
