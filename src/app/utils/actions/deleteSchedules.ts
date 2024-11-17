"use server";

export const deleteSchedule = async (id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/delete-schedule/${id}`,
    { method: "DELETE" }
  );
  return response.json();
};
