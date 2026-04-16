import React, { CSSProperties, useCallback } from "react";
import { Lrc, LrcLine } from "react-lrc";
import { Line } from "./LRCPlayer.styles";

const lrcStyle: CSSProperties = {
    flex: 1,
    minHeight: 0,
    overflow: "hidden !important",
    overflowY: "auto",
    scrollBehavior: "smooth",
};

interface LrcPlayerProps {
    currentMillisecond: number;
    lrc: string;
    animate: boolean;
    lrcColor: string;
    fontColor: string;
}

const LrcPlayer: React.FC<LrcPlayerProps> = ({
    currentMillisecond,
    lrc,
    animate,
    lrcColor = "#C8BEBE",
    fontColor = "rgb(72, 72, 72)",
}) => {
    const lineRenderer = useCallback(
        ({ active, line: { content } }: { active: boolean; line: LrcLine }) => {
            const next = active && content === "";
            return (
                <Line
                    $active={active}
                    $next={next}
                    $animate={animate}
                    $lrcColor={lrcColor}
                    $fontColor={fontColor}
                >
                    {content}
                </Line>
            );
        },
        [animate, lrcColor, fontColor],
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
