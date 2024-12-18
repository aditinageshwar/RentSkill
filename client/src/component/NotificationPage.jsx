// import React, { useState } from "react";

// const NotificationPage = () => {
//   const [notifications, setNotifications] = useState([
//     {
//       id: 1,
//       type: "Booking",
//       message: "Your booking for 'Photography' has been confirmed.",
//       timestamp: "5 minutes ago",
//       isRead: false,
//     },
//     {
//       id: 2,
//       type: "Payment",
//       message: "You received a payment of Rs. 500 for 'Cooking' services.",
//       timestamp: "2 hours ago",
//       isRead: false,
//     },
//     {
//       id: 3,
//       type: "Message",
//       message: "John Doe sent you a message: 'Is the service still available?'",
//       timestamp: "1 day ago",
//       isRead: true,
//     },
//     {
//       id: 4,
//       type: "System",
//       message: "New features have been added to the platform!",
//       timestamp: "2 days ago",
//       isRead: true,
//     },
//   ]);

//   const markAsRead = (id) => {
//     setNotifications((prev) =>
//       prev.map((notification) =>
//         notification.id === id ? { ...notification, isRead: true } : notification
//       )
//     );
//   };

//   const markAllAsRead = () => {
//     setNotifications((prev) =>
//       prev.map((notification) => ({ ...notification, isRead: true }))
//     );
//   };

//   const unreadCount = notifications.filter((n) => !n.isRead).length;

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       {/* Header */}
//       <div className="relative mb-6 flex items-center">
//         <h1 className="text-3xl font-semibold mx-auto">Notifications</h1>
//         {unreadCount > 0 && (
//           <button
//             onClick={markAllAsRead}
//             className="absolute right-0 bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-600"
//           >
//             Mark All as Read
//           </button>
//         )}
//       </div>

//       {/* Notifications List */}
//       <div className="bg-white shadow rounded-lg divide-y">
//         {notifications.length > 0 ? (
//           notifications.map((notification, index) => (
//             <div
//               key={notification.id}
//               className={`flex justify-between items-center px-4 py-3 ${
//                 index % 2 === 0 ? "bg-red-50" : "bg-orange-50"
//               } hover:bg-gray-100`}
//             >
//               <div>
//                 <p className="text-sm font-medium">{notification.message}</p>
//                 <p className="text-xs text-gray-500">{notification.timestamp}</p>
//               </div>
//               {!notification.isRead && (
//                 <button
//                   onClick={() => markAsRead(notification.id)}
//                   className="text-blue-500 text-sm font-semibold hover:underline"
//                 >
//                   Mark as Read
//                 </button>
//               )}
//             </div>
//           ))
//         ) : (
//           <div className="text-center py-6 text-gray-500">
//             No notifications available.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NotificationPage;



import React, { useEffect, useState } from "react";
import { gsap } from "gsap";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "Booking",
      message: "Your booking for 'Photography' has been confirmed.",
      timestamp: "5 minutes ago",
      isRead: false,
    },
    {
      id: 2,
      type: "Payment",
      message: "You received a payment of Rs. 500 for 'Cooking' services.",
      timestamp: "2 hours ago",
      isRead: false,
    },
    {
      id: 3,
      type: "Message",
      message: "John Doe sent you a message: 'Is the service still available?'",
      timestamp: "1 day ago",
      isRead: true,
    },
    {
      id: 4,
      type: "System",
      message: "New features have been added to the platform!",
      timestamp: "2 days ago",
      isRead: true,
    },
  ]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Use GSAP to animate the heading
  useEffect(() => {
    gsap.fromTo(
      ".heading",
      { x: -200, opacity: 0 }, // Starting position (off-screen left)
      { x: 0, opacity: 1, duration: 1 } // Ending position (center)
    );
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="relative mb-6 flex items-center">
        <h1 className="text-3xl font-semibold mx-auto heading">Notifications</h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="absolute right-0 bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white shadow rounded-lg divide-y">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div
              key={notification.id}
              className={`flex justify-between items-center px-4 py-3 ${
                index % 2 === 0 ? "bg-red-50" : "bg-orange-50"
              } hover:bg-gray-100`}
            >
              <div>
                <p className="text-sm font-medium">{notification.message}</p>
                <p className="text-xs text-gray-500">{notification.timestamp}</p>
              </div>
              {!notification.isRead && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="text-blue-500 text-sm font-semibold hover:underline"
                >
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
