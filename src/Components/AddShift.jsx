import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useFormik } from "formik";
import {
  useAddShiftDataMutation,
  useGetshiftDataQuery,
} from "../Services/shiftApi";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AddShift = ({ openAddModel, setOpenAddModel }) => {

  //handle snakbar
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const [message, setMessage] = useState("Shift Added Successfully");
  const [snakcolor, setSnackColor] = useState("success");
  const { vertical, horizontal, open } = state;

  //---------------RTK Query fetching----------------
  const { refetch: refetchShift } = useGetshiftDataQuery();
  const [addShift] = useAddShiftDataMutation();
  
  const handleClose = () => {
    setOpenAddModel(false);
    resetForm()
  };

  const handleCloseSnack = () => {
    setState({ ...state, open: false });
  };

//------------------SubmitForm starts---------------------
  const submitHandler = async (value, action) => {
    try {
      const response = await addShift(value);
      if (response.error) {
        setState({ vertical: "top", horizontal: "center", open: true });
        setSnackColor("error");
        setMessage("Unable to add shift");
      }
      if (response?.data) {
        setState({ vertical: "top", horizontal: "center", open: true });
        setSnackColor("success");
        setMessage("Shift Added Successfully");
        console.log("response", response);
        refetchShift();
        setOpenAddModel(false);
      }
    } catch (error) {
      console.log("Error", error);
      setState({ vertical: "top", horizontal: "center", open: true });
      setSnackColor("error");
      setMessage("Unable to add shift");
    }

    action.resetForm();
  };
  //------------------SubmitForm Ends---------------------

  //-------------------Formik starts------------------------
  const initialValues = {
    name: "",
    startTime: "",
    endTime: "",
  };
  const { values, errors, touched, handleBlur, handleChange, handleSubmit,resetForm } =
    useFormik({
      initialValues: initialValues,
      onSubmit: submitHandler,
    });
  //-------------------Formik starts------------------------
  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        fullWidth={true}
        maxWidth={"sm"}
        aria-labelledby="customized-dialog-title"
        open={openAddModel}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title" 
        style={{backgroundColor:'black',color:'white'}}
        >
          Add Shift
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <form action="" onSubmit={handleSubmit}>
            <label className="label"><b>Start Time</b></label>
            <input 
              className="textfield"
              type="time"
              name="startTime"
              id="startTime"
              required
              value={values.startTime}
              onChange={handleChange}
            />
            <br />
            <br />
            <label><b>End Time</b></label>
            <input
              className="textfield"
              type="time"
              name="endTime"
              id="endTime"
              required
              value={values.endTime}
              onChange={handleChange}
            />
            <br />
            <br />
            <label><b>Shift Name</b></label>
            <input     
              className="textfield"
              type="name"
              placeholder="Enter Your Shift Name"
              required
              name="name"
              id="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
            />
            <br /> <br />
            <DialogActions>
              <Button autoFocus type="submit"
                style={{
                  backgroundColor: "rgb(17, 24, 39)",
                  color: "white",
                }}
                variant="contained"
              >
                Submit
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </BootstrapDialog>

      {/* alert snakbar start */}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        key={vertical + horizontal}
        open={open}
        autoHideDuration={6000}
        onClose={handleCloseSnack}
      >
        <Alert
          onClose={handleCloseSnack}
          severity={snakcolor}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
      {/* alert snakbar end */}
    </div>
  );
};

export default AddShift;
