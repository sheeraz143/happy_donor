import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  // Navigate,
  // useNavigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Donate from "./pages/Donate";
import "./App.css";
import Navbar from "./components/Navbar";
import Tost from "./components/toast/toast";
import LoginComponent from "./pages/Login";
import OTPVerificationComponent from "./pages/Otp";
import Profile from "./pages/ProfilePage";
import BloodRequest from "./pages/BloodRequests/BloodRequest ";
import Footer from "./components/Footer";
import Request from "./pages/Profile/Request";
// import MapComponent from "./pages/MapComponent";
import ViewProfilepage from "./pages/Profile/ViewProfilepage";
import EditProfilePage from "./pages/Profile/EditProfilePage";
import DonationHistory from "./pages/Profile/DonationHistory";
import SelectLanguage from "./pages/Profile/SelectLanguage";
import NotificationSettings from "./pages/Profile/NotificationSettings";
import ModeSetting from "./pages/Profile/ModeSetting";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import EmergenctContact from "./pages/Profile/EmergenctContact";
import AboutUs from "./pages/AboutUs/AboutUsPage";
import PrivacyPolicy from "./pages/Policy/PrivacyPolicy";
import Terms from "./pages/Terms/Terms";
import Faqs from "./pages/Faqs/Faqs";
import WriteToUs from "./pages/WriteToUs/WriteToUs";
import GratitudePage from "./pages/Gratitude/GratitudePage";
import TTIReport from "./pages/Gratitude/TTIReport";
import BloodMedicalCamps from "./pages/Bloodcamps/BloodMedicalCamps";
import FundDonation from "./pages/Donation/FundDonation";
import CampDetails from "./pages/Bloodcamps/CampDetails";
import RequestDetail from "./pages/DonateBlood/DetailsPage";
import EventDetails from "./pages/Bloodcamps/EventDetails";
import ContributeFund from "./pages/Donation/ContributeFund";
import BloodrequestDetailPage from "./pages/BloodRequests/BloodrequestDetailPage";
import ClosedRequests from "./pages/BloodRequests/ClosedRequests";
import AcceptDonorList from "./pages/BloodRequests/AcceptDonarList";
import ConfirmDonation from "./pages/BloodRequests/ConfirmDonation";
import PostGratitudeMesage from "./pages/BloodRequests/PostGratitudeMesage";
import SimpleBackdrop from "./components/backdrop/backdrop";
import Approvals from "./pages/Approvals/Approvals";
import ApproveRequests from "./pages/Approvals/ApproveRequests";
import ApproveDonors from "./pages/Approvals/ApproveDonors";
import ProtectedRoute from "./ProtectedRoute";
import Camps from "./Camps/Camps";
import CampsList from "./Camps/CampsList";
import CampsrequestDetailPage from "./Camps/CampsrequestDetailPage";
// import Dashboard from "./Camps/Dashboard";
import AcceptedCampList from "./Camps/AcceptedCampList";
import ConfirmCampDonation from "./Camps/ConfirmCampDonation";
import RegisterOrg from "./pages/RegisterOrg";
import LoginOrg from "./Camps/LoginOrg";
import Registerbloodbank from "./pages/Bloodbanks/RegisterBloodbank";
import LoginBloodBank from "./pages/Bloodbanks/LoginBloodBank";
import PostGratitudeCampMesage from "./Camps/PostGratitudeCampMesage";
import NotificationPage from "./pages/Notification/NotificationPage";

// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { requestForToken } from "./pushnotification/firebase";
import PaginatedList from "./pages/pagination";
// import FirebaseComponent from "./pushnotification/FirebaseComponent";

