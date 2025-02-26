import React, { useState, useEffect, useRef, useContext } from "react";
import { FiSearch, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import BotFullBlack from "../../assets/Chim_full.png";
import logoSidemenue from "../../assets/Chim_single.png";
import { FaCalendar, FaBell, FaUserCircle } from "react-icons/fa";
import { MdOutlineGavel, MdOutlineWork, MdDevices } from "react-icons/md";
import { FaTableColumns, FaUserTie } from "react-icons/fa6";
import { TbCash } from "react-icons/tb";
import { LuArrowRightToLine, LuArrowLeftToLine } from "react-icons/lu";
import { NotificationsContext } from "../../context/NotificationsContext"; // Import the context

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, fetchNotifications, markAllAsRead, markAsRead, markAsUnread } = useContext(NotificationsContext); // Use the context
  const userRole = JSON.parse(sessionStorage.getItem("user")).role;
  const notificationsRef = useRef(null);

  useEffect(() => {
    fetchNotifications(); 
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const activeMenu = sessionStorage.getItem("m-id");
    if (activeMenu) {
      setActiveMenuItem(parseInt(activeMenu));
    }
  }, [activeMenuItem]);

  useEffect(() => {
    const activeMenu = sessionStorage.getItem("m-id");
    if (activeMenu) {
      setActiveMenuItem(parseInt(activeMenu));
    } else {
      setActiveMenuItem(1);
    }
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuClick = (menu) => {
    if (menu && menu.path) {
      setActiveMenuItem(menu.id);
      navigate(menu.path);
      sessionStorage.setItem("m-id", menu.id);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => { 
    console.log(notifications,'not');
  }, [notifications]);

  const handleRead = (id, read) => {
    if (read) {
      markAsUnread(id);
    } else {
      markAsRead(id);
    }
  };

  const menuItems = [
    { id: 1, title: "My Work", icon: <MdOutlineWork />, path: "/my-work" },
    { id: 2, title: "Dashboard", icon: <FaTableColumns />, path: "/dashboard" },
    { id: 3, title: "Dailies", icon: <FaCalendar />, path: "/dailies" },
    {
      id: 4,
      title: "Bidding",
      icon: <MdOutlineGavel />,
      path: "/bidding-list",
    },
    { id: 5, title: "Billing", icon: <TbCash />, path: "/billing" },
    { id: 6, title: "HR Portal", icon: <FaUserTie />, path: "/hr" },
    { id: 7, title: "IT", icon: <MdDevices />, path: "/it" },
  ];

  const activeMenuTitle = menuItems.find(
    (item) => item.id === activeMenuItem
  )?.title;

  return (
    <div className="flex bg-gray-100">
      {/* Sidebar */}
      <div
        data-testid="sidebar"
        className={`${
          isOpen ? "w-64" : "w-20"
        } bg-background text-white p-5 pt-8 fixed h-full transition-all duration-300 ease-in-out z-20`}
      >
        <div className="flex justify-center mb-6">
          {isOpen ? (
            <img
              src={BotFullBlack}
              alt="Company Logo Extended"
              className="w-56 h-16 object-contain"
            />
          ) : (
            <img
              src={logoSidemenue}
              alt="Company Logo Small"
              className="w-16 h-16"
            />
          )}
        </div>
        <div className={`flex ${!isOpen ? "justify-center" : "justify-end"}`}>
          {isOpen ? (
            <LuArrowLeftToLine
              data-testid="expand-sidebar"
              className="text-2xl cursor-pointer text-secondary transition-colors"
              onClick={toggleSidebar}
            />
          ) : (
            <LuArrowRightToLine
              data-testid="expand-sidebar"
              className="text-2xl cursor-pointer text-secondary transition-colors"
              onClick={toggleSidebar}
            />
          )}
        </div>
        <div className="mt-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`w-full flex ${
                !isOpen ? "justify-center" : ""
              } items-center gap-4 text-gray-300 py-3 px-4  cursor-pointer transition-all duration-300 ${
                activeMenuItem === item.id
                  ? " text-secondary border-l-4 border-secondary"
                  : "hover:bg-secondary"
              }`}
              onClick={() => handleMenuClick(item)}
            >
              <span className="text-xl transform transition-transform duration-300 hover:scale-110">
                {item.icon}
              </span>
              <span
                className={`${
                  !isOpen && "hidden"
                } origin-left duration-300 font-medium tracking-wide`}
              >
                {item.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 ${
          isOpen ? "ml-64" : "ml-20"
        } transition-all duration-300 ease-in-out`}
      >
        {/* Updated Header - Fixed position and width */}
        <header
          className="fixed top-0 right-0 h-16 flex items-center shadow-md z-10 bg-headerBackground"
          style={{ left: isOpen ? "256px" : "80px" }}
        >
          <div className="flex-1 flex items-center justify-between w-full px-6">
            <div className="flex items-center gap-6">
              <h1 className="font-light text-secondary text-[32px]">
                {activeMenuTitle}
              </h1>
              {userRole === "Admin" && (
                <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg">
                  <div className="w-8 h-8 bg-[#DEDEDE] text-black flex items-center justify-center rounded-full font-bold">
                    {JSON.parse(sessionStorage.getItem("user")).username.charAt(
                      0
                    )}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-large text-black font-bold">
                      {JSON.parse(sessionStorage.getItem("user")).username}
                    </p>
                    <p className="text-xs text-gray-500">Partner</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                {showSearch && (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-48 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-primary"
                    />
                    <FiSearch className="absolute left-3 top-3 text-gray-400" />
                  </div>
                )}
                <div className="cursor-pointer">
                  <FiSearch
                   aria-label="search"
                    className="text-2xl text-gray-600 hover:text-primary transition-colors"
                    onClick={toggleSearch}
                  />
                </div>
              </div>

              <div className="relative cursor-pointer" ref={notificationsRef}>
                <div>
                  <FaBell
                  aria-label="bell"
                    className="text-2xl text-gray-600 hover:text-primary transition-colors"
                    onClick={toggleNotifications}
                  />
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {notifications.filter((n) => !n.read).length}
                    </span>
                  )}
                </div>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
                    <div className="flex justify-between items-center px-4 py-2 border-b">
                      <h3 className="font-semibold">Notifications</h3>
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-primary hover:text-secondary transition-colors"
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-100 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`${
                            !notification.read ? "bg-gray-50" : ""
                          } px-4 py-3 hover:bg-gray-50 flex justify-between items-center`}
                          onClick={() => handleRead(notification.id, notification.read)}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2 w-2 rounded-full ${
                                notification.read ? "bg-gray-400" : "bg-red-500"
                              }`}
                            ></span>
                            <p className="text-sm text-gray-800">
                              {notification.message}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg">
                <FaUserCircle className="text-2xl text-gray-600" />
              </div>

              <button  aria-label="logout"
                className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                onClick={handleLogout}
              >
                <FiLogOut className="text-xl" />
              </button>
            </div>
          </div>
        </header>

        <main className="pt-24 px-6 pb-6 bg-headerBackground">{children}</main>
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
