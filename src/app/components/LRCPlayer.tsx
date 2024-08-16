import React, { CSSProperties, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { Lrc, LrcLine } from 'react-lrc';

const Line = styled.div<{ $active: boolean; $next: boolean }>`
    min-height: 10px;
    padding: 14px 30px;

    font-size: 40px;
    font-family: "Roboto", sans-serif;
    font-weight: 500;
    text-align: center;
    color: rgb(72,72,72);

    background: linear-gradient(to right, rgba(0,0,0,0) 50%, rgb(200, 190, 190) 50%);
    background-size: 200% 100%;
    background-position: right bottom;

    ${({ $active }) => $active && css`
        color: black;
        font-weight: 700;
        background-position: left bottom;
        color: rgb(50, 50, 50);
    `}
`;
const lrcStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflow: 'hidden !important'
};

interface LrcPlayerProps {
  currentMillisecond: number;
  lrc: string;
}

const LrcPlayer: React.FC<LrcPlayerProps> = ({ currentMillisecond, lrc }) => {
  const lineRenderer = useCallback(
    ({ active, line: { content } }: { active: boolean; line: LrcLine }) => {
      const next = active && content === '';
      return <Line $active={active} $next={next}>{content}</Line>;
    },
    []
  );

  return (
    <Lrc
      lrc={lrc}
      lineRenderer={lineRenderer}
      currentMillisecond={currentMillisecond}
      style={lrcStyle}
      recoverAutoScrollInterval={0}
    />
  );
};

export default LrcPlayer;