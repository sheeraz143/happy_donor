import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
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
import { useEffect } from "react";
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

function App() {
  const darkMode = useSelector((state) => state.theme.darkMode);

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "";
  }, [darkMode]);

  const location = useLocation();

  const hideNavbarAndFooter =
    location.pathname === "/" ||
    location.pathname === "/otp" ||
    location.pathname === "/map" ||
    location.pathname === "/profile";

  return (
    <>
      <Tost />
      <SimpleBackdrop />
      {!hideNavbarAndFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<LoginComponent />} />
        <Route path="/otp" element={<OTPVerificationComponent />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
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
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/faqs" element={<Faqs />} />
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
            path="/postgratitudemesage"
            element={<PostGratitudeMesage />}
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
