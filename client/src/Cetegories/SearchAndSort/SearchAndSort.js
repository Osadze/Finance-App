import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import { useState, useEffect } from "react";
import FormControl from "@mui/material/FormControl";
import { useDispatch, useSelector } from "react-redux";
import { counterActions } from "../../store/index";
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Slider,
} from "@mui/material";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function valuetext(value) {
  return `${value}°C`;
}

const minDistance = 10;

function SearchAndSort(props) {
  const [serchText, setSearchText] = useState("");
  const dispatch = useDispatch();

  const [components, setComponents] = useState({
    type: "",
    status: "",
    valueRange: [0, 100000],
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const finances = useSelector((state) => state.finances);
  let k = Math.max.apply(
    Math,
    finances?.map(function (o) {
      return o.money;
    })
  );

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
  const handleChange2 = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }
    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance);
        setComponents({
          ...components,
          valueRange: [clamped, clamped + minDistance],
        });
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setComponents({
          ...components,
          valueRange: [clamped - minDistance, clamped],
        });
      }
    } else {
      setComponents({ ...components, valueRange: newValue });
    }
  };
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

      <Box sx={{ width: 300 }} style={{ marginRight: "100px" }}>
        <FormLabel id="range">choose value range</FormLabel>
        <Slider
          getAriaLabel={() => "Minimum distance shift"}
          value={components.valueRange}
          onChange={handleChange2}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          disableSwap
          max={k}
        />
      </Box>

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
