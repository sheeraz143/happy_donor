import { useEffect, useState } from "react";
import { donateBloods, setLoader } from "../../redux/product";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Pagination } from "antd";

export default function ApproveRequests() {
  const dispatch = useDispatch();
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const perPage = 10;

  useEffect(() => {
    const fetchRequests = async () => {
      dispatch(setLoader(true));
      const type = "open";
      try {
        dispatch(
          donateBloods(
            type,
            (res) => {
              dispatch(setLoader(false));
              if (res.errors) {
                toast.error(res.errors);
              } else {
                setRequests(res.requests);
                setTotalRequests(res.pagination.total);
                console.log("res: ", res);
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
  }, [dispatch, currentPage]);

  const handleApprove = () => {};

  const handleReject = () => {};

  return (
    <div className="cards-container mt-5 mb-5 col-lg-4 mx-auto">
      {requests?.map((request) => (
        <div className="card mb-3" key={request.request_id}>
          <div className="">
            <p className="card-text text-start">Patient Name: {request.name}</p>
            <p className="card-text text-start">
              Patient Mobile: {request.patient_mobile}
            </p>
            <p className="card-text text-start">
              Attender Name: {request.attender_name}
            </p>
            <p className="card-text text-start">
              Attender Mobile: {request.attender_mobile}
            </p>
            <p className="card-text text-start">
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
                onClick={() => handleReject(request.request_id)}
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
  );
}
