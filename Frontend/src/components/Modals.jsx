import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from "@mui/material";

/* 🔵 1. GENERIC MODAL (Forms, Create, Edit etc.) */
export function CustomModal({
  open,
  title,
  children,
  onClose,
  onSubmit,
  submitText = "Save"
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      
      <DialogTitle>
        <Typography fontWeight="bold">
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {children}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button variant="contained" onClick={onSubmit}>
          {submitText}
        </Button>
      </DialogActions>

    </Dialog>
  );
}


/* 🔴 2. DELETE CONFIRMATION MODAL */
export function ConfirmModal({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  onClose,
  onConfirm
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">

      <DialogTitle>
        <Typography fontWeight="bold" color="error">
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Typography>
          {message}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button color="error" variant="contained" onClick={onConfirm}>
          Delete
        </Button>
      </DialogActions>

    </Dialog>
  );
}