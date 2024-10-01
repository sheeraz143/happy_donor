import { useLocation } from "react-router-dom";
// import { Worker } from "@react-pdf-viewer/core";
// import { Viewer } from "@react-pdf-viewer/core";
// import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css"; // Import styles

// import samplePDF from "../../assets/Resume.pdf"; // Ensure you have a sample PDF

function TTIReport() {
  const location = useLocation();
  const { request } = location.state || {}; // Ensure state is passed correctly

  // Create an instance of the default layout plugin
  //   const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div className="my-4">
      <h2 className="text-center mb-4">TTI Report</h2>
      <div className="row justify-content-center">
        <div className="col-md-6">
          {/* Patient Information Section */}
          {/* <div className="card mb-4 p-3 shadow-sm">
            <div className="d-flex align-items-center">
              <img
                src={request?.profilePic}
                alt="Profile"
                className="rounded-circle me-3"
                style={{ width: "50px", height: "50px" }}
              />
              <div className="flex-grow-1">
                <p className="mb-1">
                  <strong>Donation ID:</strong> {request?.id}
                </p>
                <p className="mb-1">
                  <strong>Date:</strong> {request?.date}
                </p>
                <p className="mb-1">
                  <strong>Location:</strong> [Location Name]
                </p>
                <p className="mb-1">
                  <strong>Status:</strong> Completed
                </p>
                <p className="mb-0">
                  <strong>TTI Status:</strong> Negative/Positive
                </p>
              </div>
              <div className="text-end">
                <p className="mb-1">
                  <strong>Blood Type:</strong> O+
                </p>
              </div>
            </div>
          </div> */}
          <div className="card mb-4 p-3 shadow-sm col-lg-12">
            <div className="d-flex align-items-center">
              <img
                src={request?.profilePic}
                alt="Profile"
                className="rounded-circle me-3"
                style={{ width: "50px", height: "50px" }}
              />
              <div className="row flex-grow-1">
                {/* Left side - Donation ID and Status */}
                <div className=" col-md-6">
                  <p className="mb-1">
                    <span>Donation ID:</span> {request?.id}
                  </p>
                  <p className="mb-1">
                    <span>Date:</span> {request?.date}
                  </p>
                  <p className="mb-1">
                    <span>Status:</span> Completed
                  </p>
                </div>
                {/* Right side - Blood Type, Location, and TTI Status */}
                <div className="col-md-6 text-md-start">
                  <p className="mb-1">
                    <span>Blood Type:</span> O+
                  </p>
                  <p className="mb-1">
                    <span>Location:</span> [Location Name]
                  </p>
                  <p className="mb-0">
                    <span>TTI Status:</span> Negative/Positive
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* PDF Viewer Section */}
          {/* <div className="card shadow-sm p-3">
            <div
              style={{
                height: "500px", // Set an appropriate height for the PDF viewer
                width: "100%",
              }}
            >
              <Worker
                workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
              >
                <Viewer
                  fileUrl={samplePDF} // Use the imported sample PDF
                  plugins={[defaultLayoutPluginInstance]} // Use the default layout plugin
                />
              </Worker>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default TTIReport;
