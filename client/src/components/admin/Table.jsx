const Table = ({ title, items, showActions, handleAction }) => (
  <div style={{ marginBottom: "30px" }}>
    <h3>{title}</h3>

    {items.length === 0 ? (
      <p>No {title}</p>
    ) : (
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Company</th>
            <th>Email</th>
            <th>Size</th>
            <th>Status</th>
            {showActions && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.companyName}</td>
              <td>{item.officialEmail}</td>
              <td>{item.companySize}</td>
              <td>{item.status}</td>

              {showActions && (
                <td>
                  <button onClick={() => handleAction(item._id, "approved")}>
                    Approve
                  </button>

                  <button
                    onClick={() => handleAction(item._id, "rejected")}
                    style={{ marginLeft: "10px" }}
                  >
                    Reject
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export default Table;