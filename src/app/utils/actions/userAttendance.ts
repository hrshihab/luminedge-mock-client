export const userAttendanceCount = async (userId: string) => {
  console.log(process.env.NEXT_PUBLIC_BACKEND_URL)
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/attendance-count/${userId}`
  );
  return response.json();
};