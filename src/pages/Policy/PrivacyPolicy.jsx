import { useEffect } from "react";

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="my-5">
      <h4 className="mb-3 text-center">Privacy Policy</h4>

      {/* Privacy Policy Sections in a Single Column */}
      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* 1. Introduction */}
          <h5 className="card-title text-start">1. Introduction</h5>
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <p className="card-text">
                Overview of the apps commitment to protecting user privacy.
              </p>
            </div>
          </div>

          {/* 2. Information Collection */}
          <h5 className="card-title text-start">2. Information Collection</h5>
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <p className="card-text">
                Details on what personal data is collected and how it is used.
              </p>
            </div>
          </div>

          {/* 3. Data Usage */}
          <h5 className="card-title text-start">3. Data Usage</h5>
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <p className="card-text">
                Explanation of how collected data is used to enhance the user
                experience.
              </p>
            </div>
          </div>

          {/* 4. Data Sharing */}
          <h5 className="card-title text-start">4. Data Sharing</h5>
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <p className="card-text">
                Information on who data is shared with and why.
              </p>
            </div>
          </div>

          {/* 5. User Rights */}
          <h5 className="card-title text-start">5. User Rights</h5>
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <p className="card-text">
                Explanation of user rights regarding their data (access,
                correction, etc.).
              </p>
            </div>
          </div>

          {/* 6. Security Measures */}
          <h5 className="card-title text-start">6. Security Measures</h5>
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <p className="card-text">
                Overview of how data is protected against unauthorized access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
