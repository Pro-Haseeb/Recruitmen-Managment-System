import { useEffect, useState } from "react";
import {
  companiesData,
  toggleCompanyStatus,
} from "../../services/AdminApi";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  const fetchCompanies = async () => {
    try {
      const res = await companiesData();
      setCompanies(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // ================= BLOCK / UNBLOCK =================
  const handleToggleStatus = async (id) => {
    try {
      const res = await toggleCompanyStatus(id);

      // update ui instantly
      setCompanies((prev) =>
        prev.map((company) =>
          company._id === id ? res.data.company : company
        )
      );
    } catch (error) {
      console.error("Toggle error:", error);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return <h3>Loading companies...</h3>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Companies</h2>

      {companies.length === 0 ? (
        <p>No companies found</p>
      ) : (
        <table border="1" cellPadding="10" width="100%">
          <thead>
            <tr>
              <th>Name</th>
              <th>Website</th>
              <th>Size</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {companies.map((company) => (
              <tr key={company._id}>
                <td>{company.name}</td>

                <td>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {company.website}
                  </a>
                </td>

                <td>{company.size}</td>

                <td>
                  {company.isBlocked ? "Blocked" : "Active"}
                </td>

                <td>
                  <button
                    onClick={() =>
                      handleToggleStatus(company._id)
                    }
                  >
                    {company.isBlocked
                      ? "Unblock"
                      : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Companies;