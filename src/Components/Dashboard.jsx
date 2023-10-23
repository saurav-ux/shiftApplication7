import React, { useMemo, useState } from "react";
import MaterialReactTable from "material-react-table";
import { Button, Typography, Tooltip } from "@mui/material";
import AddShift from "./AddShift";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
  useGetshiftDataQuery,
  useDeleteShiftDataMutation,
} from "../Services/shiftApi";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Dashboard = () => {
  const [openAddModel, setOpenAddModel] = useState(false);
  //handle snakbar
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const [message, setMessage] = useState("Data Deleted Successfully");
  const [snakcolor, setSnackColor] = useState("success");
  const { vertical, horizontal, open } = state;

  //---------------RTK Query fetching----------------
  const { data: shiftData, refetch: refetchData,isError } = useGetshiftDataQuery();
  const [deleteShiftData] = useDeleteShiftDataMutation();
  // console.log("data",shiftData);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 80,
      },
      {
        accessorKey: "shifts",
        header: "Shifts",
      },
      {
        accessorKey: "startTime",
        header: "Start Time",
      },
      {
        accessorKey: "endTime",
        header: "End Time",
      },
      {
        accessorKey: "delete",
        header: "Delete",
      },
    ],
    []
  );

  //-----------------List To Display starts-------------------
  const listToDisplay =
    shiftData &&
    shiftData?.map((row, index) => {
      return {
        id: index + 1,
        shifts: row.name,
        startTime: row.startTime,
        endTime: row.endTime,
        delete: (
          <Tooltip title={"Delete"}>
            <Button
              variant="outlined"
              color="error"
              size="large"
              onClick={() => handleDelete(row._id)}
            >
              <DeleteOutlineOutlinedIcon
                className="text-38"
                size={24}
                color="error"
              />
            </Button>
          </Tooltip>
        ),
      };
    });

  //-----------------List To Display Ends-------------------

  const handleDelete = async (id) => {
    try {
      const response = await deleteShiftData(id);
      if (response?.data) {
        setState({ vertical: 'top',
        horizontal: 'center',
         open: true });
         setSnackColor("success")
         setMessage("Data Deleted Successfully")
       
        refetchData();
      }
    } catch (error) {
      console.log("Error: ", error);
      setState({ vertical: 'top',
      horizontal: 'center',
       open: true });
       setSnackColor("error")
       setMessage("Unable to Delete.")
    }
  };

  const handleClick = () => {
    setOpenAddModel(true);
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  return (
    <>
      <div className="page">
        <div className="head">
          <Typography><h4>Shift Dashboard</h4></Typography>
        </div>

        <div className="body">
          {isError && <> <p>Automation Server is not reachable !</p> <p>Please try again later</p> </>}

          <MaterialReactTable
            className="table"
            columns={columns}
            data={listToDisplay || []}
            enableColumnOrdering
            enableColumnDragging
            enableColumnResizing
            // enableFullScreenToggle={false}
            renderTopToolbarCustomActions={({ table }) => (
              <Button
                onClick={handleClick}
                style={{
                  backgroundColor: "rgb(17, 24, 39)",
                  color: "white",
                }}
                variant="contained"
                // startIcon={
                //   <FuseSvgIcon
                //     className="text-48"
                //     size={24}
                //     style={{ color: "white" }}
                //   >{`material-outline:add_circle`}</FuseSvgIcon>
                // }
              >
                Add New
              </Button>
            )}
          />
        </div>
           {/* alert snakbar start */}
           <Snackbar 
          anchorOrigin={{ vertical, horizontal }}
          key={vertical + horizontal}
          open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={snakcolor}  sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
            {/* alert snakbar end */}
      </div>
      <AddShift openAddModel={openAddModel} setOpenAddModel={setOpenAddModel} />
    </>
  );
};

export default Dashboard;
