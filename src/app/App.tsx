import { CSSProperties, useCallback, useRef, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { Lrc, LrcLine } from "react-lrc";
import { LRC } from "./data";

const Root = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;

  display: flex;
  flex-direction: column;
`;
const lrcStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflow: 'hidden !important'
};
const Line = styled.div<{ $active: boolean; $next: boolean }>`
  min-height: 10px;
  padding: 14px 30px;

  font-size: 40px;
  font-family : "Roboto", sans-serif;
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

function App() {
  const [currentMillisecond, setCurrentMillisecond] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const syncLrcWithVideo = () => {
      const offset = 400;
      setCurrentMillisecond((video.currentTime * 1000)+offset);
    };

    video.addEventListener('timeupdate', syncLrcWithVideo);

    return () => {
      video.removeEventListener('timeupdate', syncLrcWithVideo);
    };
  }, [setCurrentMillisecond]);

  const lineRenderer = useCallback(
    ({ active, line: { content } }: { active: boolean; line: LrcLine }) => {
      const next = active && content === '';
      return <Line $active={active} $next={next}>{content}</Line>
    },
    []
  );

  return (
    <Root>
      <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
        <Lrc
            lrc={LRC}
            lineRenderer={lineRenderer}
            currentMillisecond={currentMillisecond}
            style={lrcStyle}
            recoverAutoScrollInterval={0}
          />
        <div style={{ flex: 1 }}>
        <video ref={videoRef} src="https://cdn.pinapelz.com/VTuber%20Covers%20Archive/pj9yqqTYa-E.webm" controls style={{ width: '100%', height: '100%' }} />
         
        </div>
      </div>
    </Root>
  );
}

export default App;
