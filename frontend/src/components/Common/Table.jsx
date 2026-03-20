import React, { useState } from "react";

const Table = ({ headers, rows }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  
  const filteredRows = rows.filter((row) =>
    row.some((cell) =>
      cell.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  return (
    <div>
      
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        style={{
          padding: "8px",
          marginBottom: "10px",
          width: "100%",
        }}
      />

      
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
        }}
      >
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  backgroundColor: "#f4f4f4",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {currentRows.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                style={{
                  textAlign: "center",
                  padding: "10px",
                }}
              >
                No data available
              </td>
            </tr>
          ) : (
            currentRows.map((row, i) => (
              <tr
                key={i}
                style={{
                  backgroundColor: i % 2 === 0 ? "#fff" : "#f9f9f9",
                  cursor: "pointer",
                  transition: "0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#e6f7ff")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    i % 2 === 0 ? "#fff" : "#f9f9f9")
                }
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      
      <div style={{ marginTop: "10px", textAlign: "center" }}>
        <button
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
          style={{ marginRight: "5px" }}
        >
          Prev
        </button>

        <span>
          Page {currentPage} / {totalPages || 1}
        </span>

        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          style={{ marginLeft: "5px" }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;