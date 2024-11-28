"use client";
import { updateMockNumber } from "@/app/utils/actions/mockUpdate";
import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { AiOutlineEye } from "react-icons/ai"; // Eye icon for viewing user details
import { FiDownload } from "react-icons/fi"; // Download icon

export interface User {
  _id: string;
  name: string;
  email: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  mock?: string;
  mockType?: string;
  transactionId?: string;
  totalMock?: number;

  isDeleted: boolean;
}

const TableAdmin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]); // Holds filtered users
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all"); // Holds the selected status filter
  const [currentPage, setCurrentPage] = useState<number>(1); // Current page number
  const [usersPerPage, setUsersPerPage] = useState<number>(10); // Users per page
  const [mock, setMock] = useState<string>(""); // State for mock number
  const [mockType, setMockType] = useState<string>(""); // State for mock type
  const [transactionId, setTransactionId] = useState<string>(""); // State for transaction ID
  const [actionFilter, setActionFilter] = useState<string>("all"); // Holds the selected action filter
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for search term

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users`
        );
        const sortedUsers = response.data.users.sort(
          (a: User, b: User) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setUsers(sortedUsers);
        setFilteredUsers(sortedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Filter users by status, action, and search term
  useEffect(() => {
    let filtered = users;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    // Filter by action
    if (actionFilter === "blocked") {
      filtered = filtered.filter((user) => user.isDeleted);
    } else if (actionFilter === "unblocked") {
      filtered = filtered.filter((user) => !user.isDeleted);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [statusFilter, actionFilter, users, searchTerm]);

  // Calculate pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Function to change user status
  const onChangeStatus = async (userId: string, newStatus: string) => {
    console.log("here", transactionId);
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

  // Function to update user data with mock number
  const onUpdateUser = async () => {
    if (!selectedUser) return;
    console.log("Mock Number before update:", transactionId);
    console.log("mocktyep", mockType);

    try {
      await updateMockNumber(mock, selectedUser, transactionId, mockType);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser._id ? { ...user, mock } : user
        )
      );
      toast.success("User data updated successfully");
      closeModal();
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Failed to update user data");
    }
  };

  // Function to view user details (opens modal and sets selected user)
  const onViewDetails = (user: User) => {
    setSelectedUser(user);
    setMock(user.mock || ""); // Initialize mock number
    setMockType(user.mockType || ""); // Initialize mock type with existing value
    setTransactionId(user.transactionId || ""); // Initialize transaction ID with existing value
    setIsModalOpen(true);
    console.log("Selected User Mock Number:", user.mock);
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  // Add a function to block/unblock user
  const onToggleBlockUser = async (userId: string) => {
    const user = users.find((u) => u._id === userId);
    if (!user) return;

    const newStatus = user.isDeleted ? "active" : "blocked"; // Toggle status based on isDeleted
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/block/${userId}`,
        {
          isDeleted: !user.isDeleted, // Toggle isDeleted status
        }
      );
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === userId ? { ...u, isDeleted: !u.isDeleted } : u
        )
      );
      toast.success(`User ${newStatus} successfully`);
    } catch (error) {
      console.error("Error toggling user block status:", error);
      toast.error("Failed to toggle user block status");
    }
  };

  return (
    <>
      <div className="flex gap-4 py-4">
        {/* Search Bar */}
        <div className="mb-4">
          <label htmlFor="search" className="mr-2">
            Search by Name:
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-2 py-1 border rounded"
          />
        </div>
        {/* Filter by Status and Action */}
        <div className="mb-4">
          <label htmlFor="statusFilter" className="mr-2">
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2 py-1 border rounded"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="checked">Checked</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="actionFilter" className="mr-2">
            Active:
          </label>
          <select
            id="actionFilter"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-2 py-1 border rounded"
          >
            <option value="all">All</option>
            <option value="blocked">Blocked</option>
            <option value="unblocked">Unblocked</option>
          </select>
        </div>
      </div>

      <table className="table-auto w-full border-collapse">
        {/* Table Head */}
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {/* Row Mapping */}
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
                </select>
              </td>
              <td className="px-4 py-2 flex space-x-2">
                <button
                  onClick={() => onToggleBlockUser(user._id)}
                  className={`px-4 py-1 w-24 text-center ${
                    user.isDeleted ? "bg-red-500" : "bg-yellow-500"
                  } text-white rounded hover:bg-opacity-80 flex items-center justify-center`}
                >
                  {user.isDeleted ? "Unblock" : "Block"}
                </button>
                <button
                  onClick={() => onViewDetails(user)}
                  className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
                >
                  <AiOutlineEye className="mr-2" /> View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <label htmlFor="usersPerPage" className="mr-2">
            Users per page:
          </label>
          <select
            id="usersPerPage"
            value={usersPerPage}
            onChange={(e) => setUsersPerPage(Number(e.target.value))}
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
            disabled={indexOfLastUser >= filteredUsers.length}
            className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>

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
              <strong>Mock Type:</strong> {selectedUser?.mockType}
            </p>
            <p>
              <strong>Purchased:</strong> {selectedUser?.totalMock}
            </p>

            <p>
              <strong>Remaining:</strong> {selectedUser?.mock}
            </p>
            <p>
              <strong>Status:</strong> {selectedUser.status}
            </p>
            <p>
              <strong>Transaction ID :</strong> {selectedUser.transactionId}
            </p>
            <p>
              <strong>Created At:</strong> {selectedUser.createdAt}
            </p>

            {/* this form is hidden if selectedUser?.mockType, mock, transactionId have values; if any is missing, only those fields will be visible */}
            {(!selectedUser?.mockType ||
              !selectedUser?.mock ||
              !selectedUser?.transactionId) && (
              <>
                {!selectedUser?.mock && (
                  <div className="mt-4">
                    <label htmlFor="mock" className="block mb-2">
                      Mock Number:
                    </label>
                    <input
                      type="text"
                      id="mock"
                      value={mock}
                      onChange={(e) => setMock(e.target.value)}
                      className="px-2 py-1 border rounded w-full"
                    />
                  </div>
                )}
                {!selectedUser?.mockType && (
                  <div className="mt-4">
                    <label htmlFor="mockType" className="block mb-2">
                      Mock Type:
                    </label>
                    <select
                      id="mockType"
                      value={mockType}
                      onChange={(e) => setMockType(e.target.value)}
                      className="px-2 py-1 border rounded w-full"
                    >
                      <option value="">Select Mock Type</option>
                      <option value="IELTS">IELTS</option>
                      <option value="GRE">GRE</option>
                      <option value="TOFEL">TOFEL</option>
                      <option value="Pearson PTE">Pearson PTE</option>
                    </select>
                  </div>
                )}
                {!selectedUser?.transactionId && (
                  <div className="mt-4">
                    <label htmlFor="transactionId" className="block mb-2">
                      Transaction ID:
                    </label>
                    <input
                      type="text"
                      id="transactionId"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="px-2 py-1 border rounded w-full"
                    />
                  </div>
                )}
                {/* Show Save button only if at least one field is missing */}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={(e) => {
                      onUpdateUser(); // Call the update function if not disabled
                    }}
                    className={`px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded mr-2`}
                  >
                    Save
                  </button>
                </div>
              </>
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TableAdmin;
