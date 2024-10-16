// import { GoogleMap, LoadScript, Polyline } from "@react-google-maps/api";

// const MapComponent = () => {
//   const polylinePath = [
//     { lat: 12.5186, lng: 78.213 }, // Krishnagiri
//     { lat: 12.6585, lng: 77.9384 }, // Soolagiri
//     { lat: 12.7401, lng: 77.8253 }, // Hosur
//     { lat: 12.9716, lng: 77.5946 }, // Bangalore
//   ];

//   const containerStyle = {
//     width: "400px",
//     height: "400px",
//   };
//   const center = {
//     lat: 12.7456,
//     lng: 77.8882, // Center the map between the locations
//   };

//   return (
//     <LoadScript googleMapsApiKey="AIzaSyDfsJx7wDFEfu0_jKXwVHQBjFyLm8nfKvQ">
//       <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={2}>
//         <Polyline
//           path={polylinePath}
//           options={{
//             strokeColor: "#FF0000",
//             strokeOpacity: 0.8,
//             strokeWeight: 2,
//           }}
//         />
//       </GoogleMap>
//     </LoadScript>
//   );
// };

// export default MapComponent;

import {
  GoogleMap,
  useJsApiLoader,
  Polyline,
  Marker,
} from "@react-google-maps/api";
import PropTypes from "prop-types"; // Import PropTypes

// Map style for minimalistic or grayscale map
const mapStyles = [
  {
    featureType: "all",
    elementType: "geometry",
    stylers: [{ color: "#ebe3cd" }],
  },
  {
    featureType: "all",
    elementType: "labels.text.fill",
    stylers: [{ color: "#523735" }],
  },
  {
    featureType: "all",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#f5f1e6" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#000000" }],
  },
];

const MapComponent = ({ path }) => {

  // const polylinePath = [
  //   { lat: 12.5186, lng: 78.213 }, // Krishnagiri
  //   { lat: 12.6585, lng: 77.9384 }, // Soolagiri
  //   { lat: 12.7401, lng: 77.8253 }, // Hosur
  //   { lat: 12.9716, lng: 77.5946 }, // Bangalore
  // ];

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  // const center = {
  //   lat: 12.7456,
  //   lng: 77.8882, // Center the map between the locations
  // };
  const center = path.length > 0 ? path[0] : { lat: 12.7456, lng: 77.8882 };

  // Load Google Maps JavaScript API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBVLHSGMpSu2gd260wXr4rCI1qGmThLE_0", // Replace with your actual API key
  });

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // Create polyline options with arrowheads
  const createPolylineOptions = () => {
    return {
      strokeColor: "#1d1dc9",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      icons: [
        {
          icon: {
            path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 2,
            strokeColor: "#FF0000",
          },
          offset: "100%", // Position of the arrow along the polyline
        },
      ],
    };
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={9}
      options={{ styles: mapStyles }} // Apply custom styles here
    >
      {/* Adding polyline with arrowheads */}
      {path.length > 1 && ( // Ensure there's more than one point
        <Polyline path={path} options={createPolylineOptions()} />
      )}

      {/* Add markers at the start and end of the route */}
      {path.map((position, index) => {
        // console.log("position: ", position);
        return (
          <Marker
            key={index}
            position={position}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 6,
              fillColor: "#FF0000",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "#ffffff",
            }}
          />
        );
      })}
    </GoogleMap>
  );
};

MapComponent.propTypes = {
  path: PropTypes.arrayOf(
    PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default MapComponent;
