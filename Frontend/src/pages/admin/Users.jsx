import {
  Box,
  Typography,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Chip,
  Paper,
  InputAdornment
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";

import { useState } from "react";
import { ConfirmModal } from "../../components/Modals";

const drawerWidth = 240;

const users = [
  {
    name: "Ali Khan",
    email: "ali@gmail.com",
    role: "System Admin",
    status: "Active",
    date: "2026-05-01"
  },
  {
    name: "Sara Ahmed",
    email: "sara@gmail.com",
    role: "Company Admin",
    status: "Disabled",
    date: "2026-04-20"
  }
];

export default function Users() {
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <Box
      sx={{
        position: "fixed",
        top: "64px",
        left: `${drawerWidth}px`,
        right: 0,
        bottom: 0,

        p: 4,

        backgroundImage: `
          linear-gradient(
            to right,
            rgba(2,6,23,0.96),
            rgba(15,23,42,0.92)
          ),
          url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80")
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",

        overflowY: "auto"
      }}
    >

      {/* HEADER */}
      <Box mb={4}>
        <Typography
          variant="h4"
          fontWeight="900"
          sx={{
            color: "#fff",
            mb: 1
          }}
        >
          HR Team
        </Typography>

        <Typography
          sx={{
            color: "#94a3b8",
            fontSize: "15px"
          }}
        >
          Manage admins, recruiters and platform users across the hiring organization.
        </Typography>
      </Box>

      {/* SEARCH */}
      <TextField
        placeholder="Search Users..."
        fullWidth
        sx={{
          mb: 4,

          "& .MuiOutlinedInput-root": {
            borderRadius: "16px",
            background: "rgba(15,23,42,0.78)",
            backdropFilter: "blur(18px)",

            color: "#fff",

            border:
              "1px solid rgba(255,255,255,0.08)",

            transition: "0.3s ease",

            "& fieldset": {
              border: "none"
            },

            "&:hover": {
              border:
                "1px solid rgba(66,165,245,0.35)"
            },

            "&.Mui-focused": {
              border:
                "1px solid rgba(66,165,245,0.5)",
              boxShadow:
                "0 0 0 4px rgba(66,165,245,0.12)"
            }
          },

          "& input::placeholder": {
            color: "#94a3b8",
            opacity: 1
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#42a5f5" }} />
            </InputAdornment>
          )
        }}
      />

      {/* TABLE CARD */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "28px",
          overflow: "hidden",

          background:
            "rgba(15,23,42,0.78)",

          backdropFilter: "blur(18px)",

          border:
            "1px solid rgba(255,255,255,0.08)",

          boxShadow:
            "0 25px 60px rgba(0,0,0,0.35)"
        }}
      >
        <Table>

          <TableHead>
            <TableRow
              sx={{
                background:
                  "rgba(255,255,255,0.03)"
              }}
            >
              <TableCell sx={{ color: "#42a5f5", fontWeight: "bold" }}>
                <b>Name</b>
              </TableCell>

              <TableCell sx={{ color: "#42a5f5", fontWeight: "bold" }}>
                <b>Email</b>
              </TableCell>

              <TableCell sx={{ color: "#42a5f5", fontWeight: "bold" }}>
                <b>Role</b>
              </TableCell>

              <TableCell sx={{ color: "#42a5f5", fontWeight: "bold" }}>
                <b>Status</b>
              </TableCell>

              <TableCell sx={{ color: "#42a5f5", fontWeight: "bold" }}>
                <b>Created Date</b>
              </TableCell>

              <TableCell sx={{ color: "#42a5f5", fontWeight: "bold" }}>
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((u, i) => (
              <TableRow
                key={i}
                hover
                sx={{
                  transition: "0.3s ease",

                  "& td": {
                    color: "#e2e8f0",
                    borderColor:
                      "rgba(255,255,255,0.06)"
                  },

                  "&:hover": {
                    background:
                      "rgba(66,165,245,0.08)"
                  }
                }}
              >
                <TableCell>{u.name}</TableCell>

                <TableCell>{u.email}</TableCell>

                <TableCell>{u.role}</TableCell>

                <TableCell>
                  <Chip
                    label={u.status}
                    size="small"
                    sx={{
                      fontWeight: "bold",
                      color: "white",

                      background:
                        u.status === "Active"
                          ? "linear-gradient(135deg,#22c55e,#16a34a)"
                          : "linear-gradient(135deg,#64748b,#475569)",

                      boxShadow:
                        u.status === "Active"
                          ? "0 8px 20px rgba(34,197,94,0.35)"
                          : "0 8px 20px rgba(100,116,139,0.25)"
                    }}
                  />
                </TableCell>

                <TableCell>{u.date}</TableCell>

                <TableCell>
                  <IconButton
                    sx={{
                      color: "#42a5f5",

                      "&:hover": {
                        background:
                          "rgba(66,165,245,0.12)"
                      }
                    }}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    onClick={() => {
                      setSelectedUser(u);
                      setOpenDelete(true);
                    }}
                    sx={{
                      color: "#ef4444",

                      "&:hover": {
                        background:
                          "rgba(239,68,68,0.12)"
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </Paper>

      {/* DELETE MODAL */}
      <ConfirmModal
        open={openDelete}
        title="Delete User"
        description={`Are you sure you want to delete ${selectedUser?.name}?`}
        onClose={() => setOpenDelete(false)}
        onConfirm={() => {
          console.log("Deleted:", selectedUser);
          setOpenDelete(false);
        }}
      />
    </Box>
  );
}