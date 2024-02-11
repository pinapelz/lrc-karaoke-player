import React, { CSSProperties, useCallback } from 'react';
import { Lrc, LrcLine } from 'react-lrc';
import styled from 'styled-components';
import css from 'styled-components';

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
    transition: color 1s ease-out, background-position 1s ease-out;

    ${({ $active }: { $active: boolean }) => $active ? `
        color: black;
        font-weight: 700;
    ` : ''}
`;
const lrcStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflow: 'hidden !important'
};

interface LRCPlayerProps {
  currentMillisecond: number;
  lrc: string;
}

const LRCPlayer: React.FC<LRCPlayerProps> = ({ currentMillisecond, lrc }) => {
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

export default LRCPlayer;
