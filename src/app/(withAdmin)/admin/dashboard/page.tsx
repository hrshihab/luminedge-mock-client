"use client";
import { getUserIdFromToken } from "@/app/helpers/jwt";
import axios from "axios";
import { useEffect, useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { FaArrowDown } from "react-icons/fa";
import Table from "@/components/table";
import Link from "next/link";
import TableAdmin from "@/components/tableAdmin";

const DashboardPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const userIdFromToken = getUserIdFromToken();
      if (userIdFromToken) {
        setUserId(userIdFromToken.userId);
        console.log("FROM ADMIN", userIdFromToken.userId);

        try {
          console.log(
            "FROM ADMIN TRY",
            process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
          );
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${userIdFromToken.userId}`
          );
          setUserData(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, []);

  console.log(userData);

  if (!userData) {
    return <div>Loading...</div>;
  }
  const style = { "--value": 70 } as React.CSSProperties;

  return (
    <div className="flex mx-auto gap-4">
      <div className="w-[120%]">
        <h1 className="text-2xl text-start my-4"> Overview </h1>
        <div className="stats shadow flex justify-end">
          <div className="stat place-items-center">
            <div className="stat-title mb-4">Total Enrollment Today</div>
            <div className="grid grid-cols-2">
              <div>
                <div className="stat-desc">Need to approve</div>
                <div className="stat-desc">Enrolled</div>
              </div>
              <div
                className="radial-progress text-primary"
                style={style}
                role="progressbar"
              >
                70%
              </div>
            </div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Booking Status</div>
            <div className="stat-value text-secondary">November</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Mock Test Seat</div>
            <div className="stat-value">20</div>
          </div>
        </div>
        <div className="overflow-x-auto mt-4">
          <h1 className="text-2xl text-start my-4">
            Students Waiting for Approval
          </h1>
          <TableAdmin />
        </div>
      </div>
      <div className="w-[70%] rounded-box">
        <div className="flex justify-end items-center gap-4 mr-8">
          <RxAvatar className="text-4xl" />
          <h1 className="text-xl text-start text-yellow-400 font-semibold my-4">
            {userData.user.name}
          </h1>
          <FaArrowDown className="text-xl text-yellow-400" />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
