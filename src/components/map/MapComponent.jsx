import {
  GoogleMap,
  useJsApiLoader,
  Polyline,
  Marker,
} from "@react-google-maps/api";
import PropTypes from "prop-types"; // Import PropTypes
import helper from "../../Helper/axiosHelper";

const MapComponent = ({ path }) => {
  const gmapApikey = helper.googleMapsApiKey();
  const { isLoaded } = useJsApiLoader({
    // googleMapsApiKey: "AIzaSyDfsJx7wDFEfu0_jKXwVHQBjFyLm8nfKvQ",
    googleMapsApiKey: gmapApikey,
  });

  if (!isLoaded) return <div>Loading...</div>;

  // Set map center to the first point in the polyline path or a default center
  const center =
    path && path.length > 0 ? path[0] : { lat: 12.9716, lng: 77.5946 };
  // path && path.length > 0 ? path[0] : { lat: path[0]?.lat, lng: path[0]?.lng};

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "400px" }}
      center={center}
      zoom={15}
    >
      {path && (
        <>
          <Polyline
            path={path}
            options={{
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
          />
          {path.map((pos, index) => (
            <Marker key={index} position={pos} />
          ))}
        </>
      )}
    </GoogleMap>
  );
};

// Define PropTypes for the MapComponent
MapComponent.propTypes = {
  path: PropTypes.arrayOf(
    PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default MapComponent;
