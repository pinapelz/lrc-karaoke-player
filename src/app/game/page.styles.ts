import styled, { keyframes, css } from "styled-components";

/* ----- ANIMATIONS ----- */

export const pulseAnim = keyframes`
  0%   { opacity: 1; }
  50%  { opacity: 0.4; }
  100% { opacity: 1; }
`;

export const wrongShakeAnim = keyframes`
  0%   { transform: translateX(0); }
  20%  { transform: translateX(-4px); }
  40%  { transform: translateX(4px); }
  60%  { transform: translateX(-4px); }
  80%  { transform: translateX(4px); }
  100% { transform: translateX(0); }
`;

export const clearPopAnim = keyframes`
  0%   { transform: scale(0.8); opacity: 0; }
  40%  { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1.0); opacity: 0; }
`;

export const fadeInUpAnim = keyframes`
  0%   { transform: translateY(10px); opacity: 0; }
  100% { transform: translateY(0);    opacity: 1; }
`;

export const comboScaleAnim = keyframes`
  0%   { transform: scale(1); }
  50%  { transform: scale(1.4); }
  100% { transform: scale(1); }
`;

export const glowAnim = keyframes`
  0%   { box-shadow: 0 0 4px 0px rgba(124, 58, 237, 0.4); }
  50%  { box-shadow: 0 0 16px 4px rgba(124, 58, 237, 0.8); }
  100% { box-shadow: 0 0 4px 0px rgba(124, 58, 237, 0.4); }
`;

/* ----- LAYOUT ----- */

export const GameRoot = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: #0d0d14;
  color: #ffffff;
  font-family: "Roboto", "Segoe UI", Arial, sans-serif;
  overflow: hidden;
  z-index: 0;
