"use client";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { MdOutlinePersonOutline } from "react-icons/md";
import { getUserIdFromToken, getUserIdOnlyFromToken } from "@/app/helpers/jwt";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];
type TimeSlot = {
  slotId: string;
  startTime: string; // e.g., "08:00:00"
  endTime: string; // e.g., "08:30:00"
  slot: number;
};

type Schedule = {
  _id: string; // Unique identifier for the schedule
  courseId: string; // ID of the course associated with this schedule
  startDate: string; // Start date in "YYYY-MM-DD" format
  endDate: string; // End date in "YYYY-MM-DD" format
  timeSlots: TimeSlot[]; // Array of time slots
  testSystem: string; // Type of test system, e.g., "Computer-Based"
  testType: string; // Type of test, e.g., "IELTS"
  status: string; // Status of the schedule, e.g., "Scheduled"
};

const BookingId = ({ params }: { params: { bookingId: string } }) => {
  const [value, onChange] = useState<Value>(new Date());
  const [testType, setTestType] = useState<string>("Paper Based");
  const [testSystem, setTestSystem] = useState<string>("Academic");
  const [scheduleData, setScheduleData] = useState<Schedule[]>([]);
  const [scheduleId, setScheduleId] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<string | null>(null); // New state for user status

  const router = useRouter();

  const courses = [
    {
      _id: "67337c880794d577cd982b75",
      name: "IELTS",
      image: "https://i.ibb.co.com/MPBCMfb/ielts.webp",
    },
    {
      _id: "67337c880794d577cd982b76",
      name: "Pearson PTE",
      image: "https://i.ibb.co.com/4mrhCkN/pte.webp",
    },
    {
      _id: "67337c880794d577cd982b77",
      name: "GRE",
      image: "https://i.ibb.co.com/SX7t52h/gre.webp",
    },
    {
      _id: "67337c880794d577cd982b78",
      name: "TOFEL",
      image: "https://i.ibb.co.com/vjyL3QC/toefl.webp",
    },
  ];

  // Function to get course name by bookingId
  const getCourseNameByBookingId = (bookingId: string) => {
    const course = courses.find((course) => course._id === bookingId);

    return course ? course.name : "Unknown Course";
  };
  const courseName = getCourseNameByBookingId(params.bookingId);

  // Function to fetch schedule data based on selected date
  const fetchScheduleData = async (selectedDate: Date) => {
    try {
      const formattedDate = selectedDate.toLocaleDateString("en-CA");
      const response = await axios.get(
        `http://localhost:5000/api/v1/schedule/${formattedDate}/${params.bookingId}`
      );
      setScheduleData(response.data.schedules);
      console.log(response.data.schedules);
    } catch (error) {
      console.error("Error fetching schedule data:", error);
    }
  };

  // Fetch user status on component mount
  useEffect(() => {
    const fetchUserStatus = async () => {
      const id = getUserIdOnlyFromToken();
      setUserId(id);

      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/user/status/${id}`
        );
        const data = response.data;
        console.log(data.user.status); //undefined
        setUserStatus(data.user.status);
        //console.log(userStatus);
        // Assuming response includes 'status' field
      } catch (error) {
        console.error("Error fetching user status:", error);
      }
    };

    fetchUserStatus();
  }, []);

  // Fetch schedule data when 'value' (selected date) changes
  useEffect(() => {
    if (value instanceof Date) {
      fetchScheduleData(value);
    }
  }, [value]);

  const handleSlotSelect = (
    slotId: string,
    scheduleId: string,
    testType: string
  ) => {
    console.log(slotId, testType);
    setSelectedSlotId(slotId);
    setScheduleId(scheduleId);
    setTestType(testType);
  };

  const handleProceed = async () => {
    if (userStatus !== "completed") {
      toast.error("Booking is only available for users with completed status.");
      return;
    }

    if (selectedSlotId) {
      try {
        console.log(selectedSlotId, userId, scheduleId, testType, testSystem);
        const response = await axios.post(
          `http://localhost:5000/api/v1/user/book-slot`,
          {
            slotId: selectedSlotId,
            userId,
            scheduleId,
            status: "active",
            name: courseName,
            testType: testType,
            testSystem: testSystem,
          }
        );
        toast.success("Slot booked successfully!");
        router.push(`/dashboard`);
      } catch (error: any) {
        console.error("Error booking slot:", error);
        toast.error(error.response.data.message);
      }
    }
  };

  // Determine if the dropdowns should be enabled
  const isDropdownEnabled = courseName === "IELTS";

  // Determine if the button should be enabled
  const isButtonEnabled = !!selectedSlotId;

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="flex flex-col items-start justify-center my-4 xl:my-8">
        <h3 className="text-lg md:text-xl text-gray-800 font-semibold">
          Please Select Your{" "}
          <span className="bg-[#f7cb37] text-white font-bold text-xl shadow-lg px-2 py-1 rounded-lg">
            {courseName}
          </span>
        </h3>
        <h1 className="text-2xl md:text-3xl font-bold">
          Mock Test Date and Time
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-28 mb-8">
        <div className="w-full flex flex-col items-start">
          <label htmlFor="testType">Test Type</label>
          <select
            className="select select-bordered bg-[#FACE39] text-black w-full"
            value={testType}
            //onChange={(e) => setTestType(e.target.value)}
            disabled={!isDropdownEnabled} // Disable if course is not IELTS
          >
            <option value="Paper Based">Paper Based</option>
            <option value="Computer Based">Computer Based</option>
          </select>
        </div>

        <div className="w-full flex flex-col items-start">
          <label htmlFor="testSystem">Test System</label>
          <select
            className="select select-bordered bg-[#FACE39] text-black w-full"
            value={testSystem}
            onChange={(e) => setTestSystem(e.target.value)}
            disabled={!isDropdownEnabled} // Disable if course is not IELTS
          >
            <option value="Academic">Academic</option>
            <option value="General Training">General Training</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto">
        {/* Calendar Component */}
        <Calendar onChange={onChange} value={value} />

        {/* Display fetched schedule data */}
        <div className="mt-8 w-full mx-auto">
          {scheduleData.length > 0 ? (
            <>
              {scheduleData.map((schedule, index) => (
                <div
                  key={index}
                  className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 rounded"
                >
                  {schedule.timeSlots.map((slot, slotIndex) => (
                    <div
                      key={slotIndex}
                      className={`mt-2 pl-4 py-2 w-full rounded-lg ${
                        selectedSlotId === slot.slotId
                          ? "bg-yellow-300"
                          : "bg-gray-100"
                      } hover:bg-[#FACE39] cursor-pointer`}
                      onClick={() =>
                        handleSlotSelect(
                          slot.slotId,
                          schedule._id,
                          schedule.testType
                        )
                      }
                    >
                      <div className="grid grid-cols-2">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-800">
                            {slot.startTime.slice(0, 5)}
                            <p className="text-xs text-gray-500">Start</p>
                          </h3>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-800">
                            {slot.endTime.slice(0, 5)}
                            <p className="text-xs text-gray-500">End</p>
                          </h3>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3 text-xs">
                        <MdOutlinePersonOutline />
                        <p className="text-gray-800 mr-8">Available Seats</p>
                        {slot.slot}
                      </div>
                      <h4 className="text-xs font-semibold  mt-2">
                        Test Type :{" "}
                        <span className="text-red-500">
                          {schedule.testType}
                        </span>
                      </h4>
                    </div>
                  ))}
                </div>
              ))}
            </>
          ) : (
            <p>No schedules available for this date.</p>
          )}
        </div>
      </div>
      <div className="w-full flex justify-end mt-4">
        <button
          className="btn bg-[#FACE39] text-black hover:bg-white hover:border-2 hover:border-[#FACE39] hover:text-black rounded-full px-8 shadow-lg"
          disabled={!isButtonEnabled} // Disable if no slot is selected
          onClick={handleProceed}
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default BookingId;
