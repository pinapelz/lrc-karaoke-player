"use client";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  Suspense,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FaRedo } from "react-icons/fa";
import { MdLibraryMusic } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  GameRoot,
  GameNavbar,
  GameContent,
  HUD,
  HudStat,
  HudValue,
  HudLabel,
  ComboValue,
  GameArea,
  UpcomingWrap,
  UpcomingLabel,
  UpcomingText,
  CurrentWrap,
  LineTimingMeta,
  LineTimingValue,
  LineTimingRow,
  LineTimingBar,
  LineTimingFill,
  CharRow,
  WordWrap,
  CharBox,
  ClearToast,
  GetReadyText,
  CompletedLineFade,
  GameFooter,
  ControlBtn,
  ProgressWrap,
  ProgressFill,
  TimeText,
  StartOverlay,
  StartCard,
  CountdownNumber,
  SongTitleText,
  SongArtistText,
  StartBtn,
  CodeSection,
  CodeInputRow,
  CodeInputField,
  CodeLoadBtn,
  ResultsOverlay,
  ResultsCard,
  ResultsTitle,
  BigScore,
  StatsGrid,
  StatBlock,
  StatValue,
  StatLabel,
  ActionRow,
  PlayAgainBtn,
  HomeBtn,
} from "./page.styles";
import { gReducer, initialGState } from "./game.stat";
import { formatTime, parseLrcLines, calculateCPSNeeded } from "./game.utils";

type GamePhase = "idle" | "countdown" | "playing" | "paused" | "finished";

function GameInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const audioRef = useRef<HTMLAudioElement>(null);
  const gameStartTimeRef = useRef<number>(0);
  const lastHandledIdxRef = useRef(-1);

  const [phase, setPhase] = useState<GamePhase>("idle");
  const [currentMs, setCurrentMs] = useState(0);
  const [lineTimingPct, setLineTimingPct] = useState(0);
  const [lineRemainingMs, setLineRemainingMs] = useState(0);
  const [currentLineTime, setCurrentLineTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progressPct, setProgressPct] = useState(0);
  const [gameDurationMs, setGameDurationMs] = useState(0);

  const [lrcContent, setLrcContent] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [songTitle, setSongTitle] = useState("Unknown Title");
  const [songArtist, setSongArtist] = useState("Unknown Artist");
  const [offset, setOffset] = useState(0);
  const [loadingLrc, setLoadingLrc] = useState(false);

  const [codeInput, setCodeInput] = useState("");
  const [wrongChar, setWrongChar] = useState(false);
  const [clearShowing, setClearShowing] = useState(false);
  const [comboAnimKey, setComboAnimKey] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [skipBacking, setSkipBacking] = useState(false);
  const charRowRef = useRef<HTMLDivElement | null>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [wrapSpaceIndicators, setWrapSpaceIndicators] = useState<boolean[]>([]);
  const countdownIntervalRef = useRef<number | null>(null);

  const [g, dispatch] = useReducer(gReducer, initialGState);

  const gameLines = useMemo(
    () => parseLrcLines(lrcContent, { skipBacking }),
    [lrcContent, skipBacking]
  );
  const isReady = !loadingLrc && !!lrcContent && !!audioUrl;

  const accuracy =
    g.totalCorrect + g.totalMiss > 0
      ? Math.round((g.totalCorrect / (g.totalCorrect + g.totalMiss)) * 100)
      : 100;

  const elapsedMs =
    phase === "playing"
      ? Math.max(1, Date.now() - gameStartTimeRef.current)
      : gameDurationMs;

  const wpm =
    elapsedMs > 0 ? Math.round(g.totalCorrect / 5 / (elapsedMs / 60000)) : 0;

  const gRef = useRef(g);
  const currentLineContent =
    g.displayedLineIdx >= 0 ? gameLines[g.displayedLineIdx]?.content ?? "" : "";

  useEffect(() => {
    charRefs.current = [];
  }, [currentLineContent]);

  useLayoutEffect(() => {
    if (!charRowRef.current) return;
    let frame = 0;
    const text = currentLineContent.toLowerCase();

    const recompute = () => {
      const nodes = charRefs.current;
      const indicators = new Array(text.length).fill(false);
      for (let i = 0; i < text.length - 1; i += 1) {
        if (text[i] !== " ") continue;
        const curr = nodes[i];
        const next = nodes[i + 1];
        if (!curr || !next) continue;
        const currRect = curr.getBoundingClientRect();
        const nextRect = next.getBoundingClientRect();
        if (nextRect.top - currRect.top > 1) {
          indicators[i] = true;
        }
      }
      setWrapSpaceIndicators(indicators);
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(recompute);
      });
    };

    schedule();

    if (document.fonts?.ready) {
      document.fonts.ready.then(schedule);
    }

    const observer = new ResizeObserver(schedule);
    observer.observe(charRowRef.current);
    window.addEventListener("resize", schedule);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [currentLineContent]);
  useEffect(() => {
    gRef.current = g;
  }, [g]);

  const phaseRef = useRef<GamePhase>("idle");
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const offsetRef = useRef(0);
  useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const mediaSession = navigator.mediaSession;
    mediaSession.setActionHandler("pause", () => {});
    return () => {
      mediaSession.setActionHandler("pause", null);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current !== null) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, []);

  const lineAnimRef = useRef({ startMs: 0, endMs: 0, startPerf: 0 });

  const timeBasedLineIdx = useMemo(() => {
    if (!gameLines.length) return -1;
    let idx = -1;
    for (let i = 0; i < gameLines.length; i++) {
      if (gameLines[i].millisecond <= currentMs) idx = i;
      else break;
    }
    return idx;
  }, [currentMs, gameLines]);

  useEffect(() => {
    const idx = g.displayedLineIdx;
    if (idx < 0 || !gameLines[idx]) {
      lineAnimRef.current = { startMs: 0, endMs: 0, startPerf: 0 };
      setLineTimingPct(0);
      setLineRemainingMs(0);
      setCurrentLineTime(-1);
      return;
    }
    const start = gameLines[idx].millisecond;
    const end = gameLines[idx + 1]?.millisecond ?? start + 5000;
    lineAnimRef.current = {
      startMs: start,
      endMs: end,
      startPerf: performance.now(),
    };
    setLineTimingPct(0);
    const currentLineTime = end - start;
    setLineRemainingMs(Math.max(0, currentLineTime));
    setCurrentLineTime(Math.max(currentLineTime, currentLineTime));
  }, [g.displayedLineIdx, gameLines]);

  useEffect(() => {
    if (phase !== "playing") return;
    let rafId = 0;
    const tick = () => {
      const { startMs, endMs, startPerf } = lineAnimRef.current;
      if (endMs <= startMs) {
        setLineTimingPct(100);
        setLineRemainingMs(0);
      } else {
        const elapsed = performance.now() - startPerf;
        const duration = endMs - startMs;
        const pct = Math.min(100, Math.max(0, (elapsed / duration) * 100));
        const remaining = Math.max(0, duration - elapsed);
        setLineTimingPct(pct);
        setLineRemainingMs(remaining);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [phase]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => {
      setCurrentMs(audio.currentTime * 1000 + offsetRef.current);
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration * 1000);
        setProgressPct((audio.currentTime / audio.duration) * 100);
      }
    };
    const onLoadedMetadata = () => {
      if (!isNaN(audio.duration)) setDuration(audio.duration * 1000);
    };
    const onEnded = () => {
      setPhase("finished");
      setGameDurationMs(Date.now() - gameStartTimeRef.current);
    };
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, []); // intentionally empty deps

  useEffect(() => {
    if (phaseRef.current !== "playing") return;
    if (timeBasedLineIdx < 0) return;
    if (timeBasedLineIdx <= lastHandledIdxRef.current) return;
    lastHandledIdxRef.current = timeBasedLineIdx;
    dispatch({
      type: "ADVANCE",
      newIdx: timeBasedLineIdx,
      prevCompleted: gRef.current.lineCompleted,
    });
  }, [timeBasedLineIdx]);

  const loadData = useCallback((data: Record<string, unknown>) => {
    if (typeof data.lrc === "string" && data.lrc) {
      setLoadingLrc(true);
      fetch(data.lrc)
        .then((r) => r.text())
        .then((t) => {
          setLrcContent(t);
          setLoadingLrc(false);
        });
    }
    if (typeof data.file1 === "string") setAudioUrl(data.file1);
    if (typeof data.offset === "number") setOffset(data.offset);
    if (typeof data.offset === "string" && data.offset.trim() !== "")
      setOffset(Number(data.offset));
    if (typeof data.title === "string") setSongTitle(data.title);
    if (typeof data.artist === "string") setSongArtist(data.artist);
    if (typeof data.skip_backing === "boolean")
      setSkipBacking(data.skip_backing);
    if (typeof data.skip_backing === "string")
      setSkipBacking(data.skip_backing === "true");
  }, []);

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) return;
    try {
      const json = atob(code);
      const data = JSON.parse(json) as Record<string, unknown>;
      loadData(data);
    } catch {}
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStart = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !lrcContent || !audioUrl) return;
    if (countdownIntervalRef.current !== null) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    dispatch({ type: "RESET" });
    lastHandledIdxRef.current = -1;
    audio.pause();
    audio.currentTime = 0;
    setPhase("countdown");
    setCountdown(5);
    setGameDurationMs(0);
    setProgressPct(0);
    setCurrentMs(0);

    const beginPlayback = () => {
      audio.currentTime = 0;
      audio.play();
      setPhase("playing");
      gameStartTimeRef.current = Date.now();
      if (gameLines[0]) {
        dispatch({
          type: "ADVANCE",
          newIdx: 0,
          prevCompleted: true,
        });
        lastHandledIdxRef.current = 0;
      }
    };

    countdownIntervalRef.current = window.setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          if (countdownIntervalRef.current !== null) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          beginPlayback();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }, [lrcContent, audioUrl, gameLines]);

  const handleRestart = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    if (countdownIntervalRef.current !== null) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setCountdown(0);
    dispatch({ type: "RESET" });
    lastHandledIdxRef.current = -1;
    setPhase("idle");
    setCurrentMs(0);
    setProgressPct(0);
  }, []);

  const handleLoadCode = useCallback(() => {
    if (!codeInput.trim()) return;
    try {
      const json = atob(codeInput.trim());
      const data = JSON.parse(json) as Record<string, unknown>;
      loadData(data);
      handleRestart();
      toast.success("Song loaded!", { theme: "dark" });
    } catch {
      toast.error("Invalid code. Please check and try again.", {
        theme: "dark",
      });
    }
  }, [codeInput, loadData, handleRestart]);

  const handleKeyPress = useCallback(
    (char: string) => {
      if (phaseRef.current !== "playing") return;
      const line = gameLines[gRef.current.displayedLineIdx];
      if (!line || gRef.current.lineCompleted) return;
      const expected = line.content[gRef.current.typedCount];
      if (expected === undefined) return;
      if (char.toLowerCase() === expected.toLowerCase()) {
        const willComplete = gRef.current.typedCount + 1 >= line.content.length;
        dispatch({ type: "CORRECT", willComplete });
        if (willComplete) {
          setClearShowing(true);
          setTimeout(() => setClearShowing(false), 700);
          setComboAnimKey((k) => k + 1);
        }
      } else {
        dispatch({ type: "WRONG" });
        setWrongChar(true);
        setTimeout(() => setWrongChar(false), 320);
      }
    },
    [gameLines],
  );

  useEffect(() => {
    if (phase !== "playing") return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const audio = audioRef.current;
        if (!audio) return;
        e.preventDefault();
        const direction = e.key === "ArrowRight" ? 1 : -1;
        const seekSeconds = 5;
        const target = audio.currentTime + direction * seekSeconds;
        const duration = Number.isFinite(audio.duration) ? audio.duration : target;
        audio.currentTime = Math.min(Math.max(0, target), duration);
        return;
      }
      if (e.key.length === 1) {
        e.preventDefault();
        handleKeyPress(e.key);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, handleKeyPress]);

  return (
    <GameRoot>
      <ToastContainer theme="dark" />
      <audio ref={audioRef} src={audioUrl || undefined} preload="auto" />
      <GameNavbar style={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            <MdLibraryMusic style={{ fontSize: 20, color: "#a78bfa" }} />
            LRC-Type
          </Link>
          <Link
            href="/"
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.6)",
              textDecoration: "none",
            }}
          >
            Karaoke
          </Link>
          <Link
            href="/create"
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.6)",
              textDecoration: "none",
            }}
          >
            Create
          </Link>
        </div>
      </GameNavbar>

      <GameContent style={{ position: "relative" }}>
        {phase === "idle" && (
          <StartOverlay>
            <StartCard>
              {!isReady ? (
                <>
                  <SongTitleText>LRC-Type</SongTitleText>
                  <SongArtistText>Enter a game code to begin!</SongArtistText>
                </>
              ) : (
                <>
                  <SongTitleText>
                    {loadingLrc ? "Loading..." : songTitle}
                  </SongTitleText>
                  <SongArtistText>{songArtist}</SongArtistText>
                </>
              )}

              <StartBtn
                onClick={handleStart}
                disabled={!isReady}
                suppressHydrationWarning
              >
                {loadingLrc ? "Loading song..." : "▶  Start Game"}
              </StartBtn>
              <CodeSection>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.3)",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  Load a chart
                </div>
                <CodeInputRow>
                  <CodeInputField
                    placeholder="Enter a MoekyunKaraoke or LRC-Type code..."
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLoadCode()}
                  />
                  <CodeLoadBtn onClick={handleLoadCode}>Load</CodeLoadBtn>
                </CodeInputRow>
              </CodeSection>
            </StartCard>
          </StartOverlay>
        )}

        {phase === "countdown" && (
          <StartOverlay>
            <StartCard>
              <SongTitleText>Get Ready</SongTitleText>
              <CountdownNumber>{countdown}</CountdownNumber>
            </StartCard>
          </StartOverlay>
        )}

        {phase === "finished" && (
          <ResultsOverlay>
            <ResultsCard>
              <ResultsTitle>Results {songTitle}</ResultsTitle>
              <BigScore>{g.score.toLocaleString()}</BigScore>
              <StatsGrid>
                <StatBlock>
                  <StatValue>{accuracy}%</StatValue>
                  <StatLabel>Accuracy</StatLabel>
                </StatBlock>
                <StatBlock>
                  <StatValue>x{g.maxCombo}</StatValue>
                  <StatLabel>Max Combo</StatLabel>
                </StatBlock>
                <StatBlock>
                  <StatValue>{wpm}</StatValue>
                  <StatLabel>WPM</StatLabel>
                </StatBlock>
                <StatBlock>
                  <StatValue>{g.totalMiss}</StatValue>
                  <StatLabel>Missed Chars</StatLabel>
                </StatBlock>
              </StatsGrid>
              <ActionRow>
                <PlayAgainBtn onClick={handleRestart}>Play Again</PlayAgainBtn>
                <HomeBtn onClick={() => router.push("/")}>Home</HomeBtn>
              </ActionRow>
            </ResultsCard>
          </ResultsOverlay>
        )}

        <HUD>
          <HudStat>
            <HudValue>{g.score.toLocaleString()}</HudValue>
            <HudLabel>Score</HudLabel>
          </HudStat>
          <HudStat>
            <ComboValue
              $animate={comboAnimKey > 0}
              key={`combo-${comboAnimKey}`}
            >
              x{g.combo}
            </ComboValue>
            <HudLabel>Combo</HudLabel>
          </HudStat>
          <HudStat>
            <HudValue>{accuracy}%</HudValue>
            <HudLabel>Accuracy</HudLabel>
          </HudStat>
          <HudStat>
            <HudValue>{wpm}</HudValue>
            <HudLabel>WPM</HudLabel>
          </HudStat>
          <HudStat>
            <HudValue>{g.totalMiss}</HudValue>
            <HudLabel>Misses</HudLabel>
          </HudStat>
        </HUD>

        <GameArea>
          {phase === "playing" &&
            g.displayedLineIdx < 0 &&
            gameLines.length > 0 && <GetReadyText>Get ready...</GetReadyText>}
          {g.displayedLineIdx >= 0 && gameLines[g.displayedLineIdx] && (
            <>
              <UpcomingWrap>
                <UpcomingLabel>Next</UpcomingLabel>
                <UpcomingText>
                  {gameLines[g.displayedLineIdx + 1]?.content ?? ""}
                </UpcomingText>
              </UpcomingWrap>
              <CurrentWrap style={{ position: "relative" }}>
                <LineTimingRow>
                  <LineTimingMeta>
                    Time left:{" "}
                    <LineTimingValue>
                      {Math.max(0, lineRemainingMs / 1000).toFixed(1)}s
                    </LineTimingValue>
                  </LineTimingMeta>
                  <LineTimingMeta>
                    Estimated CPS:{" "}
                    <LineTimingValue>
                      {calculateCPSNeeded(
                        gameLines[g.displayedLineIdx].content,
                        currentLineTime / 1000
                      ).toFixed(1)}
                    </LineTimingValue>
                  </LineTimingMeta>
                </LineTimingRow>
                <LineTimingBar>
                  <LineTimingFill $pct={lineTimingPct} />
                </LineTimingBar>
                <CharRow ref={charRowRef}>
                  {(() => {
                    const rawText = gameLines[g.displayedLineIdx].content;
                    const text = rawText.toLowerCase();
                    const tokens = text.split(/(\s+)/).filter(Boolean);
                    let renderIndex = 0;
                    return tokens.flatMap((token, tokenIdx) => {
                      if (/^\s+$/.test(token)) {
                        return token.split("").map((ch, spaceIdx) => {
                          let state: "typed" | "active" | "pending" | "wrong";
                          if (renderIndex < g.typedCount) state = "typed";
                          else if (renderIndex === g.typedCount)
                            state = wrongChar ? "wrong" : "active";
                          else state = "pending";
                          const charIndex = renderIndex;
                          const showIndicator =
                            ch === " " &&
                            wrapSpaceIndicators[charIndex] &&
                            state !== "typed";
                          const displayChar =
                            ch === " "
                              ? showIndicator
                                ? "␣"
                                : "\u00A0"
                              : ch;
                          const element = (
                            <CharBox
                              key={`space-${tokenIdx}-${spaceIdx}`}
                              $state={state}
                              ref={(el) => {
                                charRefs.current[charIndex] = el;
                              }}
                            >
                              {displayChar}
                            </CharBox>
                          );
                          renderIndex += 1;
                          return element;
                        });
                      }

                      const wordChars = token.split("").map((ch, charIdx) => {
                        let state: "typed" | "active" | "pending" | "wrong";
                        if (renderIndex < g.typedCount) state = "typed";
                        else if (renderIndex === g.typedCount)
                          state = wrongChar ? "wrong" : "active";
                        else state = "pending";
                        const charIndex = renderIndex;
                        const element = (
                          <CharBox
                            key={`char-${tokenIdx}-${charIdx}`}
                            $state={state}
                            ref={(el) => {
                              charRefs.current[charIndex] = el;
                            }}
                          >
                            {ch}
                          </CharBox>
                        );
                        renderIndex += 1;
                        return element;
                      });

                      return (
                        <WordWrap key={`word-${tokenIdx}`}>
                          {wordChars}
                        </WordWrap>
                      );
                    });
                  })()}
                </CharRow>
                {clearShowing && <ClearToast>CLEAR!</ClearToast>}
                <CompletedLineFade>
                  {g.lineCompleted ? "Cleared - waiting for next line..." : gameLines[g.displayedLineIdx].content}
                </CompletedLineFade>
              </CurrentWrap>
            </>
          )}
          {phase === "idle" && (
            <GetReadyText style={{ opacity: 0.3 }}>
              Start the game to begin typing
            </GetReadyText>
          )}
        </GameArea>

        <GameFooter>
          <ControlBtn onClick={handleRestart} title="Restart">
            <FaRedo />
          </ControlBtn>
          <ProgressWrap>
            <ProgressFill $pct={progressPct} />
          </ProgressWrap>
          <TimeText>
            {formatTime(Math.max(0, currentMs))} / {formatTime(duration)}
          </TimeText>
        </GameFooter>
      </GameContent>
    </GameRoot>
  );
}

export default function GamePage() {
  return (
    <Suspense
      fallback={
        <GameRoot>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Loading...
          </div>
        </GameRoot>
      }
    >
      <GameInner />
    </Suspense>
  );
}
