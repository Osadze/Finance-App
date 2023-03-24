import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import { useState, useEffect } from "react";
import FormControl from "@mui/material/FormControl";
import { useDispatch } from "react-redux";
import { counterActions } from "../../store/index";
import { FormControlLabel, Radio, RadioGroup, FormLabel } from "@mui/material";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
function SearchAndSort(props) {
  const [serchText, setSearchText] = useState("");
  const dispatch = useDispatch();

  const [components, setComponents] = useState({
    type: "",
    status: "",
    valueRangeMin: "",
    valueRangeMax: "",
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  function SearchItem() {
    props.setUpdateFinance(!props.updateFinance);
  }
  //date picker
  const handleDateChange = (dates) => {
    const [start, end] = dates;

    setStartDate(start);
    setEndDate(end);
    if (start) {
      const formattedStartDate = start?.toISOString().slice(0, 10);
      dispatch(counterActions.addStartDate(formattedStartDate));
    }
    if (end) {
      const formattedEndDate = end?.toISOString().slice(0, 10);
      dispatch(counterActions.addEndDate(formattedEndDate));
    }
  };

  //add in redux
  useEffect(() => {
    if (serchText) {
      dispatch(counterActions.addSearchInput(serchText));
    }
    // eslint-disable-next-line
  }, [serchText]);

  useEffect(() => {
    if (components) {
      dispatch(counterActions.UpdateComponents(components));
    }
    // eslint-disable-next-line
  }, [components]);

  //value picker

  return (
    <Box
      component="form"
      sx={{
        marginTop: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      noValidate
      autoComplete="off"
    >
      <div
        style={{
          border: "1px solid #2F343A",
          display: "flex",
          padding: "10px",
          gap: 2,
          alignItems: "center",
        }}
      >
        <TextField
          label="Search"
          color="primary"
          onChange={(e) => setSearchText(e.target.value)}
        />
        <IconButton
          aria-label="delete"
          sx={{ width: "40px", height: "40px" }}
          onClick={SearchItem}
        >
          <SearchIcon />
        </IconButton>
      </div>
      <div>
        <FormControl>
          <FormLabel id="radio1">Finance Type</FormLabel>
          <RadioGroup
            aria-labelledby="radio1"
            name="radio1"
            value={components.type}
            onChange={(e) =>
              setComponents({ ...components, type: e.target.value })
            }
          >
            <FormControlLabel
              value="income"
              control={<Radio />}
              sx={{ color: "white" }}
              label="Income"
            />
            <FormControlLabel
              value="outcome"
              control={<Radio />}
              sx={{ color: "white" }}
              label="Outcome"
            />

            <FormControlLabel
              value=""
              control={<Radio />}
              sx={{ color: "white" }}
              label="All"
            />
          </RadioGroup>
        </FormControl>

        {(components.type === "outcome" || components.type === "") && (
          <FormControl>
            <FormLabel id="radio2">Status</FormLabel>
            <RadioGroup
              aria-labelledby="radio2"
              name="radio2"
              value={components.status}
              onChange={(e) =>
                setComponents({ ...components, status: e.target.value })
              }
            >
              <FormControlLabel
                value="processing"
                control={<Radio />}
                sx={{ color: "white" }}
                label="Processing"
              />
              <FormControlLabel
                value="completed"
                control={<Radio />}
                sx={{ color: "white" }}
                label="Completed"
              />

              <FormControlLabel
                value=""
                control={<Radio />}
                sx={{ color: "white" }}
                label="All"
              />
            </RadioGroup>
          </FormControl>
        )}
      </div>

      <div
        component="form"
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
        noValidate
        autoComplete="off"
      >
        <FormLabel id="range">choose money range</FormLabel>
        <TextField
          id="outlined-range"
          label="Min"
          onChange={(e) =>
            setComponents({ ...components, valueRangeMin: e.target.value })
          }
          variant="outlined"
        />
        <TextField
          id="outlined-basic"
          label="Max"
          variant="outlined"
          onChange={(e) =>
            setComponents({ ...components, valueRangeMax: e.target.value })
          }
        />
      </div>

      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        inline
      />
    </Box>
  );
}
export default SearchAndSort;
