// import { useEffect, useState } from "react";
// import { donateApprove, setLoader } from "../../redux/product";
// import { toast } from "react-toastify";
// import { useDispatch } from "react-redux";
// import { Pagination } from "antd";

// export default function ApproveDonors() {
//   const dispatch = useDispatch();
//   const [requests, setRequests] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalRequests, setTotalRequests] = useState(0);
//   const perPage = 10;

//   useEffect(() => {
//     const fetchRequests = async () => {
//       dispatch(setLoader(true));
//       const type = "all/admin";
//       try {
//         dispatch(
//           donateApprove(
//             type,
//             (res) => {
//               dispatch(setLoader(false));
//               if (res.errors) {
//                 toast.error(res.errors);
//               } else {
//                 setRequests(res.requests);
//                 setTotalRequests(res.pagination.total);
//                 console.log("res: ", res);
//               }
//             },
//             currentPage,
//             perPage
//           )
//         );
//       } catch (error) {
//         toast.error(error.message || "Error fetching requests");
//         dispatch(setLoader(false));
//       }
//     };

//     fetchRequests();
//   }, [dispatch, currentPage]);

//   const handleApprove = () => {};

//   const handleReject = () => {};

//   return (
//     <div className="cards-container mt-5 mb-5 col-lg-4 mx-auto">
//       {requests?.map((request) => (
//         <div className="card mb-3" key={request.request_id}>
//           <div className="">
//             <p className="card-text text-start">Patient Name: {request.name}</p>
//             <p className="card-text text-start">
//               Patient Mobile: {request.patient_mobile}
//             </p>
//             <p className="card-text text-start">
//               Attender Name: {request.attender_name}
//             </p>
//             <p className="card-text text-start">
//               Attender Mobile: {request.attender_mobile}
//             </p>
//             <p
//               className="card-text text-start"
//               style={{ overflowWrap: "anywhere" }}
//             >
//               Request ID: {request.request_id}
//             </p>
//             <p className="card-text text-start">Date: {request.date}</p>
//             <p className="card-text text-start">
//               Units Required: {request.units_required}
//             </p>
//             <p className="card-text text-start">Address: {request.address}</p>
//             <div className="d-flex justify-content-between mt-4">
//               <button
//                 className="btn btn-danger"
//                 onClick={() => handleReject(request.request_id)}
//               >
//                 Reject
//               </button>
//               <button
//                 className="btn btn-success"
//                 onClick={() => handleApprove(request.request_id)}
//               >
//                 Approve
//               </button>
//             </div>
//           </div>
//         </div>
//       ))}
//       <Pagination
//         align="center"
//         className="mb-4"
//         current={currentPage}
//         total={totalRequests}
//         pageSize={perPage}
//         onChange={(page) => {
//           setCurrentPage(page);
//         }}
//       />
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import {
  ApproveAdminBloodDonor,
  donateApprove,
  RejectBloodDonorByAdmin,
  setLoader,
} from "../../redux/product";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Pagination } from "antd";
// import Modal from "react-modal";

