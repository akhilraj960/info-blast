import User from "@/lib/models/User";
import { connectDb } from "@/lib/mongoose";
import { EmailAddressJSON } from "@clerk/backend";

interface createUserProps {
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
}: createUserProps): Promise<any> => {
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

    // const user = await new User({
    //   clerkId,
    //   personal_info: {
    //     firstName: first_name,
    //     lastName: last_name,
    //     profile_img: image_url,
    //     email: email_addresses[0].email_address,
    //     username: username,
    //   },
    // });

    // await user.save().then((user) => {
    //   console.log("user created", user);

    //   return user;
    // });
  } catch (error) {
    console.log("Error : ", error);
  }
};

export const deleteUser = async (id: string) => {
  try {
    await connectDb();
    User.findByIdAndDelete({ clerkId: id });
  } catch (error) {}
};
