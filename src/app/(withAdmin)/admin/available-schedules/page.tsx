"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiDownload } from "react-icons/fi"; // Download icon

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

function AvailableSchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [schedulesPerPage, setSchedulesPerPage] = useState<number>(10);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>(null);
  const [testTypeFilter, setTestTypeFilter] = useState<string>("");
  const [dateSortOrder, setDateSortOrder] = useState<string>("ascending");

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/get-schedules`,
      { next: { revalidate: 0 } }
    );
    const data = await response.json();
    setSchedules(data);
  };

  const deleteSchedule = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/delete-schedule/${id}`,
        { method: "DELETE" }
      );
      const result = await response.json();
      if (result.success) {
        toast.success("Schedule deleted successfully");
        setSchedules(schedules.filter((schedule: any) => schedule.id !== id));
      }
    } catch (error) {
      toast.error("Error deleting schedule");
      console.error("Error deleting schedule:", error);
    }
  };

  const filteredSchedules = React.useMemo(() => {
    return schedules.filter((schedule: any) => {
      return testTypeFilter ? schedule.testType === testTypeFilter : true;
    });
  }, [schedules, testTypeFilter]);

  const sortedSchedules = React.useMemo(() => {
    let sortableSchedules = [...filteredSchedules];
    sortableSchedules.sort((a: Schedule, b: Schedule) => {
      if (a.startDate < b.startDate) {
        return dateSortOrder === "ascending" ? -1 : 1;
      }
      if (a.startDate > b.startDate) {
        return dateSortOrder === "ascending" ? 1 : -1;
      }
      return 0;
    });
    return sortableSchedules;
  }, [filteredSchedules, dateSortOrder]);

  const indexOfLastSchedule = currentPage * schedulesPerPage;
  const indexOfFirstSchedule = indexOfLastSchedule - schedulesPerPage;
  const currentSchedules = sortedSchedules.slice(
    indexOfFirstSchedule,
    indexOfLastSchedule
  );

  return (
    <div>
      <div className="my-4 flex space-x-4">
        <select
          value={testTypeFilter}
          onChange={(e) => setTestTypeFilter(e.target.value)}
          className="px-2 py-1 border rounded"
        >
          <option value="">All Test Types</option>
          <option value="GRE">GRE</option>
          <option value="IELTS">IELTS</option>
          <option value="TOEFL">TOEFL</option>
          <option value="PTE">PTE</option>
        </select>
        <select
          value={dateSortOrder}
          onChange={(e) => setDateSortOrder(e.target.value)}
          className="px-2 py-1 border rounded"
        >
          <option value="ascending">Start Date Ascending</option>
          <option value="descending">Start Date Descending</option>
        </select>
      </div>
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left">Test Type</th>
            <th className="px-4 py-2 text-left">Start Date</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Time Slots</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentSchedules.map((schedule: any) => (
            <tr key={schedule.id} className="border-b">
              <td className="px-4 py-2">{schedule.testType}</td>
              <td className="px-4 py-2">{schedule.startDate}</td>
              <td className="px-4 py-2">{schedule.status}</td>
              <td className="px-4 py-2">
                <select className="px-2 py-1 border rounded">
                  {schedule.timeSlots.map((slot: any) => (
                    <option key={slot.slotId} value={slot.slotId}>
                      {slot.startTime} - {slot.endTime} (Slot: {slot.slot})
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-2 flex space-x-2">
                <button
                  onClick={() => deleteSchedule(schedule._id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <div>
          <label htmlFor="schedulesPerPage" className="mr-2">
            Schedules per page:
          </label>
          <select
            id="schedulesPerPage"
            value={schedulesPerPage}
            onChange={(e) => setSchedulesPerPage(Number(e.target.value))}
            className="px-2 py-1 border rounded"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
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
            disabled={indexOfLastSchedule >= schedules.length}
            className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default AvailableSchedulesPage;