export default function ApproveDonors() {
  const dispatch = useDispatch();
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const perPage = 10;
  const [refresh, setRefresh] = useState(false);

  // const [modalIsOpen, setModalIsOpen] = useState(false);
  // const [closureReason, setClosureReason] = useState("");
  // const [additionalComments, setAdditionalComments] = useState("");
  // const [requestId, setRequestId] = useState("");

  // const openModal = (request_id) => {
  //   console.log("request_id: ", request_id);
  //   setModalIsOpen(true);
  //   setRequestId(request_id);
  // };

  // const closeModal = () => {
  //   setModalIsOpen(false);
  //   setClosureReason("");
  //   setAdditionalComments("");
  // };

  useEffect(() => {
    const fetchRequests = async () => {
      dispatch(setLoader(true));
      const type = "all/admin";
      try {
        dispatch(
          donateApprove(
            type,
            (res) => {
              dispatch(setLoader(false));
              if (res.errors) {
                toast.error(res.errors);
              } else {
                setRequests(res.requests);
                setTotalRequests(res.pagination.total);
              }
            },
            currentPage,
            perPage
          )
        );
      } catch (error) {
        toast.error(error.message || "Error fetching requests");
        dispatch(setLoader(false));
      }
    };

    fetchRequests();
  }, [dispatch, currentPage, refresh]);

  const handleApprove = (request) => {
    // console.log("request: ", request);
    const dataToSend = {
      request_id: request.request_id,
      donor_id: request.donor_id,
    };
    // console.log("dataToSend: ", dataToSend);
    // return;
    dispatch(setLoader(true));

    try {
      dispatch(
        ApproveAdminBloodDonor(dataToSend, (res) => {
          // console.log("res: ", res);
          if (res.code === 200) {
            toast.success(res.message);
            setRefresh(!refresh);
          } else {
            toast.error(res.message);
          }
          dispatch(setLoader(false));
        })
      );
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred.");
      dispatch(setLoader(false));
    }
  };

  const handleSubmit = (name) => {
    // console.log("name: ", name);
    // if (!closureReason.trim()) {
    //   toast.error("Closure reason is required");
    //   return;
    // }
    // if (!additionalComments.trim()) {
    //   toast.error("Additional comments are required");
    //   return;
    // }
    const dataToSend = {
      closure_reason: "Rejected",
      additional_comments: ` ${name ?? "service team"} rejected this`,
    };
    // console.log("dataToSend: ", dataToSend);
    // return;

    dispatch(setLoader(true));
    try {
      dispatch(
        RejectBloodDonorByAdmin(dataToSend, (res) => {
          // console.log("res: ", res);
          if (res.code === 200) {
            toast.success(res.message);
            setRefresh(!refresh);
            // closeModal();
          } else {
            toast.error(res.message);
          }
          dispatch(setLoader(false));
        })
      );
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred.");
      dispatch(setLoader(false));
    }
  };

  return (
    <div className="cards-container mt-5 mb-5 col-lg-4 mx-auto">
      {requests?.map((request) => (
        <div className="card mb-3" key={request.request_id}>
          <div className="">
            <p className="card-text text-start">
              Patient Name: {request.patient_name}
            </p>
            {/* <p className="card-text text-start">
              Patient Mobile: {request.patient_mobile}
            </p> */}
            <p className="card-text text-start">
              Attender Name: {request.attender_name}
            </p>
            <p className="card-text text-start">
              Attender Mobile: {request.attender_mobile_number}
            </p>
            <p
              className="card-text text-start"
              style={{ overflowWrap: "anywhere" }}
            >
              Request ID: {request.request_id}
            </p>
            <p className="card-text text-start">Date: {request.date}</p>
            <p className="card-text text-start">
              Units Required: {request.units_required}
            </p>
            <p className="card-text text-start">Address: {request.address}</p>
            <div className="d-flex justify-content-between mt-4">
              <button
                className="btn btn-danger"
                onClick={() => handleSubmit(request.donor_name)}
                // onClick={() => openModal(request.request_id)}
              >
                Reject
              </button>
              <button
                className="btn btn-success"
                onClick={() => handleApprove(request)}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      ))}
      <Pagination
        align="center"
        className="mb-4"
        current={currentPage}
        total={totalRequests}
        pageSize={perPage}
        onChange={(page) => {
          setCurrentPage(page);
        }}
      />

      {/* <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Gratitude Message"
        ariaHideApp={false}
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="d-flex flex-column align-items-center ">
          <h2>Cancel Blood Request</h2>
          <label className="text-start col-lg-6 col-md-6 col-sm-6">
            Closure reason
          </label>
          <input
            className="form-input col-lg-6 col-md-6 col-sm-6 mb-3"
            value={closureReason}
            onChange={(e) => setClosureReason(e.target.value)}
          />
          <label className="text-start col-lg-6 col-md-6 col-sm-6">
            Additional comments
          </label>
          <input
            className="form-input col-lg-6 col-md-6 col-sm-6 mb-3"
            value={additionalComments}
            onChange={(e) => setAdditionalComments(e.target.value)}
          />
          <div className="d-flex justify-content-evenly col-lg-6 col-md-6 col-sm-6">
            <button onClick={closeModal} className="btn btn-primary">
              Close
            </button>
            <button onClick={handleSubmit} className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      </Modal> */}
    </div>
  );
}
