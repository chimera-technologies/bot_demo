import React, { useState, useEffect } from "react";
import {
  FaEye,
  FaSync,
  FaDownload,
  FaSearch,
  FaClock,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const BidPackagesGrid = () => {
  const navigate = useNavigate();
  const [editedNotes, setEditedNotes] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [taskFilter, setTaskFilter] = useState("");
  const [timeRemaining, setTimeRemaining] = useState({});

  const bidPackages = [
    {
      id: "PKG001",
      name: "Commercial Building Project",
      status: "Active",
      expiry: "2025-01-30",
      notes: "Requires immediate attention",
    },
    {
      id: "PKG002",
      name: "Residential Complex Development",
      status: "Expired",
      expiry: "2024-02-15",
      notes: "Pending documentation",
    },
    {
      id: "PKG003",
      name: "Infrastructure Development",
      status: "Active",
      expiry: "2025-01-26",
      notes: "High priority project",
    },
    {
      id: "PKG004",
      name: "School Renovation Project",
      status: "Active",
      expiry: "2025-01-25",
      notes: "Budget review pending",
    },
    {
      id: "PKG005",
      name: "Hospital Wing Extension",
      status: "Pending",
      expiry: "2025-01-27",
      notes: "Awaiting regulatory approval",
    },
    {
      id: "PKG006",
      name: "Shopping Mall Renovation",
      status: "Pending",
      expiry: "2025-01-30",
      notes: "Vendor selection in progress",
    },
    {
      id: "PKG007",
      name: "Public Park Development",
      status: "Pending",
      expiry: "2025-01-30",
      notes: "Environmental assessment ongoing",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeRemaining = {};
      bidPackages.forEach((pkg) => {
        const expiryDate = new Date(pkg.expiry);
        const now = new Date();
        const diff = expiryDate - now;

        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);

          newTimeRemaining[pkg.id] = {
            hours: hours.toString().padStart(2, "0"),
            minutes: minutes.toString().padStart(2, "0"),
            seconds: seconds.toString().padStart(2, "0"),
          };
        } else {
          newTimeRemaining[pkg.id] = {
            hours: "00",
            minutes: "00",
            seconds: "00",
          };
        }
      });
      setTimeRemaining(newTimeRemaining);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const filteredPackages = bidPackages.filter((pkg) => {
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || pkg.status === statusFilter;
    const matchesDate = !dateFilter || pkg.expiry === dateFilter;
    const matchesTask =
      !taskFilter || pkg.notes.toLowerCase().includes(taskFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesDate && matchesTask;
  });

  const handleViewPackage = (pkg) => {
    navigate("/bidding-detail");
  };

  const handleNotesChange = (id, value) => {
    setEditedNotes((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleFetchData = () => {
    console.log("Fetching data...");
  };

  const handleReload = () => {
    console.log("Reloading data...");
  };

  const handleDownload = () => {
    console.log("Downloading data...");
  };

  const getStatusDotColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-500";
      case "Expired":
        return "bg-red-500";
      case "Pending":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="mx-auto bg-white rounded-lg">
      <div className="px-4 pt-8">
        <div className="flex justify-between mb-4">
          <div className="flex gap-4 items-center">
            <button
              onClick={handleReload}
              className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition duration-300"
            >
              <FaSync className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100 transition duration-300"
            >
              <FaDownload className="w-5 h-5" />
            </button>
            <div className="relative">
              <div className="flex items-center border rounded-lg bg-white">
                <input
                  type="text"
                  placeholder="Search packages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsDropdownOpen(true)}
                  className="px-3 py-2 w-64 outline-none rounded-lg"
                />
                <FaSearch className="mr-3 text-gray-400" />
              </div>
              {isDropdownOpen && searchQuery && (
                <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                  {filteredPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSearchQuery(pkg.name);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <div className="font-semibold">{pkg.name}</div>
                      <div className="text-sm text-gray-600">{pkg.id}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <FaSearch className="w-5 h-5 text-gray-600 mx-2" />

            <div className="flex flex-col -mt-5">
              <label
                className="text-sm font-medium text-gray-700 mb-1"
                htmlFor="status"
              >
                Status
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-white outline-none h-[40px]"
              >
                <option value="">All</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Expired">Expired</option>
              </select>
            </div>

            <div className="flex flex-col -mt-5">
              <label
                className="text-sm font-medium text-gray-700 mb-1"
                htmlFor="date"
              >
                Date
              </label>
              <select
                id="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-white outline-none h-[40px]"
              >
                <option value="">All</option>
                {[...new Set(bidPackages.map((pkg) => pkg.expiry))].map(
                  (date) => (
                    <option key={date} value={date}>
                      {date}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="flex flex-col -mt-5">
              <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="task">
                Task
              </label>
              <select
              id="task"
                value={taskFilter}
                onChange={(e) => setTaskFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-white outline-none h-[40px]"
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="review">Review</option>
                <option value="approval">Approval</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleFetchData}
            className="bg-[#8c2100] hover:bg-opacity-90 text-white px-6 py-2 rounded transition duration-300"
          >
            FETCH
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white overflow-hidden shadow-lg">
          <thead className="bg-background text-white">
            <tr>
              <th className="px-6 py-4 text-left">PKG ID</th>
              <th className="px-6 py-4 text-left">Bid PKG Name</th>
              <th className="px-6 py-4 text-left">Bid Status</th>
              <th className="px-6 py-4 text-left">Bid Expiry</th>
              <th className="px-6 py-4 text-left">View</th>
              <th className="px-6 py-4 text-left">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPackages.map((pkg) => (
              <tr
                key={pkg.id}
                className="hover:bg-gray-50 transition duration-300"
              >
                <td className="px-6 py-4">{pkg.id}</td>
                <td className="px-6 py-4">{pkg.name}</td>
                <td className="px-6 py-4">
                  <span className="px-4 py-1.5 rounded-lg border border-black flex items-center text-black shadow-md">
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${getStatusDotColor(
                        pkg.status
                      )}`}
                    ></span>
                    {pkg.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <FaClock className="text-gray-600" />
                    <span>
                      {timeRemaining[pkg.id]
                        ? `${timeRemaining[pkg.id].hours}:${
                            timeRemaining[pkg.id].minutes
                          }:${timeRemaining[pkg.id].seconds}`
                        : "00:00:00"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleViewPackage(pkg)}
                    className="flex items-center text-primary hover:text-secondary transition duration-300"
                  >
                    <FaEye className="mr-2 text-[#8C2100]" />
                    <span className="text-[#8C2100]">View Package</span>
                  </button>
                </td>
                <td className="px-6 py-4">
                  <textarea
                    value={editedNotes[pkg.id] || pkg.notes}
                    onChange={(e) => handleNotesChange(pkg.id, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    rows="2"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BidPackagesGrid;
