import { ResetFormValues } from "@/app/reset-password/page";

export const resetPassword = async (data: ResetFormValues) => {
  console.log("resetPassword", data);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/reset-password`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    }
  );
  const responseData = await response.json();
  console.log("resetPassword", responseData);
  return responseData;
};
