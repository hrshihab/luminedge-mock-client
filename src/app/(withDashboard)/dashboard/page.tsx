"use client";
import { getUserIdFromToken } from "@/app/helpers/jwt";
import axios from "axios";
import { useEffect, useState } from "react";

import Table from "@/components/table";
import Link from "next/link";

const DashboardPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  //{attendance:4}
  const [userAttendance, setUserAttendance] = useState<any>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userIdFromToken = await getUserIdFromToken();

        if (userIdFromToken) {
          setUserId(userIdFromToken.userId);
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${userIdFromToken.userId}`
          );
          setUserData(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setUserData(null);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchAttendance = async () => {
        console.log(userId);
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/attendance/${userId}`
          );
          setUserAttendance(response.data); // {attendance:4}
          console.log(userAttendance);
        } catch (error) {
          console.error("Error fetching attendance:", error);
          setUserAttendance(null);
        }
      };

      fetchAttendance();
    }
  }, [userId]);

  if (!userData || !userData.user) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col mx-auto gap-6 p-4 max-w-7xl">
      <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>

      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-yellow-400 to-[#FACE39] p-6 rounded-lg shadow-md text-white">
        <h2 className="text-2xl font-bold mb-2">
          Welcome, {userData.user.name}!
        </h2>
        <p className="text-sm mb-4">
          You have completed{" "}
          <span className="font-semibold">{userData.user.completedTests}</span>{" "}
          tests this week. Start a new goal to improve your results!
        </p>
        <Link href="/dashboard/courses">
          <button className="bg-white text-black font-medium rounded-md px-4 py-2 hover:bg-gray-200 transition-all">
            Book Now
          </button>
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-gray-600 font-medium">Purchased</h3>
          <p className="text-2xl font-bold text-gray-800">
            {userData.user.totalMock}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-gray-600 font-medium">Booked</h3>
          <p className="text-2xl font-bold text-yellow-500">
            {userData.user.totalMock - userData.user.mock}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-gray-600 font-medium">Remaining</h3>
          <p className="text-2xl font-bold text-green-500">
            {userData.user.mock}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-gray-600 font-medium">Attended</h3>
          <p className="text-2xl font-bold text-[#FACE39]">
            {userAttendance ? userAttendance.attendance : 0}
          </p>
        </div>
      </div>

      {/* Exam Schedule Section */}
      <div className="bg-white p-6 rounded-lg shadow-md md:bg-transparent md:border-0">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Exam Schedule
        </h2>
        <div className="max-h-60 overflow-y-auto">
          <Table userId={userId || ""} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
