import React from "react";
import "./LoadingComponent.css";

export interface NLoadingComponentProps {
  /**
   * Whether the component is visible
   */
  isShow?: boolean;

  /**
   * Whether the loading component is visible
   */
  isVisible?: boolean;

  /**
   * Size of the loading spinner (in pixels)
   */
  size?: number;

  /**
   * Color of the loading spinner
   */
  spinnerColor?: string;

  /**
   * Speed of the loading animation (in seconds)
   */
  speed?: number;

  /**
   * Logo/image to display in the center
   * Can be a URL string or React component
   */
  logo?: React.ReactNode | string;

  /**
   * Size of the center logo/image (in pixels)
   */
  logoSize?: number;

  /**
   * Background color of the loading overlay
   */
  backgroundColor?: string;

  /**
   * Opacity of the background overlay
   */
  backgroundOpacity?: number;

  /**
   * Text to display below the spinner
   */
  loadingText?: string;

  /**
   * Custom text color
   */
  textColor?: string;

  /**
   * Font size of the loading text
   */
  textSize?: number;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Custom styles
   */
  style?: React.CSSProperties;

  /**
   * Thickness of the spinner stroke
   */
  strokeWidth?: number;

  /**
   * Whether to show the loading component as fullscreen overlay
   */
  fullscreen?: boolean;

  /**
   * Z-index for the loading overlay
   */
  zIndex?: number;
}

const NLoadingComponent: React.FC<NLoadingComponentProps> = ({
  isShow = true,
  isVisible = true,
  size = 80,
  spinnerColor = "#000000",
  speed = 1.5,
  logo = "https://www.npmjs.com/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci84ZWNjMjQ2OGY2YjEwYzIxY2EzZmM3Nzk3ZTNhNjQ0Yz9zaXplPTQ5NiZkZWZhdWx0PXJldHJvIn0.Iabsa4eJ0mPKMBFLsCryOVrXxFLG3I5m_HGpboOOpbk",
  logoSize = 62,
  backgroundColor = "#ffffff0c",
  backgroundOpacity = 0.8,
  loadingText = "Loading...",
  textColor = "#666666",
  textSize = 14,
  className = "",
  style,
  strokeWidth = 4,
  fullscreen = true,
  zIndex = 9999,
}) => {
  if (!isShow || !isVisible) return null;

  const renderLogo = () => {
    if (!logo) return null;

    if (typeof logo === "string") {
      // If logo is a string, treat it as an image URL
      return (
        <img
          src={logo}
          alt="Loading"
          className="loading-logo"
          style={{
            width: logoSize,
            height: logoSize,
          }}
        />
      );
    }

    // If logo is a React component
    return (
      <div
        className="loading-logo"
        style={{
          width: logoSize,
          height: logoSize,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {logo}
      </div>
    );
  };

  const spinnerRadius = (size - strokeWidth) / 2;
  const backgroundCircleColor = "#0000002d";

  return (
    <div
      className={`loading-component ${
        fullscreen ? "loading-fullscreen" : ""
      } ${className}`}
      style={{
        backgroundColor: `rgba(${parseInt(
          backgroundColor.slice(1, 3),
          16
        )}, ${parseInt(backgroundColor.slice(3, 5), 16)}, ${parseInt(
          backgroundColor.slice(5, 7),
          16
        )}, ${backgroundOpacity})`,
        zIndex,
        ...style,
      }}
    >
      <div className="loading-content">
        <div
          className="loading-spinner-container"
          style={{
            width: size,
            height: size,
          }}
        >
          {/* Circular Progress Spinner */}
          <svg
            className="loading-spinner"
            width={size}
            height={size}
            style={
              {
                // animation: `loading-rotate ${speed}s linear infinite`,
              }
            }
          >
            {/* Background Circle (Light Grey Ring) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={spinnerRadius}
              fill="none"
              stroke={backgroundCircleColor}
              strokeWidth={strokeWidth}
              className="loading-circle-background"
            />
            {/* Progress Circle (Black Segment) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={spinnerRadius}
              fill="none"
              stroke={spinnerColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              className="loading-circle-spinner"
              strokeDasharray="80 200"
              style={{
                animation: `loading-rotate ${speed}s linear infinite`,
              }}
            />
          </svg>

          {/* Center Logo */}
          <div className="loading-logo-container">{renderLogo()}</div>
        </div>

        {/* Loading Text */}
        {loadingText && (
          <div
            className="loading-text"
            style={{
              color: textColor,
              fontSize: textSize,
            }}
          >
            {loadingText}
          </div>
        )}
      </div>
    </div>
  );
};

export default NLoadingComponent;
