import styled, { css } from "styled-components";

export const Root = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  overflow: hidden;
`;

export const PanesContainer = styled.div`
  display: flex;
  flex: 1;
  height: 100vh;
  overflow: hidden;
  user-select: none;
`;

export const LyricsPane = styled.div<{ $width: number }>`
  width: ${({ $width }) => $width}%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #ffffff;
`;

export const ResizeHandle = styled.div`
  width: 5px;
  flex-shrink: 0;
  background-color: #ddd;
  cursor: col-resize;
  transition: background-color 0.15s ease;
  position: relative;

  &:hover,
  &:active {
    background-color: #aaa;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0 -4px;
  }
`;

export const VideoPane = styled.div<{ $dragOver: boolean }>`
  flex: 1;
  position: relative;
  background-color: ${({ $dragOver }) => ($dragOver ? "#dbeeff" : "#ffffff")};
  transition: background-color 0.15s ease;
  overflow: hidden;
`;

export const VideoElement = styled.video`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
`;

export const CaptionsOverlay = styled.div`
  position: absolute;
  inset: 0;
  width: 90%;
  height: 90%;
  margin: auto;
  cursor: pointer;
`;

export const ControlBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 10;
`;

export const PlayButton = styled.button`
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  padding: 0;
  border: none;
  background-color: transparent;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.12);
  }
`;

export const ScrubBar = styled.input`
  flex: 1;
  height: 4px;
  margin: 0 12px 0 4px;
  cursor: pointer;
  accent-color: #fff;
`;

export const ControlPanel = styled.div<{ $visible: boolean }>`
  position: absolute;
  bottom: 50px;
  left: 0;
  right: 0;
  background: rgba(14, 14, 14, 0.88);
  backdrop-filter: blur(8px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 7px 12px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  z-index: 9;
  transform: translateY(${({ $visible }) => ($visible ? "0" : "6px")});
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
  transition:
    transform 0.18s ease,
    opacity 0.18s ease;
`;

export const PanelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
`;

export const PanelDivider = styled.div`
  width: 1px;
  height: 20px;
  background-color: rgba(255, 255, 255, 0.15);
  flex-shrink: 0;
  margin: 0 2px;
`;

export const panelItemStyles = css`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background-color: rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.85);
  font-size: 12px;
  font-family: Arial, sans-serif;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.15s ease;
  line-height: 1.4;

  &:hover {
    background-color: rgba(255, 255, 255, 0.16);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.35);
  }
`;

export const PanelLabel = styled.label`
  ${panelItemStyles}
`;

export const PanelButton = styled.button`
  ${panelItemStyles}
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const PanelFieldLabel = styled.span`
  color: rgba(255, 255, 255, 0.45);
  font-size: 11px;
  font-family: Arial, sans-serif;
  white-space: nowrap;
`;

export const PanelNumberInput = styled.input`
  width: 68px;
  padding: 3px 6px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background-color: rgba(255, 255, 255, 0.08);
  color: #fff;
  font-size: 12px;
  font-family: Arial, sans-serif;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
  }

  -moz-appearance: textfield;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    opacity: 0.4;
  }
`;

export const PanelRangeInput = styled.input`
  width: 90px;
  accent-color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  vertical-align: middle;
`;

export const PanelCheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  font-family: Arial, sans-serif;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
`;

export const ColorSwatch = styled.input`
  width: 24px;
  height: 24px;
  padding: 1px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  cursor: pointer;
  background: none;
  vertical-align: middle;
`;

export const PlaceholderWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
  text-align: center;
  font-family: Arial, sans-serif;
`;

export const PlaceholderHeading = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 12px;
`;

export const PlaceholderBody = styled.p`
  font-size: 18px;
  line-height: 1.6;
  margin: 0 0 20px;
`;

export const CodeInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 420px;
  font-family: Arial, sans-serif;
  font-size: 14px;
`;

export const CodeInput = styled.input`
  width: 100%;
  font-size: 15px;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
`;

export const LoadButton = styled.button`
  padding: 7px 14px;
  border-radius: 5px;
  border: 1px solid #ddd;
  background-color: #fff;
  font-family: Arial, sans-serif;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover,
  &:focus {
    background-color: #eaeaea;
    outline: none;
  }
`;

export const StyledLink = styled.a`
  font-family: Arial, sans-serif;
  text-decoration: none;
  color: #0066cc;

  &:hover {
    text-decoration: underline;
  }
`;
