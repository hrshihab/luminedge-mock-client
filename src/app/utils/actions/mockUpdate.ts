//use server action to update mock number

import { User } from "@/components/tableAdmin";

export const updateMockNumber = async (
  mockNumber: string,
  selectedUser: User
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/update/${selectedUser._id}/${mockNumber}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );
  const data = await res.json();
  console.log(data);
};
