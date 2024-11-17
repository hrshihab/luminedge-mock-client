"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiDownload } from "react-icons/fi";
import { AiOutlineEye } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { User } from "@/components/tableAdmin";
import { fetchAllUsers } from "@/app/utils/actions/fetchAllUsers";
import { blockUserStatus } from "@/app/utils/actions/blockUserStatus";

const TableAdmin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUsers, setCurrentUsers] = useState<User[]>([]);

  //   useEffect(() => {
  //     fetchUsers();
  //   }, []);

  //   const fetchUsers = async () => {
  //     const response = await fetchAllUsers();
  //     setUsers(response);
  //     setCurrentUsers(response);
  //   };

  const onChangeStatus = async (userId: string, newStatus: string) => {
    try {
      const response = await blockUserStatus(userId, newStatus);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, status: newStatus } : user
        )
      );
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  //   const onDownload = async (userId: string) => {
  //     try {
  //       const response = await axios.get(
  //         `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/download/${userId}`,
  //         { responseType: "blob" }
  //       );
  //       const url = window.URL.createObjectURL(new Blob([response.data]));
  //       const a = document.createElement("a");
  //       a.href = url;
  //       a.download = `${userId}.pdf`;
  //       a.click();
  //       window.URL.revokeObjectURL(url);
  //       toast.success("Downloaded successfully");
  //     } catch (error) {
  //       console.error("Error downloading:", error);
  //       toast.error("Failed to download");
  //     }
  //   };

  const onViewDetails = (user: User) => {
    // Implement view details functionality
  };

  const onBlockUser = async (userId: string) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/block/${userId}`
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, status: "blocked" } : user
        )
      );
      toast.success("User blocked successfully");
    } catch (error) {
      console.error("Error blocking user:", error);
      toast.error("Failed to block user");
    }
  };

  return (
    <>
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Mock Number</th>
            <th className="px-4 py-2 text-left">Payment Status</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user: User) => (
            <tr key={user._id} className="border-b">
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.createdAt.slice(0, 10)}</td>
              <td className="px-4 py-2">
                <select
                  value={user.status}
                  onChange={(e) => onChangeStatus(user._id, e.target.value)}
                  className="px-2 py-1 border rounded"
                >
                  <option value="active">Active</option>
                  <option value="checked">Checked</option>
                  <option value="completed">Completed</option>
                  <option value="blocked">Blocked</option>
                </select>
              </td>
              <td className="px-4 py-2">{user.mockNumber}</td>
              <td className="px-4 py-2">{user.paymentStatus}</td>
              <td className="px-4 py-2 flex space-x-2">
                <button
                  // onClick={() => onDownload(user._id)}
                  className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                >
                  <FiDownload className="mr-1" /> Download
                </button>
                <button
                  onClick={() => onViewDetails(user)}
                  className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                >
                  <AiOutlineEye className="mr-2" /> View
                </button>
                <button
                  onClick={() => onBlockUser(user._id)}
                  className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
                >
                  Block
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default TableAdmin;
