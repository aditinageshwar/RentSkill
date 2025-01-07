import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import axiosInstance from "../Axios.js";
import moment from 'moment';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userResponse = await axiosInstance.get("/api/userProfile");
        if (userResponse.data.message) 
          alert(userResponse.data.message);
        else if (userResponse.data.user)
        { 
          const userData = userResponse.data.user;
          setUserData(userData);

          const response = await axiosInstance.get(`/api/notification/?email=${userData.email}`);
          setNotifications(response.data);
        }
      } catch (error) {
        console.error("Error fetching notifications", error);
      } 
    };
    fetchNotifications();

    gsap.fromTo(
      ".heading",
      { x: -200, opacity: 0 },
      { x: 0, opacity: 1, duration: 1 } 
    );
  }, []);

  const markAsRead = async(id) => {
    try{
      const response = await axiosInstance.patch(`/api/notification/markOne/?email=${userData.email}&notificationId=${id}`, { isRead: true });
      setNotifications((prev) => prev.map((notification) =>
        notification._id === id ? { ...notification, isRead: true } : notification
      ));
    }
    catch (error) {
      alert("Error marking notification as read", error);
    }
  };

  const markAllAsRead = async() => {
    try{
      const response = await axiosInstance.patch(`/api/notification/markAllAsRead/?email=${userData.email}`, { isRead: true });
      setNotifications((prev) => prev.map((notification) => 
      ({ ...notification, isRead: true })
      ));
    }
    catch (error) {
      alert("Error marking notification as read", error);
    }
  };
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="relative mb-6 flex items-center">
        <h1 className="text-3xl font-semibold mx-auto heading">Notifications</h1>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="absolute right-0 bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-600">
            Mark All as Read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white shadow rounded-lg divide-y">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div key={index} className={`flex justify-between items-center px-4 py-3 ${index % 2 === 0 ? "bg-red-50" : "bg-orange-50"} hover:bg-gray-100`}>
              <div>
                <p className="text-sm font-medium">{notification.message}</p>
                <p className="text-xs text-gray-500">Received {moment(notification.createdAt).fromNow()} </p>
              </div>
              {!notification.isRead && (
                <button onClick={() => markAsRead(notification._id)} className="text-blue-500 text-sm font-semibold hover:underline">
                  Mark as Read
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            No notifications available.
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
