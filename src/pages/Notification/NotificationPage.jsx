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
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export default function NotificationPage({ onRefreshNavbar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Use navigate hook from react-router-dom
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
          setData(res?.notifications);
          // onRefreshNavbar();
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
          toast.success(response.data?.data?.message);
          setRefresh(!refresh);
          onRefreshNavbar();
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
        if (response.code == 200) {
          toast.success(response.message);
          setRefresh(!refresh);
          onRefreshNavbar();
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
          toast.success(response.data?.data?.message);
          setRefresh(!refresh);
          onRefreshNavbar();
        } else {
          toast.error(response.message || "Failed to delete notification");
        }
      })
    );
  };

  const handleNotificationClick = (notification) => {
    const { screen, link } = notification;

    switch (screen) {
      case "Request":
        navigate(`/bloodrequestdetail/${link}`);
        break;
      case "Donor":
        navigate(`/donate`);
        break;
      case "Camp":
        navigate(`/campdetails/${link}`);
        break;
      case "Event":
        // navigate(`/eventdetails`);
        navigate(`/bloodcamps`);
        break;
      case "DonationHistory":
        navigate(`/donationhistory`);
        break;
      case "Profile":
        navigate(`/viewprofile`);
        break;
      case "Donation":
        navigate(`/viewbloodrequest/${link}`);
        break;
      default:
        console.log("Unknown screen type:", screen);
        break;
    }
  };

  return (
    <div className="notification-page mb-5 mt-4">
      <h2 className="notification-header">Notifications</h2>
      <div className="notification-actions">
        <button className="mark-read-button" onClick={handleMarkAllAsRead}>
          <FaCheck /> Mark All as Read
        </button>
        <button
          className="delete-all-button"
          onClick={handleDeleteAllNotifications}
        >
          <FaTrash /> Delete all Notifications
        </button>
      </div>
      {data.length === 0 ? (
        <h4 className="text-center">No data available</h4>
      ) : (
        data.map((notification) => (
          <div
            key={notification.id}
            className="notification-card"
            onClick={() => handleNotificationClick(notification)} // Add click handler for navigation
          >
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
              onClick={(e) => {
                e.stopPropagation(); // Prevent the notification click handler from firing
                handleDeleteNotification(notification.id);
              }}
            >
              <FaTrash />
            </button>
          </div>
        ))
      )}
    </div>
  );
}

NotificationPage.propTypes = {
  onRefreshNavbar: PropTypes.func.isRequired,
};
