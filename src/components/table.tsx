"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { AiOutlineEllipsis } from "react-icons/ai";

interface Booking {
  _id: string;
  bookingDate: string;
  startTime: string;
  status: string;
  attendance?: string;
  name?: string;
  testType?: string;
}

const Table = ({ userId }: { userId: string }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch bookings when the component mounts
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `https://luminedge-mock-test-booking-server.vercel.app/api/v1/user/bookings/${userId}`
        );
        setBookings(response.data.bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [userId]);

  // Function to delete a booking
  const onDeleteBooking = async (bookingId: string) => {
    try {
      await axios.delete(
        `https://luminedge-mock-test-booking-server.vercel.app/api/v1/bookings/${bookingId}`
      );
      // Update the bookings list after deletion
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== bookingId)
      );
      toast.success("Booking deleted successfully");
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const isPast24Hours = (bookingDate: string, startTime: string): boolean => {
    const bookingDateTime = new Date(`${bookingDate}T${startTime}`);
    const currentTime = new Date();
    const timeDifference = bookingDateTime.getTime() - currentTime.getTime();
    return timeDifference <= 0 || timeDifference > 24 * 60 * 60 * 1000; // Check if it's past or more than 24 hours
  };

  return (
    <table className="table">
      {/* head */}
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Test Type</th>
          <th>Date</th>
          <th>Start Time</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {/* Row mapping */}
        {bookings.map((booking: Booking, index: number) => (
          <tr key={booking._id}>
            <td>{index + 1}</td>
            <td>{booking.name}</td>
            <td>{booking.testType}</td>
            <td>{booking.bookingDate}</td>
            <td>{booking.startTime.slice(0, 5)}</td>
            <td>{booking.status}</td>

            {/* Re-schedule Button */}
            <td>
              <button
                disabled={
                  booking.status !== "pending" ||
                  !isPast24Hours(booking.bookingDate, booking.startTime)
                }
                onClick={() => {
                  toast((t) => (
                    <div>
                      <p className=" mb-2">
                        Are you sure you want to reschedule this booking?
                      </p>
                      <button
                        onClick={() => {
                          onDeleteBooking(booking._id); // Call delete function on confirm
                          toast.dismiss(t.id); // Dismiss the toast after action
                          router.push("/dashboard/courses"); // Redirect to bookings page
                        }}
                        className="bg-green-500 hover:bg-green-700 MT mr-2 text-white font-bold py-2 px-4 rounded"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => toast.dismiss(t.id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ));
                }}
                className={`px-4 py-2 font-bold rounded ${
                  booking.status === "pending" &&
                  isPast24Hours(booking.bookingDate, booking.startTime)
                    ? "font-bold  text-xl text-gray-900 hover:bg-black hover:text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <AiOutlineEllipsis />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
