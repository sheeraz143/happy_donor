import { useEffect, useState } from "react";
import {
  ApproveAdminBloodDonor,
  CancelBloodRequest,
  donateApprove,
  setLoader,
} from "../../redux/product";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Pagination } from "antd";
import { formatDate } from "../../utils/dateUtils";

// import Modal from "react-modal";

export default function ApproveDonors() {
  const dispatch = useDispatch();
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const perPage = 10;
  const [refresh, setRefresh] = useState(false);

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

  const handleSubmit = (request) => {
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
      additional_comments: ` ${
        request.donor_name ?? "service team"
      } rejected this`,
    };
    // console.log("dataToSend: ", dataToSend);
    // return;

    dispatch(setLoader(true));
    try {
      dispatch(
        CancelBloodRequest(request.request_id, dataToSend, (res) => {
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
    <div className="cards-container my-5 mx-5">
      <div className="row">
        {requests?.map((request) => (
          <div
            className="col-lg-4 col-md-6 col-sm-12 mb-4"
            key={request.request_id}
          >
            <div className="card h-100 p-3">
              {request.is_critical && (
                <div className="emergency-tag position-absolute">Emergency</div>
              )}
              <div className="text-start">
                <p className="card-text">Name: {request.patient_name}</p>
                <p className="card-text">
                  Attender Name: {request.attender_name}
                </p>
                <p className="card-text">
                  Attender Mobile: {request.attender_mobile_number}
                </p>

                <p className="card-text">Date: {formatDate(request.date)}</p>
              </div>
              <div className="d-flex  mt-4 gap-3">
                <button
                  className="btn btn-danger"
                  onClick={() => handleSubmit(request)}
                >
                  Reject  
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => handleApprove(request.request_id)}
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
      </div>
    </div>
  );
}
