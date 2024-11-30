import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  getAEnquiry,
  resetState,
  updateAEnquiry,
} from "../features/enquiry/enquirySlice";
import { BiArrowBack } from "react-icons/bi";

const ViewEnq = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const enquiryState = useSelector((state) => state.enquiry);
  const { isLoading, isError, enquiry } = enquiryState;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      dispatch(getAEnquiry(id));
    }
    return () => {
      dispatch(resetState());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (!isLoading) {
      setLoading(false);
    }
  }, [isLoading]);

  const goBack = () => {
    navigate(-1);
  };

  const setEnquiryStatus = async (e) => {
    const data = { id: id, enqData: e.target.value };
    await dispatch(updateAEnquiry(data));
    dispatch(getAEnquiry(id));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading enquiry data.</div>;
  }

  if (!enquiry) {
    return <div>No enquiry data available.</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="mb-4 title">View Enquiry</h3>
        <button
          className="bg-transparent border-0 fs-6 mb-0 d-flex align-items-center gap-1"
          onClick={goBack}
        >
          <BiArrowBack className="fs-5" /> Go Back
        </button>
      </div>
      <div className="mt-5 bg-white p-4 d-flex gap-3 flex-column rounded-3">
        <div className="d-flex align-items-center gap-3">
          <h6 className="mb-0">Name:</h6>
          <p className="mb-0">{enquiry.name}</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <h6 className="mb-0">Mobile:</h6>
          <p className="mb-0">
            <a href={`tel:+91${enquiry.mobile}`}>{enquiry.mobile}</a>
          </p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <h6 className="mb-0">Email:</h6>
          <p className="mb-0">
            <a href={`mailto:${enquiry.email}`}>{enquiry.email}</a>
          </p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <h6 className="mb-0">Comment:</h6>
          <p className="mb-0">{enquiry.comment}</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <h6 className="mb-0">Status:</h6>
          <p className="mb-0">{enquiry.status}</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <h6 className="mb-0">Change Status:</h6>
          <div>
            <select
              name=""
              value={enquiry.status || "Submitted"}
              className="form-control form-select"
              id=""
              onChange={setEnquiryStatus}
            >
              <option value="Submitted">Submitted</option>
              <option value="Contacted">Contacted</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEnq;
