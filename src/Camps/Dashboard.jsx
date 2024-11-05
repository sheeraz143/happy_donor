import CardComponent from "./CardComponent";
import "./CardComponent.css";

import {
  // FaHome,
  // FaUserAlt,
  FaClipboardList,
  FaCheckCircle,
  FaHandsHelping,
  FaHospital,
  FaBuilding,
  FaExchangeAlt,
  FaQuestionCircle,
  FaClipboardCheck,
} from "react-icons/fa";

const Dashboard = () => {
  const cards = [
    {
      title: "Total Request",
      count: 58,
      icon: <FaClipboardList />,
      className: "total-request",
    },
    {
      title: "Pending Request",
      count: 1,
      icon: <FaQuestionCircle />,
      className: "pending",
    },
    {
      title: "Approved Request",
      count: 19,
      icon: <FaCheckCircle />,
      className: "approved",
    },
    {
      title: "Completed Request",
      count: 38,
      icon: <FaClipboardCheck />,
      className: "completed",
    },
    {
      title: "Total Donors",
      count: 55,
      icon: <FaHandsHelping />,
      className: "total-donors",
    },
    {
      title: "Total Blood Banks",
      count: 7,
      icon: <FaHospital />,
      className: "total-blood-banks",
    },
    {
      title: "Total Organisations",
      count: 2,
      icon: <FaBuilding />,
      className: "total-organisations",
    },
    {
      title: "Change Request",
      count: 11,
      icon: <FaExchangeAlt />,
      className: "change-request",
    },
    {
      title: "Total Pending",
      count: 0,
      icon: <FaQuestionCircle />,
      className: "total-pending",
    },
    {
      title: "Total Approved",
      count: 34,
      icon: <FaClipboardCheck />,
      className: "total-approved",
    },
  ];

  return (
    <div className="dashboard">
      {cards.map((card, index) => (
        <CardComponent
          key={index}
          title={card.title}
          count={card.count}
          icon={card.icon}
          className={card.className}
        />
      ))}
    </div>
  );
};

export default Dashboard;
