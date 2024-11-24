export const userBookingRequests = async (userId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/booking-requests/${userId}`
  );
  return response.json();
};
