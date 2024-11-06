// NotificationPage.js

import { useEffect, useState } from "react";
import "./Notification.css";
import { useDispatch } from "react-redux";
import {
  setLoader,
  ViewNotifications,
  markAllAsRead,
  deleteAllNotifications,
  deleteNotification,
} from "../../redux/product";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import { FaCheck, FaTrash } from "react-icons/fa";

export default function NotificationPage() {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    dispatch(setLoader(true));
    dispatch(
      ViewNotifications((res) => {
        dispatch(setLoader(false));
        if (res.errors) {
          toast.error(res.errors);
        } else {
          setData(res.notifications);
        }
      })
    ).catch((error) => {
      toast.error(error.message || "Error fetching notifications");
      dispatch(setLoader(false));
    });
  }, [dispatch, refresh]);

  // Handler to mark all notifications as read
  const handleMarkAllAsRead = () => {
    dispatch(
      markAllAsRead((response) => {
        if (response.status) {
          setData(
            data.map((notification) => ({ ...notification, read: true }))
          ); // Update local state
          toast.success(response.data?.data?.message);
          setRefresh(!refresh);
        } else {
          toast.error(response.message || "Failed to mark all as read");
        }
      })
    );
  };

  // Handler to delete all notifications
  const handleDeleteAllNotifications = () => {
    dispatch(
      deleteAllNotifications((response) => {
        if (response.status) {
          setData([]); // Clear all notifications from local state
          toast.success(response.data?.data?.message);
          setRefresh(!refresh);
        } else {
          toast.error(response.message || "Failed to delete all notifications");
        }
      })
    );
  };

  // Handler to delete a single notification
  const handleDeleteNotification = (id) => {
    dispatch(
      deleteNotification(id, (response) => {
        if (response.status) {
          setData(data.filter((notification) => notification.id !== id)); // Update local state
          toast.success(response.data?.data?.message);
          setRefresh(!refresh);
        } else {
          toast.error(response.message || "Failed to delete notification");
        }
      })
    );
  };

  return (
    <div className="notification-page">
      <h2 className="notification-header">Notifications</h2>
      <div className="notification-actions">
        <button className="mark-read-button" onClick={handleMarkAllAsRead}>
          <FaCheck /> Mark All as Read
        </button>
        <button
          className="delete-all-button"
          onClick={handleDeleteAllNotifications} // Call the delete all handler
        >
          <FaTrash /> Delete all Notifications
        </button>
      </div>
      {data.map((notification) => (
        <div key={notification.id} className="notification-card">
          <div className="notification-content">
            <p className="notification-title">{notification.title}</p>
            <p className="notification-subtitle">{notification.message}</p>
            <p className="notification-time">
              {formatDistanceToNow(new Date(notification.updated_at), {
                addSuffix: true,
              })}
            </p>
          </div>
          <button
            className="delete-button"
            onClick={() => handleDeleteNotification(notification.id)}
          >
            <FaTrash />
          </button>
        </div>
      ))}
    </div>
  );
}
