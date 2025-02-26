import React,{ useState, useEffect } from "react";
import { FaClock,  FaSearch, FaCheck, FaTimes, FaCircle } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './Bidding.css';
const BiddingPackage = () => {
  const [packages] = useState([
    {
      id: "BID-2024-001",
      name: "Commercial Building Project",
      description: "Construction of 5-story commercial complex",
      status: "Pending",
      type: "Commercial", 
      budget: "High",
      location: "Urban",
      expiryDate: "2025-03-25T23:59:59",
      tasks: [
        {
          id: 1,
          showEp: "EP01",
          grpSeq: "SEQ001",
          service: "Construction",
          task: "Foundation Work",
          description: "Laying foundation for main building",
          DueDate: "2024-04-01",
          partnerEstAmount: 50000,
          partnerDueDate: new Date(),
          partnerEstPD: 45,
          bidStatus: "Pending",
          Status: "In Progress",
          estimatedDays: 45,
          isSubmitted: false
        },
        {
          id: 2,
          showEp: "EP02",
          grpSeq: "SEQ002",
          service: "Construction",
          task: "Structural Framework",
          description: "Steel framework installation",
          DueDate: "2024-05-15",
          partnerEstAmount: 75000,
          partnerDueDate: new Date(),
          partnerEstPD: 60,
          bidStatus: "Pending",
          Status: "Pending",
          estimatedDays: 60,
          isSubmitted: false
        },
        {
          id: 3,
          showEp: "EP03",
          grpSeq: "SEQ003", 
          service: "Electrical",
          task: "Wiring Installation",
          description: "Complete electrical wiring setup",
          DueDate: "2024-06-01",
          partnerEstAmount: 35000,
          partnerDueDate: new Date(),
          partnerEstPD: 30,
          bidStatus: "Pending",
          Status: "Pending",
          estimatedDays: 30,
          isSubmitted: false
        },
        {
          id: 4,
          showEp: "EP04",
          grpSeq: "SEQ004",
          service: "Plumbing",
          task: "Plumbing System",
          description: "Installation of water and drainage systems",
          DueDate: "2024-06-15",
          partnerEstAmount: 40000,
          partnerDueDate: new Date(),
          partnerEstPD: 25,
          bidStatus: "Pending",
          Status: "Pending",
          estimatedDays: 25,
          isSubmitted: false
        },
        {
          id: 5,
          showEp: "EP05",
          grpSeq: "SEQ005",
          service: "Interior",
          task: "Interior Finishing",
          description: "Final interior work and finishing",
          DueDate: "2024-07-01",
          partnerEstAmount: 60000,
          partnerDueDate: new Date(),
          partnerEstPD: 40,
          bidStatus: "Pending",
          Status: "Pending",
          estimatedDays: 40,
          isSubmitted: false
        }
      ]
    },
    {
      id: "BID-2024-002",
      name: "Residential Complex",
      description: "Development of luxury apartments",
      status: "Open",
      type: "Residential",
      budget: "Medium",
      location: "Suburban",
      expiryDate: "2025-03-30T23:59:59",
      tasks: [
        {
          id: 1,
          showEp: "EP01",
          grpSeq: "SEQ001",
          service: "Site Work",
          task: "Site Preparation",
          description: "Land clearing and initial groundwork",
          botDueDate: "2024-04-15",
          partnerEstAmount: 35000,
          DueDate: "2024-07-01",
          partnerDueDate: new Date(),
          partnerEstPD: 30,
          bidStatus: "Pending",
          botStatus: "Pending",
          Status: "In Progress",
          estimatedDays: 30,
          isSubmitted: false
        },
        {
          id: 2,
          showEp: "EP02",
          grpSeq: "SEQ002",
          service: "Architecture",
          task: "Design Planning",
          description: "Detailed architectural planning",
          botDueDate: "2024-05-01",
          DueDate: "2024-07-01",
          partnerEstAmount: 45000,
          partnerDueDate: new Date(),
          partnerEstPD: 40,
          bidStatus: "Pending",
          botStatus: "Not Started",
          Status: "In Progress",
          estimatedDays: 40,
          isSubmitted: false
        },
        {
          id: 3,
          showEp: "EP03",
          grpSeq: "SEQ003",
          service: "Interior",
          task: "Interior Design",
          description: "Interior design and planning",
          botDueDate: "2024-05-15",
          DueDate: "2024-07-01",
          partnerEstAmount: 55000,
          partnerDueDate: new Date(),
          partnerEstPD: 35,
          bidStatus: "Pending",
          botStatus: "Not Started",
          Status: "In Progress",
          estimatedDays: 35,
          isSubmitted: false
        }
      ]
    }
  ]);

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    budget: "",
    location: ""
  });
  const [gridData, setGridData] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [bidStatus, setBidStatus] = useState("Not Bid");

  // Extract logic into variables
  const circleColor=()=>{
    if(bidStatus === 'Partially Bid'){
      return 'text-primary';
    }else if(bidStatus === 'Fully Bid'){
      return 'text-green-500';
    }else{
      return 'text-gray-500';
    }
  }

  const badgeClasses=()=>{
    if(bidStatus === 'Partially Bid'){
      return 'bg-primary/10 text-primary';
    }else if(bidStatus === 'Fully Bid'){
      return 'bg-green-100 text-green-800';
    }else{
      return 'bg-gray-100 text-gray-800';
    }
  }


  useEffect(() => {
    if (selectedPackage) {
      setGridData(selectedPackage.tasks);
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const expiryTime = new Date(selectedPackage.expiryDate).getTime();
        const difference = expiryTime - now;
        if (difference <= 0) {
          setTimeLeft("EXPIRED");
          clearInterval(timer);
        } else {
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          setTimeLeft(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [selectedPackage]);

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
  };

  const updateBidStatus = (tasks) => {
    const submittedTasks = tasks.filter(task => task.isSubmitted).length;
    if (submittedTasks === 0) setBidStatus("Not Bid");
    else if (submittedTasks === tasks.length) setBidStatus("Fully Bid");
    else setBidStatus("Partially Bid");
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSearch = () => {
    toast.info("Search filters applied");
  };

  const handleTaskChange = (id, field, value) => {
    setGridData(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmitBid = (taskId) => {
    const updatedGridData = gridData.map(item =>
      item.id === taskId ? { ...item, isSubmitted: true } : item
    );
    setGridData(updatedGridData);
    updateBidStatus(updatedGridData);
    toast.success("Bid submitted successfully!");
  };

  const handleRejectClick = (taskId) => {
    setSelectedTaskId(taskId);
    setShowRejectModal(true);
  };

  const handleSaveRejection = () => {
    if (rejectionReason.trim() === "") {
      toast.error("Please provide a rejection reason",);
      return;
    }
    toast.error("Bid rejected successfully",);
    setShowRejectModal(false);
    setRejectionReason("");
    setSelectedTaskId(null);
  };

  const getTotalEstimatedAmount = () => {
    return gridData.reduce((sum, item) => sum + (Number(item.partnerEstAmount) || 0), 0);
  };

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filters.status || pkg.status === filters.status;
    const matchesBudget = !filters.budget || pkg.budget === filters.budget;
    const matchesLocation = !filters.location || pkg.location === filters.location;

    return matchesSearch && matchesStatus && matchesBudget && matchesLocation;
  });

  const getStatusDotColor = (status) => {
    switch (status) {
      case "Open":
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
    <div className="flex h-screen bg-gray-100 overflow-hidden w-full">
      <ToastContainer position="top-center" autoClose={3000}/>
      <div className="h-full verflow-y-auto bg-white transition-all border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Package List</h2>
        
        <div className="mb-6 space-y-4">
          <div className="flex items-center space-x-4">
            <select
            aria-label="Select status"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="">Select status</option>
              <option value="Open">Open</option>
              <option value="Pending">Pending</option>
              <option value="Expired">Expired</option>
            </select>

            <select
            aria-label="Select Budget"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              value={filters.budget}
              onChange={(e) => handleFilterChange("budget", e.target.value)}
            >
              <option value="">Select Budget</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
            aria-label="Select Location"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
            >
              <option value="">Select Location</option>
              <option value="Urban">Urban</option>
              <option value="Suburban">Suburban</option>
              <option value="Rural">Rural</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search packages..."
              className="w-full bg-transparent outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredPackages.map((pkg) => (
            <div role="listitem"
              key={pkg.id}
              onClick={() => handlePackageSelect(pkg)}
              className={`relative p-4 rounded-lg cursor-pointer transition-all transform hover:scale-102 hover:-translate-y-1 ${selectedPackage?.id === pkg.id ? "border-2 border-primary text-gray-800 shadow-lg" : "bg-gray-50 hover:bg-gray-100 shadow-md hover:shadow-lg"}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col space-y-1">
                  <div className="text-sm font-medium text-gray-900">{pkg.id}</div>
                  <div className="text-base font-semibold text-gray-800">{pkg.name}</div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center space-x-2">
                  
                  <span className="px-4 py-1.5 rounded-lg border border-black flex items-center text-black shadow-md">
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${getStatusDotColor(
                        pkg.status
                      )}`}
                    ></span>
                    {pkg.status}
                  </span>
                
                  </div>
                  <div className="flex items-center space-x-1 px-2 py-1 rounded shadow-sm bg-gray-50">
                    <FaClock className="text-black text-sm" />
                    <span className="text-xs font-mono text-black font-semibold">{timeLeft || "--:--:--"}</span>
                  </div>
                </div>
              </div>
              <textarea
                className="w-full p-2 mt-2 text-sm border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none shadow-sm"
                placeholder="Add notes here..."
                rows="2"
                onClick={(e) => e.stopPropagation()}
              ></textarea>
            </div>
          ))}
        </div>
      </div>

      <div className="h-full overflow-y-auto pt-0 p-6">
        {selectedPackage ? (
          <div className="bg-white h-full rounded-lg shadow-sm flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Package Detail</h2>
                <div className="flex items-center space-x-2">
                  <FaCircle className={`text-xs ${circleColor}`} />
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${badgeClasses}`}>{bidStatus}</span>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4">
                <div className="bg-gray-50 rounded h-24 p-4 flex items-center space-x-4">
                  <div>
                    <p className="text-[11px] font-bold text-gray-500">Package ID</p>
                    <p className="text-[14px] text-gray-800">{selectedPackage.id}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded h-24 p-4 flex items-center space-x-4">
                  <div>
                    <p className="text-[11px] font-bold text-gray-500">Package Name</p>
                    <p className="text-[14px] text-gray-800">{selectedPackage.name}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded h-24 p-4 flex items-center space-x-4">
                  <div>
                    <p className="text-[11px] font-bold text-gray-500">Bid Status</p>
                    <p className="text-[14px] text-gray-800">{selectedPackage.status}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded h-24 p-4 flex items-center space-x-4">
                  <div>
                    <p className="text-[11px] font-bold text-gray-500">Bid Expiry</p>
                    <div className="flex items-center space-x-2">
                      <FaClock className="text-primary" />
                      <p className="text-[14px] text-gray-800">{timeLeft}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-hidden p-6">
              <div className="h-full overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-background sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">Show/Ep/Grp/SEQ</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">Task</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">Partner Est. Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">Partner Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">Partner Est. PD</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">Bid Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {gridData.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-[50px]">{item.showEp}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.service}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={item.task}
                            onChange={(e) => handleTaskChange(item.id, "task", e.target.value)}
                            className="border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.DueDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            value={item.partnerEstAmount}
                            onChange={(e) => handleTaskChange(item.id, "partnerEstAmount", e.target.value)}
                            className="border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <DatePicker
                            selected={item.partnerDueDate}
                            onChange={(date) => handleTaskChange(item.id, "partnerDueDate", date)}
                            className="border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            value={item.partnerEstPD}
                            onChange={(e) => handleTaskChange(item.id, "partnerEstPD", e.target.value)}
                            className="border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.bidStatus}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.Status}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleSubmitBid(item.id)}
                              className="text-green-600 hover:text-green-800"
                              title="Accept Bid"
                              disabled={item.isSubmitted}
                            >
                              <FaCheck className={`text-lg ${item.isSubmitted ? "opacity-50" : ""}`} />
                            </button>
                            <button onClick={() => handleRejectClick(item.id)} className="text-red-600 hover:text-red-800" title="Reject Bid">
                              <FaTimes className="text-lg" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-[#f3f4f6] sticky bottom-0">
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-right font-medium text-primary">Total Partner's Estimated Amount:</td>
                      <td className="px-6 py-4 font-bold text-primary">${getTotalEstimatedAmount().toLocaleString()}</td>
                      <td colSpan="5"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-lg">Select a package to view details</p>
          </div>
        )}
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <h3 className="text-xl font-semibold text-primary mb-4 pb-2 border-b border-gray-200">Decline Item - {selectedPackage?.id}</h3>
            <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-2">Reason for Declining</label>
            <textarea id="rejectionReason"
              className="w-full h-32 p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Please provide reason for decline..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            ></textarea>
            <div className="flex justify-end space-x-3 mt-4">
              <button
               onClick={handleSaveRejection}
               
                className="px-4 py-2 bg-primary text-gray-600  rounded-md  hover:bg-secondary hover:text-white transition-colors text-white"
              >
                save
              </button>
              <button
                 onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                  setSelectedTaskId(null);
                }}
                className="px-4 py-2 bg-gray-100  text-black rounded-md hover:bg-secondary hover:text-white transition-colors "
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BiddingPackage;