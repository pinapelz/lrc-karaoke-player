import styled, { css } from "styled-components";

interface LineProps {
  $active: boolean;
  $next: boolean;
  $animate: boolean;
  $lrcColor: string;
  $fontColor: string;
}

export const Line = styled.div<LineProps>`
  min-height: 10px;
  padding: 14px 30px;

  font-size: 40px;
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  text-align: center;
  color: ${({ $fontColor }) => $fontColor};

  background: ${({ $lrcColor }) => `linear-gradient(
    to right,
    rgba(0, 0, 0, 0) 50%,
    ${$lrcColor} 50%
  )`};
  background-size: 200% 100%;
  background-position: right bottom;

  ${({ $animate }) =>
    $animate &&
    css`
      transition:
        color 0.3s ease,
        background-position 0.5s ease;
    `}

  ${({ $active }) =>
    $active &&
    css`
      color: rgb(50, 50, 50);
      font-weight: 700;
      background-position: left bottom;
    `}
`;
