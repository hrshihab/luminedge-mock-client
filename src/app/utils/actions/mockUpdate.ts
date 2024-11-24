//use server action to update mock number

import { User } from "@/components/tableAdmin";

export const updateMockNumber = async (
  mockNumber: string,
  selectedUser: User,
  transactionId : string,
  mockType:string
) => {
  console.log('mock', mockType);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/update/${selectedUser._id}/${mockNumber}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transactionId,mockType }),
      cache: "no-store",
    }
  );
  const data = await res.json();
  console.log(data);
};
