import { useEffect } from "react";
import logo from "../../assets/logo.png"; // Path to your logo image

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="my-5">
      <h5 className="mb-3">About Us</h5>

      {/* Logo and Header */}
      <div className="text-center mb-4">
        <img
          src={logo}
          alt="Happy Donors Logo"
          className="img-fluid mb-3"
          style={{ width: "150px" }}
        />
      </div>

      {/* About Us Sections in a Single Column */}
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h5 className="card-title text-start">About Our Mission</h5>
          {/* About Our Mission */}
          <div className="card shadow-sm  mb-4">
            <div className="">
              <p className="card-text">
                Our mission is to connect blood donors with those in need,
                ensuring timely and life-saving donations. We aim to create a
                community of committed donors who make a difference in the lives
                of many.
              </p>
            </div>
          </div>

          {/* Our Story */}
          <h5 className="card-title text-start">Our Story</h5>
          <div className="card shadow-sm  mb-4">
            <div className="">
              <p className="card-text">
                Founded in [Year], our organization started with a vision to
                simplify the process of blood donation and make it more
                accessible. Over the years, weve grown into a network of trusted
                donors and partners, dedicated to saving lives.
              </p>
            </div>
          </div>

          {/* Our Team */}
          <h5 className="card-title text-start">Our Team</h5>
          <div className="card shadow-sm  mb-4">
            <div className="">
              <p className="card-text">
                Meet the dedicated team behind the app. We are a group of
                passionate individuals working together to create a positive
                impact.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
