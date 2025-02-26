import React, { useState, useEffect, useRef, useContext } from "react";
import { FaSync, FaDownload, FaSearch } from "react-icons/fa";
import ButtonWithColor from "../../components/Button/ButtonWithColor";
import { format, parseISO } from "date-fns";
import * as XLSX from "xlsx";
import { MyWorkContext } from "../../context/MyworkContext";
import Spinner from "../../components/Spinner/Spinner";

const MyWork = () => {
  const [editedNotes, setEditedNotes] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [taskFilter, setTaskFilter] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [selectedShow, setSelectedShow] = useState("");
  const textareaRef = useRef(null);
  const [datePickerValue, setDatePickerValue] = useState("");
  const userRole = JSON.parse(sessionStorage.getItem("user")).role;
  const [isOn, setIsOn] = useState(false);
  const { fetchData } = useContext(MyWorkContext);
  const [loading, setLoading] = useState(true);

  const fetchWorkData = async () => {
    setLoading(true);
    try{
      const data = await fetchData();
      setGridData(data);
    }catch{
      console.log("Error fetching data");
    }
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    fetchWorkData();
  }, []);

  const filteredShows = gridData
    .map((pkg) => pkg.show)
    .filter((show, index, self) => self.indexOf(show) === index)
    .filter((show) => show.toLowerCase().includes(searchQuery.toLowerCase()));

  const filteredWorkData = gridData.filter((pkg) => {
    return (
      (!selectedShow || pkg.show === selectedShow) &&
      (!statusFilter || pkg.status === statusFilter) &&
      (!dateFilter || pkg.botDue === dateFilter) &&
      (!taskFilter || pkg.task === taskFilter)
    );
  });

  const handleDateChange = (value) => {
    const formattedDate = format(parseISO(value), "dd-MMM-yy");
    setDateFilter(formattedDate);
    setDatePickerValue(value);
  };

  const handlePartnerChange = (index, value) => {
    filteredWorkData[index].partner = value;
    setGridData((prevData) =>
      prevData.map((item, i) =>
        i === index ? { ...item, partner: value } : item
      )
    );
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
    setSearchQuery("");
    setSelectedShow("");
    setStatusFilter("");
    setDateFilter("");
    setTaskFilter("");
  };

  const handleDownload = () => {
    let dataToExport;
    const selectedData = filteredWorkData.filter((data) =>
      selectedRows.includes(data.id)
    );

    if (userRole === "Admin") {
      dataToExport = selectedData.map((data) => ({
        id: data.id,
        show: data.show,
        shotName: data.shotName,
        task: data.task,
        status: data.status,
        wtd: data.wtd,
        description: data.description,
        botDue: data.botDue,
        estDue: data.estDue,
        estPds: data.estPds,
        partner: data.partner,
        partnerList: data.partnerList,
      }));
    } else {
      dataToExport = selectedData.map((data) => ({
        id: data.id,
        show: data.show,
        shotName: data.shotName,
        task: data.task,
        status: data.status,
        wtd: data.wtd,
        description: data.description,
        botDue: data.botDue,
        estDue: data.estDue,
      }));
    }

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Work Data");
    XLSX.writeFile(wb, "work_data.xlsx");
  };

  const getStatusDotColor = (status) => {
    switch (status) {
      case "Done":
        return "bg-green-500";
      case "Expired":
        return "bg-red-500";
      case "Pending":
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
    <div className="bg-white rounded-lg w-full" data-testid="mywork">
      {loading ? (
        <div className="flex justify-center items-center h-screen" data-testid="spinner">
          <Spinner />
        </div>
      ) : (
        <>
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
                      placeholder="Search Show/Ep..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsDropdownOpen(true)}
                      className="px-3 py-2 w-64 outline-none rounded-lg"
                      id="search-input"
                    />
                    <FaSearch className="mr-3 text-gray-400" />
                  </div>

                  {isDropdownOpen && searchQuery && (
                    <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                      {filteredShows.map((pkg) => (
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
              </div>

              <div className="flex gap-4 items-center">
                <div className="flex flex-col">
                  <label
                    htmlFor="status-filter"
                    className="text-sm font-medium text-gray-700 mb-1"
                  >
                    Status
                  </label>
                  <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border rounded-lg bg-white outline-none h-[40px]"
                  >
                    <option value="">All</option>
                    <option value="Done">Done</option>
                    <option value="Pending">Pending</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="date-filter"
                    className="text-sm font-medium text-gray-700 mb-1"
                  >
                    Date
                  </label>
                  <input
                    id="date-filter"
                    type="date"
                    value={datePickerValue}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="task-filter"
                    className="text-sm font-medium text-gray-700 mb-1"
                  >
                    Task
                  </label>
                  <select
                    id="task-filter"
                    value={taskFilter}
                    onChange={(e) => setTaskFilter(e.target.value)}
                    className="px-4 py-2 border rounded-lg bg-white outline-none h-[40px]"
                  >
                    <option value="">All Tasks</option>
                    <option value="Paint">Paint</option>
                    <option value="Comp">Comp</option>
                    <option value="Roto">Roto</option>
                    <option value="RM">RM</option>
                  </select>
                </div>
                <button
                  onClick={() => setIsOn(!isOn)}
                  className={`w-16 h-5 flex items-center rounded-full  transition duration-300 mt-6 mr-3 ${
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
                <span className="text-sm font-medium text-gray-700 mb-1 mt-6 mr-3 text-nowarp">
                  All Active
                </span>
                <button
                  onClick={handleFetchData}
                  className="bg-[#8c2100] hover:bg-opacity-90 text-white px-6 py-2 rounded transition duration-300 mt-6"
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
                    Show/Ep
                  </th>
                  <th className="px-6 py-4 text-left w-32 whitespace-nowrap">
                    Shot Name
                  </th>
                  <th className="px-6 py-4 text-left whitespace-nowrap">
                    Task
                  </th>
                  <th className="px-6 py-4 text-left whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left whitespace-nowrap">WTD</th>
                  <th className="px-6 py-4 text-left w-72 whitespace-nowrap">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left whitespace-nowrap">
                     Due
                  </th>
                  <th className="px-6 py-4 text-left whitespace-nowrap">
                    Est. Due
                  </th>
                  {userRole === "Admin" && (
                    <th className="px-6 py-4 text-left whitespace-nowrap">
                      Est. PDs
                    </th>
                  )}
                  {userRole === "Admin" && (
                    <th className="px-6 py-4 text-left whitespace-nowrap">
                      Partner Team Member
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-center">
                {filteredWorkData.map((pkg, index) => (
                  <tr
                    key={pkg.id}
                    className="hover:bg-gray-50 transition duration-300 divide-x divide-gray-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 rounded border-gray-300  accent-primary"
                        checked={selectedRows.includes(pkg.id)}
                        onChange={() => handleRowSelect(pkg.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{pkg.show}</td>
                    <td className="px-6 py-4 w-32 break-words">
                      {pkg.shotName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center items-center">
                      <ButtonWithColor text={pkg.task} />
                      <span> {pkg.task}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-4 py-1.5 flex items-center text-black">
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${getStatusDotColor(
                            pkg.status
                          )}`}
                        ></span>
                        {pkg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{pkg.wtd}</td>
                    <td className="px-6 py-4 whitespace-nowrap w-72">
                      <textarea
                        ref={textareaRef}
                        value={editedNotes[pkg.id] || pkg.description}
                        onChange={(e) =>
                          handleNotesChange(pkg.id, e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none scroll-smooth"
                        rows="2"
                      />
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {pkg.botDue}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {pkg.estDue}
                    </td>
                    {userRole === "Admin" && (
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        {pkg.estPds}
                      </td>
                    )}
                    {userRole === "Admin" && (
                      <td className="px-6 py-4 pr-4 whitespace-nowrap">
                        <select
                          value={pkg.partner}
                          onChange={(e) =>
                            handlePartnerChange(index, e.target.value)
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                        >
                          {pkg.partnerList.map((partner) => (
                            <option key={partner} value={partner}>
                              {partner}
                            </option>
                          ))}
                        </select>
                      </td>
                    )}
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

export default MyWork;
