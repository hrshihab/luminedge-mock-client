import React from "react";

type BookingDetailsPageProps = {
  booking: any;
};

const BookingDetailsPage: React.FC<BookingDetailsPageProps> = ({ booking }) => {
  const handleAccept = (userId: string) => {
    // Implement accept logic here
    console.log(`Accepted booking for user: ${userId}`);
  };

  const handleReject = (userId: string) => {
    // Implement reject logic here
    console.log(`Rejected booking for user: ${userId}`);
  };

  const handleAttendance = (userId: string) => {
    // Implement attendance logic here
    console.log(`Marked attendance for user: ${userId}`);
  };

  // Ensure booking is defined
  if (!booking) {
    return <p>Loading booking details...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Booking Details</h1>
      <p>Test Type: {booking.testType}</p>
      <p>Booking Date: {booking.bookingDate}</p>
      <p>Status: {booking.status}</p>
      <p>
        Slot: {booking.startTime} - {booking.endTime} (Slot: {booking.slotId})
      </p>
      <p>User Count: {booking.userIds.length}</p>

      <table className="table-auto w-full border-collapse mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left">User ID</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {booking.userIds.map((userId: string) => (
            <tr key={userId} className="border-b">
              <td className="px-4 py-2">{userId}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleAccept(userId)}
                  className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(userId)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 mr-2"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleAttendance(userId)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Mark Attendance
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingDetailsPage;
