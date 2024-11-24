"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiDownload } from "react-icons/fi"; // Download icon
import jsPDF from "jspdf";
import Link from "next/link";

// Define a type for the schedule
type Schedule = {
  id: string;
  testType: string;
  startDate: string; // or Date, depending on your data
  status: string;
  timeSlots: Array<{
    slotId: string;
    startTime: string;
    endTime: string;
    slot: string;
  }>;
};

function BookingRequestsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [bookingsPerPage, setBookingsPerPage] = useState<number>(10);
  const [filter, setFilter] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [scheduleType, setScheduleType] = useState<
    "current" | "past" | "upcoming"
  >("current");
  const [testNameFilter, setTestNameFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [userDetails, setUserDetails] = useState<{
    [key: string]: { name: string; email: string; contactNo?: string };
  }>({});
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [attendance, setAttendance] = useState<string>("");

  // Extract unique test names for the dropdown
  const testNames = Array.from(
    new Set(bookings.map((booking) => booking.testType))
  );

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/bookings`
      );
      const data = await response.json();
      const uniqueBookings = aggregateBookings(data.bookings);
      setBookings(uniqueBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }

  function aggregateBookings(bookings: any[]) {
    const bookingMap: { [key: string]: any } = {};

    bookings.forEach((booking) => {
      const key = `${booking.bookingDate}-${booking.slotId}`;
      if (!bookingMap[key]) {
        bookingMap[key] = {
          ...booking,
          userIds: new Set([booking.userId]), // Use a Set to store unique user IDs
        };
      } else {
        bookingMap[key].userIds.add(booking.userId);
      }
    });

    return Object.values(bookingMap).map((booking) => ({
      ...booking,
      userIds: Array.from(booking.userIds), // Convert Set back to Array
    }));
  }

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  function handleFilterChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setFilter(e.target.value);
  }

  function handleSortOrderChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSortOrder(e.target.value as "asc" | "desc");
  }

  function handleScheduleTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setScheduleType(e.target.value as "current" | "past" | "upcoming");
  }

  function handleTestNameFilterChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setTestNameFilter(e.target.value);
  }

  function handleDateFilterChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDateFilter(e.target.value);
  }

  function handleDownloadClick() {
    setIsPrintModalOpen(true);
  }

  function handlePrint() {
    const doc = new jsPDF();
    doc.text("Booking Details", 10, 10);
    selectedBooking.userIds.forEach((userId: string, index: number) => {
      const user = userDetails[userId];
      if (user) {
        doc.text(`Name: ${user.name}`, 10, 20 + index * 20);
        doc.text(`Email: ${user.email}`, 10, 30 + index * 20);
        doc.text(`Phone: ${user?.contactNo || "N/A"}`, 10, 40 + index * 20);
        doc.text(
          `Slot: ${selectedBooking.startTime} - ${selectedBooking.endTime} (Slot: ${selectedBooking.slotId})`,
          10,
          50 + index * 20
        );
      }
    });
    doc.save(
      `booking_${selectedBooking.bookingDate}_${selectedBooking.slotId}.pdf`
    );
    setIsPrintModalOpen(false);
  }

  async function fetchUserData(userId: string) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${userId}`
      );
      const data = await response.json();
      const { name, email } = data.user;
      setUserDetails((prev) => ({
        ...prev,
        [userId]: { name, email },
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  function seeBookingDetails(booking: any) {
    setSelectedBooking(booking);
    booking.userIds.forEach(fetchUserData);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedBooking(null);
    setAttendance("");
  }

  async function handleAccept(userId: string) {
    try {
      console.log(selectedBooking);
      // Update booking status and attendance
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/bookings/${selectedBooking.scheduleId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "accepted",
            attendance,
            userId,
          }),
        }
      );

      toast.success("User accepted and notified!");
    } catch (error) {
      console.error("Error accepting user:", error);
      toast.error("Failed to accept user.");
    }
  }

  async function handleReject(userId: string) {
    try {
      // Update booking status and attendance
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/bookings/${selectedBooking.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "rejected",
            attendance: "absent",
            userId,
          }),
        }
      );

      toast.success("User rejected.");
    } catch (error) {
      console.error("Error rejecting user:", error);
      toast.error("Failed to reject user.");
    }
  }

  // Filter and sort bookings
  const filteredBookings = bookings
    .filter((booking) => {
      // Filter by selected test name
      const matchesTestName =
        testNameFilter === "" || booking.testType === testNameFilter;
      // Filter by selected date
      const matchesDate =
        dateFilter === "" || booking.bookingDate === dateFilter;
      return matchesTestName && matchesDate;
    })
    .sort((a, b) => {
      // Implement sorting logic based on sortOrder
      if (sortOrder === "asc") {
        return a.bookingDate.localeCompare(b.bookingDate);
      } else {
        return b.bookingDate.localeCompare(a.bookingDate);
      }
    });

  function downloadBookingPDF(booking: any) {
    const doc = new jsPDF();
    doc.text("Booking Details", 10, 10);
    booking.userIds.forEach((userId: string, index: number) => {
      const user = userDetails[userId];
      if (user) {
        doc.text(`Name: ${user.name}`, 10, 20 + index * 20);
        doc.text(`Email: ${user.email}`, 10, 30 + index * 20);
        doc.text(`Phone: ${user?.contactNo || "N/A"}`, 10, 40 + index * 20);
        doc.text(
          `Slot: ${booking.startTime} - ${booking.endTime} (Slot: ${booking.slotId})`,
          10,
          50 + index * 20
        );
      }
    });
    doc.save(`booking_${booking.bookingDate}_${booking.slotId}.pdf`);
  }

  async function handleSubmit(userId: string) {
    try {
      // Logic to determine if the user was accepted or rejected
      const status = attendance ? "accepted" : "rejected"; // Example logic
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/bookings/${selectedBooking.scheduleId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status,
            attendance, // Use the selected attendance
            userId,
          }),
        }
      );

      toast.success("User status updated!");
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status.");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Booking Requests</h1>

      <div className="flex justify-between items-center mb-4">
        <select
          value={testNameFilter}
          onChange={handleTestNameFilterChange}
          className="px-2 py-1 border rounded"
        >
          <option value="">All Test Names</option>
          <option value="IELTS">IELTS</option>
          <option value="GRE">GRE</option>
          <option value="TOEFL">TOEFL</option>
          <option value="Pearson">Pearson</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={handleDateFilterChange}
          className="px-2 py-1 border rounded"
        />
        <select
          value={sortOrder}
          onChange={handleSortOrderChange}
          className="px-2 py-1 border rounded"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <select
          value={scheduleType}
          onChange={handleScheduleTypeChange}
          className="px-2 py-1 border rounded"
        >
          <option value="current">Current</option>
          <option value="past">Past</option>
          <option value="upcoming">Upcoming</option>
        </select>
        <button
          onClick={handleDownloadClick}
          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <FiDownload className="inline-block mr-1" /> Download
        </button>
      </div>

      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Test Name</th>
            <th className="px-4 py-2 text-left">Booking Date</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Slot</th>
            <th className="px-4 py-2 text-left">User Count</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.map((booking) => (
            <tr
              key={`${booking.bookingDate}-${booking.slotId}`}
              className="border-b"
            >
              <td className="px-4 py-2">{booking.name}</td>

              <td className="px-4 py-2">{booking.testType}</td>
              <td className="px-4 py-2">{booking.bookingDate}</td>
              <td className="px-4 py-2">{booking.status}</td>
              <td className="px-4 py-2">
                {booking.startTime} - {booking.endTime} (Slot: {booking.slotId})
              </td>
              <td className="px-4 py-2">{booking.userIds.length}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => downloadBookingPDF(booking)}
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                >
                  Download
                </button>
                <button
                  onClick={() => seeBookingDetails(booking)}
                  className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  See Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Booking Details</h2>
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">User Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Request Date</th>
                  <th className="px-4 py-2 text-left">Attendance</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedBooking.userIds.map((userId: string) => (
                  <tr key={userId} className="border-b">
                    <td className="px-4 py-2">
                      {userDetails[userId]?.name || "Loading..."}
                    </td>
                    <td className="px-4 py-2">
                      {userDetails[userId]?.email || "Loading..."}
                    </td>
                    <td className="px-4 py-2">{/* Request Date */}</td>
                    <td className="px-4 py-2">
                      <select
                        className="px-2 py-1 border rounded"
                        value={attendance}
                        onChange={(e) => setAttendance(e.target.value)}
                      >
                        <option value="" disabled>
                          Select Attendance
                        </option>
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleAccept(userId)}
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
                        style={{
                          display: selectedBooking ? "inline-block" : "none",
                        }}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(userId)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        style={{
                          display: selectedBooking ? "inline-block" : "none",
                        }}
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleSubmit(userId)}
                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Submit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <div>
          <label htmlFor="bookingsPerPage" className="mr-2">
            Bookings per page:
          </label>
          <select
            id="bookingsPerPage"
            value={bookingsPerPage}
            onChange={(e) => setBookingsPerPage(Number(e.target.value))}
            className="px-2 py-1 border rounded"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            Previous
          </button>
          <span className="mx-2">Page {currentPage}</span>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={indexOfLastBooking >= bookings.length}
            className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>

      {isPrintModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg relative">
            <button
              onClick={() => setIsPrintModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Print Preview</h2>
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">User Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Slot</th>
                </tr>
              </thead>
              <tbody>
                {selectedBooking.userIds.map((userId: string) => (
                  <tr key={userId} className="border-b">
                    <td className="px-4 py-2">
                      {userDetails[userId]?.name || "Loading..."}
                    </td>
                    <td className="px-4 py-2">
                      {userDetails[userId]?.email || "Loading..."}
                    </td>
                    <td className="px-4 py-2">
                      {selectedBooking.startTime} - {selectedBooking.endTime}{" "}
                      (Slot: {selectedBooking.slotId})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={handlePrint}
              className="mt-4 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Print
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingRequestsPage;
