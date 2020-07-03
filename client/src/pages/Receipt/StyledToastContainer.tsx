import React from 'react';
import styled from 'styled-components';
import { ToastContainer, ToastContainerProps } from 'react-toastify';
import AppTheme from "src/theme";
import ErrorTheme from "src/theme";
import "src/css/index.css";

export const WrappedToastContainer = ({ className, ...rest }: ToastContainerProps & { className?: string }) => (
  <div className={className}>
    <ToastContainer {...rest} />
  </div>
);

export default styled(WrappedToastContainer).attrs({
})`
  .Toastify__toast-container {
  }
  .Toastify__toast {
    min-height: 50px;
    max-width: 95vw;
    border-radius: 5px;
    border: solid rgba(255,255,255,0.5);
    border-width: medium;
  }
  .Toastify__toast--error {
    background-color: ${ErrorTheme.palette.secondary.main};    
  }
  .Toastify__toast--info {
    // background-color: ${AppTheme.palette.primary.main};
  }
  .Toastify__toast--success {
    background-color: ${ErrorTheme.palette.primary.main};
  }
  .Toastify__toast-body {
    font-family: var(--default-font-family);
    padding: 0% 5%;
  }
  .Toastify__progress-bar {
    &--info{
      background: linear-gradient(to right, #4cd964, #5ac8fa, #007aff, #34aadc, #5856d6, #ff2d55);
    }
  }
`;