function App() {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const location = useLocation();
  // const [notification, setNotification] = useState({ title: "", body: "" });

  // const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/") {
      window.location.href = "/index.html";
    }

    document.body.className = darkMode ? "dark-mode" : "";
  }, [darkMode, location.pathname]);

  // useEffect(() => {
  //   // console.log("notification: ", notification);

  //   // Request permission and get FCM token
  //   requestForToken()
  //     .then((token) => {
  //       if (token) {
  //         localStorage.setItem("fcmToken", token);
  //         // console.log("FCM Token:", token);
  //         // Optionally, send the token to your backend for later use
  //       }
  //     })
  //     .catch((err) => console.log("Notification permission denied:", err));

  //   // // Listen for foreground messages
  //   // onMessageListener()
  //   //   .then((payload) => {
  //   //     console.log("Received notification:", payload);
  //   //     setNotification({
  //   //       title: payload.notification.title,
  //   //       body: payload.notification.body,
  //   //     });
  //   //     toast.info(
  //   //       `${payload.notification.title}: ${payload.notification.body}`
  //   //     );
  //   //   })
  //   //   .catch((err) => console.log("Failed to receive message:", err));
  // }, []);

  useEffect(() => {
    // Request permission and get FCM token, and listen for new messages
    requestForToken(handleRefreshNavbar)
      .then((token) => {
        if (token) {
          localStorage.setItem("fcmToken", token);
          console.log("FCM Token:", token);
        }
      })
      .catch((err) => console.log("Notification permission denied:", err));
  }, []);

  const hideNavbarAndFooter =
    location.pathname === "/login" ||
    location.pathname === "/otp" ||
    location.pathname === "/map" ||
    location.pathname === "/profile" ||
    location.pathname === "/register/organisation" ||
    location.pathname === "/register/bloodbank" ||
    location.pathname === "/login/organisation" ||
    location.pathname === "/login/bloodbank" ||
    location.pathname === "/terms" ||
    location.pathname.includes("viewbloodrequest") ||
    location.pathname === "/privacypolicy";
  // const storedUserType = localStorage.getItem("user_type");
  // const storedUserType = localStorage.getItem("user_type");

  const [refreshNavbar, setRefreshNavbar] = useState(false);

  const handleRefreshNavbar = () => {
    setRefreshNavbar((prev) => !prev);
  };

  return (
    <>
      <Tost />
      <SimpleBackdrop />
      {!hideNavbarAndFooter && <Navbar refreshNavbar={refreshNavbar} />}
      <Routes>
        <Route path="/login" element={<LoginComponent />} />
        <Route
          path="/login/organisation"
          element={<LoginOrg onRefreshNavbar={handleRefreshNavbar} />}
        />
        <Route
          path="/login/bloodbank"
          element={<LoginBloodBank onRefreshNavbar={handleRefreshNavbar} />}
        />
        <Route
          path="/register/bloodbank"
          element={<Registerbloodbank onRefreshNavbar={handleRefreshNavbar} />}
        />
        <Route path="/otp" element={<OTPVerificationComponent />} />
        <Route
          path="/register/organisation"
          element={<RegisterOrg onRefreshNavbar={handleRefreshNavbar} />}
        />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/pagination" element={<PaginatedList />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route element={<ProtectedRoute />}>
            {/* <Route
              path="/home"
              element={storedUserType == 5 ? <Dashboard /> : <Home />}
            />
            <Route
              path="/dashboard"
              element={
                storedUserType == 5 ? <Dashboard /> : <Navigate to="/home" />
              }
            /> */}
          </Route>
          <Route path="/profile" element={<Profile />} />
          <Route path="/viewprofile" element={<ViewProfilepage />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/approve-requests" element={<ApproveRequests />} />
          <Route path="/approve-donors" element={<ApproveDonors />} />
          <Route path="/editprofile" element={<EditProfilePage />} />
          {/* <Route path="/map" element={<MapComponent />} /> */}
          <Route path="/bloodrequest" element={<BloodRequest />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/donationhistory" element={<DonationHistory />} />
          <Route path="/request/:id" element={<RequestDetail />} />
          <Route path="/request" element={<Request />} />
          <Route path="/selectlanguage" element={<SelectLanguage />} />
          <Route path="/notifisetting" element={<NotificationSettings />} />
          <Route path="/modesetting" element={<ModeSetting />} />
          <Route path="/emergencycontact" element={<EmergenctContact />} />
          <Route path="/aboutus" element={<AboutUs />} />

          <Route path="/writetoUs" element={<WriteToUs />} />
          <Route path="/gratitude" element={<GratitudePage />} />
          <Route path="/report" element={<TTIReport />} />
          <Route path="/bloodcamps" element={<BloodMedicalCamps />} />
          <Route path="/funddonation" element={<FundDonation />} />
          <Route path="/campdetails" element={<CampDetails />} />
          <Route path="/eventdetails" element={<EventDetails />} />
          <Route path="/contributefund" element={<ContributeFund />} />
          <Route
            path="/bloodrequestdetail/:id"
            element={<BloodrequestDetailPage />}
          />
          <Route
            path="/viewbloodrequest/:id"
            element={<BloodrequestDetailPage />}
          />
          <Route path="/closedrequests/:id" element={<ClosedRequests />} />
          <Route path="/donarlist/:id" element={<AcceptDonorList />} />
          <Route path="/confirmdonation/:id" element={<ConfirmDonation />} />
          <Route
            path="gratitudecampmesage/"
            element={<PostGratitudeMesage />}
          />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/camps" element={<Camps />} />
          <Route path="/camps/list" element={<CampsList />} />
          <Route
            path="/campsrequestdetail/:id"
            element={<CampsrequestDetailPage />}
          />
          <Route path="/camplist/:id" element={<AcceptedCampList />} />
          <Route path="/confirmcamp/:id" element={<ConfirmCampDonation />} />
          <Route
            path="/postgratitudemesage"
            element={<PostGratitudeCampMesage />}
          />
          <Route
            path="/notification"
            element={<NotificationPage onRefreshNavbar={handleRefreshNavbar} />}
          />
        </Route>
      </Routes>
      {!hideNavbarAndFooter && <Footer />}
    </>
  );
}
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
