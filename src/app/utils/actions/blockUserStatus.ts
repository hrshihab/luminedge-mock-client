"use server";
export const blockUserStatus = async (userId: string, newStatus: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/status/${userId}`,
    { method: "PUT", body: JSON.stringify({ status: newStatus }) }
  );
  return response.json();
};

