import React, { useEffect, useState } from "react";
import { OutlinedInput, InputLabel, InputAdornment } from "@material-ui/core";
import { isDebug } from "src/config";
import "src/css/animation.css";

//TODO(#32) Need to setup JSDoc + better-docs to test documentation syntax
/**
 * Generic Text SearchBar with Toggleable Icon
 *
 * @component
 * @example
 * <IconSearchBar
 *   icon={[<OnIcon />, <OffIcon />]}
 *   iconCallback={iconStateCallback}
 * />
 * @prop {React.ReactElement[]}     icon - List of 2 icons to render depending on the state of toggle
 * @prop {function(boolean)} iconCallback - Function invoked when a click event is triggered in SearchBar
 * @prop {function(string)}   onChangeCallback - Pass the current string entered in SearchBar when a change is detected
 * @prop {function(string)}   onSubmitCallback - Pass final user input string entered to specified trigger function, fires on ENTER key or onBlur
 */
function IconSearchBar({
  icon,
  isLoading,
  iconCallback,
  onChangeCallback,
  onSubmitCallback,
}: {
  icon: React.ReactElement[];
  isLoading?: boolean;
  iconCallback?: (status: boolean) => void;
  onChangeCallback?: (text: string) => void;
  onSubmitCallback?: (text: string) => void;
}) {
  const [iconStatus, setIconStatus] = useState(false);

  const iconClickWrapper = () => {
    setIconStatus(!iconStatus);
  };

  const updateTextWrapper = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (onChangeCallback) {
      onChangeCallback(event.target.value);
    }
  };

  const keyPressWrapper = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // Unfocus input text field to 'submit' search query on ENTER pressed
    if (event.key === "Enter") {
      const ele = document.getElementById("icon-search-bar");
      if (ele) {
        ele.blur();
      }
    }
  };

  const blurWrapper = (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (onSubmitCallback) {
      onSubmitCallback(event.target.value);
    }
  };

  useEffect(() => {
    if (iconCallback) iconCallback(iconStatus);
  }, [iconStatus]);

  return (
    <div className="DebugBar">
      <OutlinedInput
        id="icon-search-bar"
        startAdornment={
          <InputAdornment
            id="icon-search-icon"
            position="start"
            onClick={iconClickWrapper}
            style={{ cursor: "pointer" }}
            className={isLoading ? "animate-flicker" : undefined}
          >
            {iconStatus ? icon[0] : icon[1]}
          </InputAdornment>
        }
        fullWidth={true}
        onChange={updateTextWrapper}
        onKeyPress={keyPressWrapper}
        onBlur={blurWrapper}
      />
    </div>
  );
}

export default IconSearchBar;
