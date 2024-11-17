"use client";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface Booking {
  _id: string;
  bookingDate: string;
  startTime: string;
  status: string;
}

const Table = ({ userId }: { userId: string }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Fetch bookings when the component mounts
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/bookings/${userId}`
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/${bookingId}`
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

  return (
    <table className="table">
      {/* head */}
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
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
            <td>IELTS</td>
            <td>{booking.bookingDate}</td>
            <td>{booking.startTime.slice(0, 5)}</td>
            <td>{booking.status}</td>

            {/* Re-schedule Button */}
            <td>
              <Link href={`/courses`}>
                <button
                  disabled={booking.status !== "active"}
                  onClick={() => onDeleteBooking(booking._id)} // Call delete function
                  className={`px-4 py-2 rounded ${
                    booking.status === "active"
                      ? "bg-[#FACE39] text-gray-900 hover:bg-black hover:text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Re-schedule
                </button>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
