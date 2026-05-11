import { useEffect, useState } from "react";
import {
  getDemoRequests,
  updateDemoStatus,
} from "../../services/AdminApi";
import AdminTable from "../../components/admin/Table";

const DemoRequests = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------- FETCH ----------------
  const fetchData = async () => {
    try {
      const res = await getDemoRequests();
      setData(res.data);
    } catch (err) {
      console.error("Error fetching:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ---------------- ACTION ----------------
  const handleAction = async (id, status) => {
    try {
      await updateDemoStatus(id, status);

      // remove from UI
      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.log("Action error:", err);
    }
  };

  const pending = data.filter(item => item.status === "pending");
const approved = data.filter(item => item.status === "approved");
const rejected = data.filter(item => item.status === "rejected");

  // ---------------- UI ----------------
  if (loading) return <h3>Loading...</h3>;

  return (
    <div>
      <h2>Demo Requests</h2>

      {data.length === 0 ? (
        <p>No requests</p>
      ) : (
        <div>
         <AdminTable title="Pending Requests" items={pending} showActions={true}  handleAction={handleAction}/>
    <AdminTable title="Approved Requests" items={approved} showActions={false} />
    <AdminTable title="Rejected Requests" items={rejected} showActions={false} />
    </div>
      )}
    </div>
  );
};

export default DemoRequests;