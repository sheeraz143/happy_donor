// import { useParams, useNavigate } from "react-router-dom";
// import {
//   GoogleMap,
//   useJsApiLoader,
//   Polyline,
//   Marker,
// } from "@react-google-maps/api";
// import profPicImg from "../../assets/profpic.png";
// import bloodGroupImg from "../../assets/bloodimage.png";

// const RequestDetail = () => {
//   const { id } = useParams(); // Get the request ID from URL params
//   const navigate = useNavigate(); // For navigating back

//   // Mock data based on ID (in real scenarios, fetch this data from a server or context)
//   const request = {
//     id,
//     name: "sheeraz",
//     hospital: "Mount Sinal Hospital",
//     units: 2,
//     date: "2024.07.16,05:30",
//     profilePic: profPicImg,
//     bloodGroupImage: bloodGroupImg,
//     path: [
//       { lat: 12.9716, lng: 77.5946 }, // Example polyline path
//       { lat: 12.9721, lng: 77.5949 },
//     ],
//   };

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: "AIzaSyDfsJx7wDFEfu0_jKXwVHQBjFyLm8nfKvQ",
//   });

//   if (!isLoaded) return <div>Loading...</div>;

//   return (
//     <div className="request-detail-container">
//       {/* Render map */}
//       <GoogleMap
//         mapContainerStyle={{ width: "100%", height: "400px" }}
//         center={request.path[0]}
//         zoom={15}
//       >
//         <Polyline
//           path={request.path}
//           options={{
//             strokeColor: "#FF0000",
//             strokeOpacity: 0.8,
//             strokeWeight: 2,
//           }}
//         />
//         {request.path.map((pos, index) => (
//           <Marker key={index} position={pos} />
//         ))}
//       </GoogleMap>

//       {/* Render detailed card information */}
//       <div className="request-info">
//         <img src={request.profilePic} alt="Profile" />
//         <h4>{request.name}</h4>
//         <p>{request.hospital}</p>
//         <p>Blood Units: {request.units}</p>
//         <p>Date: {request.date}</p>
//         <button onClick={() => navigate("/")}>Back to List</button>
//       </div>
//     </div>
//   );
// };

// export default RequestDetail;

// src/components/RequestDetail.js

import { Link, useLocation, useNavigate } from "react-router-dom";
import profPicImg from "../../assets/prof_img.png";
import bloodGroupImg from "../../assets/bloodimage.png";
import MapComponent from "../MapComponent";
// import profPicImg from "../../assets/profpic.png";
import shareIcon from "../../assets/Share.png";
import locationIcon from "../../assets/Mappoint.png";

const RequestDetail = () => {
  // const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const request = location.state?.request || {};

  // Use requestId as needed
  console.log("Request :", request);
  const path = [
    {
      lat: parseFloat(request.lat),
      lng: parseFloat(request.lon),
    },
  ];

  return (
    <div className="request-detail-container mb-5 mt-5">
      <MapComponent path={path} />

      <div className="col-lg-6 col-md-8 col-sm-10 mx-auto mt-5">
        <div className="request-card" key={request.id}>
          <div className="request-header d-flex align-items-center">
            <div className="align-content-center">
              <img
                src={request.profile_picture || profPicImg}
                alt="Profile"
                style={{ width: "70px", height: "70px", borderRadius: "50%" }}
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop in case the fallback image also fails
                  e.target.src = profPicImg; // Set to default image on error
                }}
              />
            </div>
            <div className="request-details ms-3">
              <div className="text-start fw-bold">{request.name}</div>
              <div className="text-start">{request.hospital}</div>
              <div className="text-start">
                Blood units: {request.quantity_units}
              </div>
              <div className="text-start">
                Date: {new Date(request.date).toLocaleDateString()}
              </div>
              <div className="text-start">Location: {request.location}</div>
            </div>
            <div className="blood-group ms-auto">
              <img src={bloodGroupImg} alt="Blood Group" />
            </div>
          </div>

          <div className="accept-donar-button d-flex align-items-center mt-3">
            <div className="icon-container d-flex me-3">
              <Link to="#" className="share-link me-2">
                <img src={shareIcon} alt="Share" className="icon-img" />
              </Link>
              <Link to="#" className="location-link">
                <img src={locationIcon} alt="Location" className="icon-img" />
              </Link>
            </div>

            <button
              className="accepted-donors-btn btn btn-primary"
              onClick={() => {
                navigate("/donate");
              }}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetail;
