import PropTypes from "prop-types";
import "./CardComponent.css";

const CardComponent = ({ title, count, icon, className }) => {
  return (
    <div className={`card-component ${className}`}>
      <div className="card-content">
        <div className="card-icon">{icon}</div>
        <div className="card-details">
          <h3 className="card-title">{title}</h3>
          <p className="card-count">{count}</p>
        </div>
      </div>
      <div className="card-arrow">&gt;</div>
    </div>
  );
};

CardComponent.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  icon: PropTypes.element.isRequired,
  className: PropTypes.string.isRequired,
};

export default CardComponent;
