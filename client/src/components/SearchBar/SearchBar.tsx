import React, { useEffect, useState } from "react";
import { OutlinedInput, InputLabel, InputAdornment } from "@material-ui/core";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import LocationOffIcon from "@material-ui/icons/LocationOff";

function SearchBar({
  iconCallback,
  onChangeCallback,
  onEnterCallback,
}: {
  iconCallback?: () => void;
  onChangeCallback?: (text: string) => void;
  onEnterCallback?: (text: string) => void;
}) {
  const [gpsStatus, setGpsStatus] = useState(false);

  const iconClickWrapper = () => {
    setGpsStatus(!gpsStatus);
    if (iconCallback) iconCallback();
  };

  const dynamicChangeWrapper = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (onChangeCallback) {
      onChangeCallback(event.target.value);
    }
  };

  const keyPressWrapper = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      const ele = document.getElementById("stores-search-bar");
      if (ele) ele.blur();
    }
  };

  const blurWrapper = (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (onEnterCallback) {
      onEnterCallback(event.target.value);
    }
  };

  return (
    <div className="DebugBar">
      <InputLabel htmlFor="stores-search-bar">
        Search {gpsStatus ? "with" : "without"} Location
      </InputLabel>
      <OutlinedInput
        id="stores-search-bar"
        startAdornment={
          <InputAdornment
            position="start"
            onClick={iconClickWrapper}
            style={{ cursor: "pointer" }}
          >
            {gpsStatus ? (
              <LocationOnIcon style={{ color: "#33CC55" }} />
            ) : (
              <LocationOffIcon />
            )}
          </InputAdornment>
        }
        fullWidth={true}
        onChange={dynamicChangeWrapper}
        onKeyPress={keyPressWrapper}
        onBlur={blurWrapper}
      />
    </div>
  );
}

export default SearchBar;
