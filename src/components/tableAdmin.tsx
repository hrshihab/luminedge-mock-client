"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { AiOutlineEye } from "react-icons/ai"; // Eye icon for viewing user details
import { FiDownload } from "react-icons/fi"; // Download icon

interface User {
  _id: string;
  name: string;
  email: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

const TableAdmin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Holds the user to view
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility

  useEffect(() => {
    // Fetch all users when the component mounts
    const fetchUsers = async () => {
      try {
        console.log("FROM TABLE ADMIN", process.env.NEXT_PUBLIC_BACKEND_URL);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users`
        );
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Function to change user status
  const onChangeStatus = async (userId: string, newStatus: string) => {
    console.log(userId, newStatus);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/status/${userId}`,
        {
          status: newStatus,
        }
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, status: newStatus } : user
        )
      );
      toast.success("User status updated successfully");
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
    }
  };

  // Function to view user details (opens modal and sets selected user)
  const onViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Function to download user data
  const onDownload = (userId: string) => {
    console.log("Download data for user:", userId);
    toast.success("Download started");
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <table className="table">
        {/* Table Head */}
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {/* Row Mapping */}
          {users.map((user: User) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.createdAt.slice(0, 10)}</td>

              {/* Dropdown for Status */}
              <td>
                <select
                  value={user.status}
                  onChange={(e) => onChangeStatus(user._id, e.target.value)}
                  className="px-2 py-1 border rounded"
                >
                  <option value="active">Active</option>
                  <option value="checked">Checked</option>
                  <option value="completed">Completed</option>
                </select>
              </td>

              {/* Action Buttons */}
              <td className="flex space-x-2">
                <button
                  onClick={() => onDownload(user._id)}
                  className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                >
                  <FiDownload className="mr-1" /> Download
                </button>
                <button
                  onClick={() => onViewDetails(user)}
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                >
                  <AiOutlineEye className="mr-1" /> View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for User Details */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">User Details</h2>
            <p>
              <strong>Name:</strong> {selectedUser.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Status:</strong> {selectedUser.status}
            </p>
            <p>
              <strong>Payment Status:</strong> {selectedUser.paymentStatus}
            </p>
            <p>
              <strong>Created At:</strong> {selectedUser.createdAt}
            </p>

            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TableAdmin;
