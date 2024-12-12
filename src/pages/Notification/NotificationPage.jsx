// NotificationPage.js

import { useCallback, useEffect, useState } from "react";
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
import { Pagination } from "antd";

export default function NotificationPage({ onRefreshNavbar }) {
  const ITEMS_PER_PAGE = 10; // Number of items per page
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Use navigate hook from react-router-dom
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0); // Track total items for pagination

  const fetchData = useCallback(
    (page = 1) => {
      dispatch(setLoader(true));
      dispatch(
        ViewNotifications(page, (res) => {
          dispatch(setLoader(false));
          if (res.errors) {
            toast.error(res.errors);
          } else {
            setData(res?.notifications);
            setTotalItems(res.pagination?.total || 0); // Set total items for pagination

            // onRefreshNavbar();
          }
        })
      ).catch((error) => {
        toast.error(error.message || "Error fetching notifications");
        dispatch(setLoader(false));
      });
    },
    [dispatch]
  );

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, fetchData,refresh]);

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
    // console.log('notification: ', notification);
    const { screen, link } = notification;

    switch (screen) {
      case "Request":
        navigate(`/bloodrequestdetail/${link}`);
        break;
      case "Donor":
        navigate(`/donarlist/${link}`);
        break;
      case "Camp":
        navigate(`/campdetails`, { state: { request: link } });
        break;
      case "Event":
        // navigate(`/eventdetails`);
        navigate(`/eventdetails`, { state: { request: link } });
        break;
      case "DonationHistory":
        navigate(`/donationhistory`);
        break;
      case "Profile":
        navigate(`/editprofile`);
        break;
      case "Donation":
        navigate(`/viewbloodrequest/${link}`);
        break;
      default:
        console.log("Unknown screen type:", screen);
        break;
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
      <Pagination
        align="center"
        className="mb-2 mt-4"
        current={currentPage}
        total={totalItems}
        pageSize={ITEMS_PER_PAGE}
        onChange={handlePageChange}
      />
    </div>
  );
}

NotificationPage.propTypes = {
  onRefreshNavbar: PropTypes.func.isRequired,
};
