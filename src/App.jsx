import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
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
import { requestForToken } from "./pushnotification/firebase";
import PaginatedList from "./pages/pagination";
import BloodrequestDetailPage from "./pages/BloodRequests/BloodrequestDetailPage";
import ViewrequestDetailPage from "./pages/BloodRequests/ViewRequestDetail";
import ViewEventDetails from "./pages/Bloodcamps/ViewEventDetails";
import ViewCampDetails from "./pages/Bloodcamps/ViewCampDetails";
import ChangeRequests from "./pages/Approvals/ChangeRequests";
import CampsEvents from "./pages/Approvals/CampsEvents";
import ResetPassword from "./pages/ResetPassword";
import Forgotpassword from "./pages/Forgotpassword";
import FundDonationMobile from "./pages/Donation/FundDonationMobile";
// import FirebaseComponent from "./pushnotification/FirebaseComponent";

function App() {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/") {
      window.location.href = "/index.html";
    }

    document.body.className = darkMode ? "dark-mode" : "";
  }, [darkMode, location.pathname]);

  useEffect(() => {
    // Request permission and get FCM token, and listen for new messages
    requestForToken(handleRefreshNavbar)
      .then((token) => {
        if (token) {
          localStorage.setItem("fcmToken", token);
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
    location.pathname.includes("vieweventdetails") ||
    location.pathname.includes("viewcampdetails") ||
    location.pathname.includes("forgotpassword") ||
    location.pathname.includes("resetpassword") ||
    location.pathname === "/privacypolicy";

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
        <Route path="/fundDonationMobile" element={<FundDonationMobile />} />

        <Route
          path="/login/organisation"
          element={<LoginOrg onRefreshNavbar={handleRefreshNavbar} />}
        />
        <Route path="/forgotpassword/:type" element={<Forgotpassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
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
        <Route path="/viewcampdetails/:id" element={<ViewCampDetails />} />
        <Route path="/vieweventdetails/:id" element={<ViewEventDetails />} />
        <Route
            path="/viewbloodrequest/:id"
            element={<ViewrequestDetailPage />}
          />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/pagination" element={<PaginatedList />} />
          <Route element={<ProtectedRoute />}></Route>
          <Route path="/profile" element={<Profile />} />
          <Route path="/viewprofile" element={<ViewProfilepage />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/approve-requests" element={<ApproveRequests />} />
          <Route path="/approve-donors" element={<ApproveDonors />} />
          <Route path="/campsevents" element={<CampsEvents />} />
          <Route path="/change-requests" element={<ChangeRequests />} />
          <Route path="/editprofile" element={<EditProfilePage />} />
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
        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      {!hideNavbarAndFooter && <Footer />}
    </>
  );
}
function AppWrapper() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </Router>
  );
}

export default AppWrapper;
