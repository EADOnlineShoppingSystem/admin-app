import React, { useEffect, useState, useCallback } from "react";
import { Table, message } from "antd";
import { Link } from "react-router-dom";
import { AiFillDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  getEnquiries,
  resetState,
  updateAEnquiry,
  deleteAEnquiry,
} from "../features/enquiry/enquirySlice";
import CustomModal from "../components/customModal";
import { toast } from "react-toastify";

const Enquiries = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [enqId, setenqId] = useState("");
  const [localEnquiries, setLocalEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);

  const showModal = (e) => {
    setOpen(true);
    setenqId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    try {
      await dispatch(getEnquiries()).unwrap();
    } catch (error) {
      console.error("Failed to fetch enquiries:", error);
      message.error("Failed to load enquiries. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(resetState());
    fetchEnquiries();
  }, [dispatch, fetchEnquiries]);

  const enquiryState = useSelector((state) => state.enquiry.enquiries);

  useEffect(() => {
    setLocalEnquiries(enquiryState);
  }, [enquiryState]);

  const setEnquiryStatus = async (e, id) => {
    const newStatus = e.target.value;
    setLoading(true);
    try {
      setLocalEnquiries((prevEnquiries) =>
        prevEnquiries.map((enq) =>
          enq._id === id ? { ...enq, status: newStatus } : enq
        )
      );

      const data = { id: id, enqData: newStatus };
      await dispatch(updateAEnquiry(data)).unwrap();
      message.success("Status updated successfully");
      await fetchEnquiries();
    } catch (error) {
      console.error("Failed to update status:", error);
      message.error("Failed to update status. Please try again.");
      // Revert local state if the API call fails
      setLocalEnquiries((prevEnquiries) =>
        prevEnquiries.map((enq) =>
          enq._id === id ? { ...enq, status: enq.status } : enq
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteEnq = async (e) => {
    setLoading(true);
    try {
      await dispatch(deleteAEnquiry(e)).unwrap();
      setOpen(false);
      await fetchEnquiries();
      toast.success("Enquiry deleted successfully!");
    } catch (error) {
      console.error("Failed to delete enquiry:", error);
      message.error("Failed to delete enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "SNo", dataIndex: "key" },
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Mobile", dataIndex: "mobile" },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, record) => (
        <select
          value={record.status}
          onChange={(e) => setEnquiryStatus(e, record._id)}
          className="form-control form-select"
          disabled={loading}
        >
          <option value="Submitted">Submitted</option>
          <option value="Contacted">Contacted</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <>
          <Link
            className="ms-3 fs-3 text-danger"
            to={`/admin/enquiries/${record._id}`}
          >
            <AiOutlineEye />
          </Link>
          <button
            className="ms-3 fs-3 text-danger bg-transparent border-0"
            onClick={() => showModal(record._id)}
            disabled={loading}
          >
            <AiFillDelete />
          </button>
        </>
      ),
    },
  ];

  const data = localEnquiries.map((item, index) => ({
    key: index + 1,
    _id: item._id,
    name: item.name,
    email: item.email,
    mobile: item.mobile,
    status: item.status,
  }));

  return (
    <div>
      <h3 className="mb-4 title">Enquiries</h3>
      <div>
        <Table columns={columns} dataSource={data} loading={loading} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => deleteEnq(enqId)}
        title="Are you sure you want to delete this enquiry?"
      />
    </div>
  );
};

export default Enquiries;
