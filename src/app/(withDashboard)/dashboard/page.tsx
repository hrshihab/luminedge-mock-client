"use client";
import { getUserIdFromToken } from "@/app/helpers/jwt";
import axios from "axios";
import { useEffect, useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { FaArrowDown } from "react-icons/fa";
import Table from "@/components/table";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";

const DashboardPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  //const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Awaiting user ID if getUserIdFromToken is asynchronous
        const userIdFromToken = await getUserIdFromToken();
        // if (!userIdFromToken) {
        //   router.push("/login");
        // }

        if (userIdFromToken) {
          setUserId(userIdFromToken.userId);

          // Fetching user data based on the user ID
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${userIdFromToken.userId}`
          );
          setUserData(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setUserData(null); // Optional: Set a fallback value on error
      }
    };

    fetchData();
  }, []); // Runs once on mount

  console.log(userData);

  if (!userData || !userData.user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row mx-auto gap-4">
      <div className="w-full md:w-[120%]">
        <h1 className="text-2xl text-start my-4"> Dashboard </h1>
        <div className="flex flex-col p-4 bg-[#ffcb1e] rounded-box">
          <h1 className="text-2xl text-gray-50 font-bold mb-2">
            Welcome {userData.user.name}!
          </h1>
          <p className="text-gray-50 text-sm mb-2">
            You have completed {userData.user.completedTests} tests this week!{" "}
            <br />
            Start a new goal and improve your result.
          </p>
          <Link href="/dashboard/courses">
            <button className="bg-black text-white rounded-md p-2 w-28 my-2">
              Book Now
            </button>
          </Link>
        </div>
        <div className="overflow-x-auto mt-4">
          <h1 className="text-2xl text-start my-4">Exam Schedule</h1>
          <Table userId={userId || ""} />
        </div>
      </div>
      <div className="w-full md:w-[70%] rounded-box">
        <div className="flex justify-end items-center gap-4 mr-8">
          <RxAvatar className="text-4xl" />
          <h1 className="text-xl text-start text-yellow-400 font-semibold my-4">
            {userData.user.name}
          </h1>
          <FaArrowDown className="text-xl text-yellow-400" />
        </div>
        <div className="stats shadow flex justify-end">
          <div className="stat place-items-center">
            <div className="stat-title">Purchased Mock</div>
            <div className="stat-value">{userData.user.totalMock}</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Attended</div>
            <div className="stat-value text-secondary">
              {userData.user.totalMock - userData.user.mock}
            </div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Left</div>
            <div className="stat-value">{userData.user.mock}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
