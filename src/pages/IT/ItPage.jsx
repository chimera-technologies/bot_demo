import React, { useState, useEffect, useContext } from "react";
import { FaSync, FaDownload, FaSearch } from "react-icons/fa";
import Spinner from "../../components/Spinner/Spinner";
import { ITContext } from "../../context/ItPageContext";
const ItPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [assetFilter, setAssetFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [selectedShow, setSelectedShow] = useState("");
  const [isOn, setIsOn] = useState(false);
  const { fetchData } = useContext(ITContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkData = async () => {
      setLoading(true);
      const data = await fetchData();
      setGridData(data);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    };
    fetchWorkData();
  }, [fetchData]);

  // Filter Show/Ep based on search
  const filteredassetNumber = gridData
    .map((pkg) => pkg.assetNumber)
    .filter((assetNumber, index, self) => self.indexOf(assetNumber) === index) // Unique values
    .filter((assetNumber) =>
      assetNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const filteredWorkData = gridData.filter((pkg) => {
    return (
      (!selectedShow || pkg.assetNumber === selectedShow) &&
      (!statusFilter || pkg.status === statusFilter) &&
      (!assetFilter || pkg.assetType === assetFilter) &&
      (!locationFilter || pkg.location === locationFilter)
    );
  });

  const handlePartnerChange = (index, value) => {
    console.log("Partner changed to:", value);
    filteredWorkData[index].partner = value;
  };

  const handleFetchData = () => {
    console.log("Fetching data...");
  };

  const handleReload = () => {
    setSearchQuery(""); // Clear search input
    setSelectedShow(""); // Reset selected show
    setStatusFilter(""); // Reset status filter
    setLocationFilter(""); // Reset date filter
    setAssetFilter(""); // Reset task filter
  };

  const handleDownload = () => {
    console.log("Downloading data...");
  };

  const getStatusDotColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-500";
      case "Inactive":
        return "bg-red-500";
      case "Under Maintenance":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedRows(gridData.map((item) => item.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) => {
      if (prev.includes(id)) {
        const newSelected = prev.filter((itemId) => itemId !== id);
        setSelectAll(false);
        return newSelected;
      } else {
        const newSelected = [...prev, id];
        if (newSelected.length === gridData.length) {
          setSelectAll(true);
        }
        return newSelected;
      }
    });
  };

  return (
    <div className="bg-white rounded-lg w-full" data-testid="it-page">
      {loading ? (
        <div
          className="flex justify-center items-center h-screen"
          data-testid="spinner"
        >
          <Spinner />{" "}
        </div>
      ) : (
        <>
          <div className="px-4 pt-8" data-testid="it-content">
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
                    <label htmlFor="searchInput" className="sr-only">
                      Search asset Type
                    </label>
                    <input
                      id="searchInput"
                      type="text"
                      placeholder="Search asset Type"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsDropdownOpen(true)}
                      className="px-3 py-2 w-64 outline-none rounded-lg"
                    />
                    <FaSearch className="mr-3 text-gray-400" />
                  </div>

                  {isDropdownOpen && searchQuery && (
                    <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                      {filteredassetNumber.map((pkg) => (
                        <div
                          key={pkg}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setSearchQuery(pkg);
                            setIsDropdownOpen(false);
                            setSelectedShow(pkg);
                          }}
                        >
                          <div className="font-semibold">{pkg}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <FaSearch className="w-5 h-5 text-gray-600 mx-2" />

                <button
                  onClick={handleFetchData}
                  className="bg-[#8c2100] hover:bg-opacity-90 text-white px-6 py-2 rounded transition duration-300"
                >
                  Apply
                </button>
              </div>
              <div className="flex">
                <div className="flex flex-col -mt-5 pr-3">
                  <label
                    htmlFor="statusFilter"
                    className="text-sm font-medium text-gray-700 mb-1"
                  >
                    Status
                  </label>
                  <select
                    id="statusFilter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border rounded-lg bg-white outline-none h-[40px]"
                  >
                    <option value="">All</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                  </select>
                </div>
                <div className="flex flex-col -mt-5 pr-3">
                  <label
                    htmlFor="assetFilter"
                    className="text-sm font-medium text-gray-700 mb-1"
                  >
                    Asset
                  </label>
                  <select
                    id="assetFilter"
                    value={assetFilter}
                    onChange={(e) => setAssetFilter(e.target.value)}
                    className="px-4 py-2 border rounded-lg bg-white outline-none h-[40px]"
                  >
                    <option value="">All</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Desktop">Desktop</option>
                    <option value="Printer">Printer</option>
                    <option value="Projector">Projector</option>
                  </select>
                </div>

                <div className="flex flex-col -mt-5 pr-3">
                  <label
                    htmlFor="locationFilter"
                    className="text-sm font-medium text-gray-700 mb-1"
                  >
                    Location
                  </label>
                  <select
                    id="locationFilter"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="px-4 py-2 border rounded-lg bg-white outline-none h-[40px]"
                  >
                    <option value="">All</option>
                    <option value="New York">New York</option>
                    <option value="San Francisco">San Francisco</option>
                    <option value="Los Angeles">Los Angeles</option>
                    <option value="Chicago">Chicago</option>
                  </select>
                </div>

                <button
                  onClick={() => setIsOn(!isOn)}
                  className={`w-16 h-5 flex items-center rounded-full  transition duration-300 mt-3 mr-3 ${
                    isOn ? "bg-green-500" : "bg-[#8C2100]"
                  }`}
                >
                  <div
                    className={`w-6 h-6  rounded-full shadow-md transform transition  ${
                      isOn
                        ? "translate-x-10 bg-white"
                        : "translate-x-0 bg-[#8C2100]"
                    }`}
                  ></div>
                </button>
                <span className="text-sm font-medium text-gray-700 mb-1 mt-3 mr-3 text-nowarp">
                  All Active
                </span>
                <button
                  onClick={handleFetchData}
                  className="bg-[#8c2100] hover:bg-opacity-90 text-white px-6 py-2 rounded transition duration-300"
                >
                  FETCH
                </button>
              </div>
            </div>
          </div>

          <div className="w-full overflow-auto">
            <table className="min-w-full bg-white overflow-hidden shadow-lg">
              <thead className="bg-background text-white divide-x">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap flex justify-center">
                    <div className="flex items-center ">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 rounded border-gray-300 accent-primary"
                        checked={selectAll}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left w-32 whitespace-nowrap">
                    Asset Number
                  </th>
                  <th className="px-6 py-4 text-left whitespace-nowrap">
                    Asset Type
                  </th>
                  <th className="px-6 py-4 text-left whitespace-nowrap">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left whitespace-nowrap">
                    Allocated To
                  </th>
                  <th className="px-6 py-4 text-left w-72 whitespace-nowrap">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left whitespace-nowrap">
                    Phone Number
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 ">
                {filteredWorkData.map((pkg, index) => (
                  <tr
                    key={pkg.id}
                    className="hover:bg-gray-50 transition duration-300 divide-x divide-gray-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-[#8C2100] rounded border-gray-300 focus:ring-[#8C2100] accent-primary"
                        checked={selectedRows.includes(pkg.id)}
                        onChange={() => handleRowSelect(pkg.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {" "}
                      <span className="px-4 py-1.5 flex items-center text-black">
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${getStatusDotColor(
                            pkg.status
                          )}`}
                        ></span>
                      </span>
                    </td>
                    <td className="px-6 py-4 w-32 break-words">
                      {pkg.assetNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {pkg.assetType}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {pkg.location}
                    </td>
                    <td className="px-6 py-4 pr-4 whitespace-nowrap">
                      <select
                        value={pkg.allocatedTo}
                        onChange={(e) =>
                          handlePartnerChange(index, e.target.value)
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                      >
                        {pkg.allocationList.map((user) => (
                          <option key={user} value={user}>
                            {user}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{pkg.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap w-72">
                      {pkg.phoneNumber}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ItPage;
