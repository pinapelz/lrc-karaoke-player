import React, { CSSProperties, useCallback } from "react";
import styled, { css } from "styled-components";
import { Lrc, LrcLine } from "react-lrc";

interface LineProps {
    $active: boolean;
    $next: boolean;
    $animate: boolean;
    $lrcColor: string;
    $fontColor: string;
}

const Line = styled.div<LineProps>`
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

const lrcStyle: CSSProperties = {
    flex: 1,
    minHeight: 0,
    overflow: "hidden !important",
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