`;

export const BackgroundVideo = styled.video`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  z-index: 0;
`;

export const GameNavbar = styled.nav`
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 52px;
  padding: 0 20px;
  background: rgba(13, 13, 20, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 20;
`;

export const GameContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  z-index: 1;
`;

/* ----- HUD ----- */

export const HUD = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 10px 24px;
  background: rgba(13, 13, 20, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  z-index: 2;
`;

export const HudStat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

export const HudValue = styled.span`
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
`;

export const HudLabel = styled.span`
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
`;

export const ComboValue = styled(HudValue)<{ $animate: boolean }>`
  ${({ $animate }) =>
    $animate &&
    css`
      animation: ${comboScaleAnim} 0.25s ease;
    `}
`;

/* ----- MAIN GAME AREA ----- */

export const GameArea = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 32px;
  gap: 24px;
  overflow: hidden;

  & > * {
    position: relative;
    z-index: 1;
  }
`;

export const UpcomingWrap = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const UpcomingLabel = styled.span`
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.30);
  margin-bottom: 2px;
`;

export const UpcomingText = styled.p`
  font-size: 20px;
  color: rgba(255, 255, 255, 0.30);
  font-weight: 400;
  font-family: "Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  min-height: 28px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
`;

export const CurrentWrap = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const LineTimingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const LineTimingMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 13px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
`;

export const LineTimingValue = styled.span`
  font-variant-numeric: tabular-nums;
`;

export const LineTimingBar = styled.div`
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 2px;
  overflow: hidden;
`;

export const LineTimingFill = styled.div.attrs<{ $pct: number }>((props) => ({
  style: {
    transform: `scaleX(${props.$pct / 100})`,
  },
}))<{ $pct: number }>`
  height: 100%;
  width: 100%;
  border-radius: 2px;
  background: #7c3aed;
  transform-origin: left;
  will-change: transform;
`;

export const CharRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  align-items: flex-end;
  min-height: 64px;
`;

export const WordWrap = styled.span`
  display: inline-flex;
  gap: 2px;
  white-space: nowrap;
`;

export const CharBox = styled.span<{
  $state: "typed" | "active" | "pending" | "wrong";
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 700;
  font-family: "Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  padding: 0 3px;
  border-radius: 4px;
  transition: all 0.08s ease;

  ${({ $state }) => {
    switch ($state) {
      case "typed":
        return css`
          color: #22c55e;
          opacity: 0.7;
        `;
      case "active":
        return css`
          color: #fbbf24;
          border-bottom: 3px solid #fbbf24;
          animation: ${pulseAnim} 1s ease infinite;
        `;
      case "pending":
        return css`
          color: rgba(255, 255, 255, 0.25);
        `;
      case "wrong":
        return css`
          color: #ef4444;
          animation: ${wrongShakeAnim} 0.3s ease;
        `;
    }
  }}
`;

export const ClearToast = styled.div`
  position: absolute;
  font-size: 28px;
  font-weight: 800;
  color: #22c55e;
  animation: ${clearPopAnim} 0.7s ease forwards;
  pointer-events: none;
`;

export const GetReadyText = styled.p`
  font-size: 28px;
  color: rgba(255, 255, 255, 0.50);
  font-weight: 500;
  text-align: center;
  animation: ${pulseAnim} 1.5s ease infinite;
  margin: 0;
`;

export const CompletedLineFade = styled.div`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.20);
  margin-top: 4px;
  min-height: 26px;
  transition: opacity 0.3s;
`;

/* ----- FOOTER ----- */

export const GameFooter = styled.footer`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.04);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  position: relative;
  z-index: 2;
`;

export const ControlBtn = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.20);
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

export const ProgressWrap = styled.div`
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 3px;
  overflow: hidden;
  cursor: pointer;
`;

export const ProgressFill = styled.div.attrs<{ $pct: number }>((props) => ({
  style: {
    width: `${props.$pct}%`,
  },
}))<{ $pct: number }>`
  height: 100%;
  background: #7c3aed;
  border-radius: 3px;
  transition: width 0.3s linear;
`;

export const TimeText = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.50);
  font-family: monospace;
  white-space: nowrap;
`;

/* ----- START SCREEN ----- */

export const StartOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(13, 13, 20, 0.96);
  z-index: 10;
  animation: ${fadeInUpAnim} 0.4s ease;
`;

export const StartCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 40px;
  max-width: 520px;
  width: 100%;
  text-align: center;
`;

export const OpacityControl = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: stretch;
`;

export const OpacityLabel = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
  letter-spacing: 1px;
  text-transform: uppercase;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const OpacityValue = styled.span`
  font-variant-numeric: tabular-nums;
`;

export const OpacitySlider = styled.input`
  width: 100%;
`;

export const CountdownNumber = styled.div`
  font-size: 72px;
  font-weight: 900;
  color: #ffffff;
  line-height: 1;
  letter-spacing: 2px;
`;

export const SongTitleText = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.2;
  margin: 0;
`;

export const SongArtistText = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.50);
  margin: 0;
`;

export const StartBtn = styled.button`
  padding: 14px 40px;
  border-radius: 12px;
  background: #7c3aed;
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.15s;

  &:hover:not(:disabled) {
    background: #6d28d9;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CodeSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const CodeInputRow = styled.div`
  display: flex;
  gap: 8px;
`;

export const CodeInputField = styled.input`
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  font-size: 13px;
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: rgba(255, 255, 255, 0.35);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.30);
  }
`;

export const CodeLoadBtn = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

/* ----- RESULTS SCREEN ----- */

export const ResultsOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(13, 13, 20, 0.96);
  z-index: 10;
  animation: ${fadeInUpAnim} 0.4s ease;
`;

export const ResultsCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 40px;
  max-width: 540px;
  width: 100%;
  text-align: center;
`;

export const ResultsTitle = styled.p`
  font-size: 14px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.40);
  margin: 0;
`;

export const BigScore = styled.h2`
  font-size: 64px;
  font-weight: 900;
  color: #ffffff;
  line-height: 1;
  margin: 0;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  width: 100%;
`;

export const StatBlock = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const StatValue = styled.span`
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
`;

export const StatLabel = styled.span`
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.40);
`;

export const ActionRow = styled.div`
  display: flex;
  gap: 12px;
`;

export const PlayAgainBtn = styled.button`
  padding: 10px 28px;
  border-radius: 12px;
  background: #7c3aed;
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: #6d28d9;
    transform: translateY(-2px);
  }
`;

export const HomeBtn = styled.button`
  padding: 10px 28px;
  border-radius: 12px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.20);
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;
