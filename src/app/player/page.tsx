"use client";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  Suspense,
} from "react";
import styled, { css } from "styled-components";
import LRCPlayer from "../components/LRCPlayer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaPlay,
  FaPause,
  FaFileAlt,
  FaVideo,
  FaClosedCaptioning,
  FaHeadphones,
  FaSyncAlt,
} from "react-icons/fa";
import { CaptionsRenderer } from "react-srv3";
import { useSearchParams } from "next/navigation";

const Root = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  overflow: hidden;
`;

const PanesContainer = styled.div`
  display: flex;
  flex: 1;
  height: 100vh;
  overflow: hidden;
  user-select: none;
`;

const LyricsPane = styled.div<{ $width: number }>`
  width: ${({ $width }) => $width}%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #ffffff;
`;

const ResizeHandle = styled.div`
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

const VideoPane = styled.div<{ $dragOver: boolean }>`
  flex: 1;
  position: relative;
  background-color: ${({ $dragOver }) => ($dragOver ? "#dbeeff" : "#ffffff")};
  transition: background-color 0.15s ease;
  overflow: hidden;
`;

const VideoElement = styled.video`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
`;

const CaptionsOverlay = styled.div`
  position: absolute;
  inset: 0;
  width: 90%;
  height: 90%;
  margin: auto;
  cursor: pointer;
`;

const ControlBar = styled.div`
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

const PlayButton = styled.button`
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

const ScrubBar = styled.input`
  flex: 1;
  height: 4px;
  margin: 0 12px 0 4px;
  cursor: pointer;
  accent-color: #fff;
`;

const ControlPanel = styled.div<{ $visible: boolean }>`
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

const PanelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
`;

const PanelDivider = styled.div`
  width: 1px;
  height: 20px;
  background-color: rgba(255, 255, 255, 0.15);
  flex-shrink: 0;
  margin: 0 2px;
`;

const panelItemStyles = css`
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

const PanelLabel = styled.label`
  ${panelItemStyles}
`;

const PanelButton = styled.button`
  ${panelItemStyles}
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const PanelFieldLabel = styled.span`
  color: rgba(255, 255, 255, 0.45);
  font-size: 11px;
  font-family: Arial, sans-serif;
  white-space: nowrap;
`;

const PanelNumberInput = styled.input`
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

  /* Remove number input arrows in Firefox */
  -moz-appearance: textfield;

  /* Remove number input arrows in Chrome/Safari */
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    opacity: 0.4;
  }
`;

const PanelRangeInput = styled.input`
  width: 90px;
  accent-color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  vertical-align: middle;
`;

const PanelCheckboxLabel = styled.label`
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

const ColorSwatch = styled.input`
  width: 24px;
  height: 24px;
  padding: 1px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  cursor: pointer;
  background: none;
  vertical-align: middle;
`;

const PlaceholderWrapper = styled.div`
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

const PlaceholderHeading = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 12px;
`;

const PlaceholderBody = styled.p`
  font-size: 18px;
  line-height: 1.6;
  margin: 0 0 20px;
`;

const CodeInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 420px;
  font-family: Arial, sans-serif;
  font-size: 14px;
`;

const CodeInput = styled.input`
  width: 100%;
  font-size: 15px;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
`;

const LoadButton = styled.button`
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

const StyledLink = styled.a`
  font-family: Arial, sans-serif;
  text-decoration: none;
  color: #0066cc;

  &:hover {
    text-decoration: underline;
  }
`;

function KaraokePage() {
  const [currentMillisecond, setCurrentMillisecond] = useState(0);
  const [lrcContent, setLrcContent] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [supplementAudioUrl, setSupplementAudioUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [scrubValue, setScrubValue] = useState<number>(0);
  const [showPanel, setShowPanel] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const supplementAudioRef = useRef<HTMLAudioElement>(null);
  const [captionsText, setCaptionsText] = useState<string>("");
  const [offset, setOffset] = useState<number>(0);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>("No video selected");
  const [balance, setBalance] = useState<number>(0);
  const [animate, setAnimate] = useState<boolean>(true);
  const [lrcColor, setLrcColor] = useState<string>("#C8BEBE");
  const [fontColor, setFontColor] = useState<string>("#000000");
  const [supplementAudioOffset, setSupplementAudioOffset] = useState<number>(0);
  const [base64Input, setBase64Input] = useState<string>("");

  // Resizable panes
  const [leftWidth, setLeftWidth] = useState<number>(50);
  const isResizing = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    const savedLrcColor = localStorage.getItem("lrcColor");
    const savedFontColor = localStorage.getItem("fontColor");
    if (savedLrcColor) setLrcColor(savedLrcColor);
    if (savedFontColor) setFontColor(savedFontColor);
  }, []);

  useEffect(() => {
    localStorage.setItem("lrcColor", lrcColor);
  }, [lrcColor]);

  useEffect(() => {
    localStorage.setItem("fontColor", fontColor);
  }, [fontColor]);

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      isResizing.current = true;
      document.body.style.cursor = "col-resize";
    },
    [],
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
      setLeftWidth(Math.min(Math.max(newWidth, 15), 85));
    };

    const onMouseUp = () => {
      if (!isResizing.current) return;
      isResizing.current = false;
      document.body.style.cursor = "";
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const handleLrcFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLrcContent(e.target?.result as string);
        if (videoUrl) setShowPanel(false);
      };
      reader.readAsText(file);
      toast.success("LRC file loaded successfully", { autoClose: 2000 });
    }
  };

  const handleVideoFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setCurrentMillisecond(0);
      setScrubValue(0);
      setIsPlaying(false);
      toast.success("Video file loaded successfully", { autoClose: 2000 });
    }
  };

  const handleSrvFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCaptionsText(e.target?.result as string);
      reader.readAsText(file);
      toast.success("SRV file loaded successfully", { autoClose: 2000 });
    }
  };

  const handleSupplementAudioFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    const video = videoRef.current;
    if (file) {
      const url = URL.createObjectURL(file);
      setSupplementAudioUrl(url);
      setCurrentMillisecond(0);
      setScrubValue(0);
      setIsPlaying(false);
      if (video) video.pause();
      toast.success("Supplemental audio file loaded successfully", {
        autoClose: 2000,
      });
    }
  };

  const handleOnClickDemoButton = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setOffset(-1550);
    fetch(
      "https://utfs.io/f/e2e18ea7-9841-437b-9ca3-5723355bd41a-rlck46.lrc",
    ).then((response) => {
      response.text().then((text) => setLrcContent(text));
    });
    setVideoUrl(
      "https://utfs.io/f/84f5dfa6-821d-407f-a16d-a685b09c11d9-7xx2h4.webm",
    );
    toast.success("Loading Demo: Mr.Raindrop - Amplified");
    toast.success("Applied offset of -1550ms");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") handlePlayPause();
      if (e.code === "ArrowRight") {
        if (document.activeElement?.tagName === "INPUT") return;
        const video = videoRef.current;
        if (video) video.currentTime += 5;
      }
      if (e.code === "ArrowLeft") {
        if (document.activeElement?.tagName === "INPUT") return;
        const video = videoRef.current;
        if (video) video.currentTime -= 5;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const sync = () => {
      setCurrentMillisecond(video.currentTime * 1000 + offset);
      setScrubValue((video.currentTime / video.duration) * 100);
    };
    video.addEventListener("timeupdate", sync);
    return () => video.removeEventListener("timeupdate", sync);
  });

  useEffect(() => {
    const video = videoRef.current;
    const audio = supplementAudioRef.current;
    if (!video || !audio) return;
    if (balance < 0) {
      video.volume = 1 + balance;
      audio.volume = 1;
    } else {
      video.volume = 1;
      audio.volume = 1 - balance;
    }
  }, [balance]);

  useEffect(() => {
    const video = videoRef.current;
    const audio = supplementAudioRef.current;
    if (!video || !audio) return;
    audio.currentTime = video.currentTime + supplementAudioOffset / 1000;
  }, [supplementAudioOffset]);

  useEffect(() => {
    if (videoUrl && lrcContent) setStatusText("Ready to play!");
    else if (videoUrl) setStatusText("No lyrics file selected");
    else if (lrcContent) setStatusText("No video file selected");
    else setStatusText("No video or lyrics file selected");
  }, [videoUrl, lrcContent]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      if (supplementAudioUrl) supplementAudioRef.current?.play();
      setIsPlaying(true);
    } else {
      video.pause();
      if (supplementAudioUrl) supplementAudioRef.current?.pause();
      setIsPlaying(false);
    }
  };

  const handleScrub = (event: React.ChangeEvent<HTMLInputElement>) => {
    const time =
      (parseFloat(event.target.value) / 100) * videoRef.current!.duration;
    videoRef.current!.currentTime = time;
    if (supplementAudioRef.current) {
      supplementAudioRef.current.currentTime =
        time + supplementAudioOffset / 1000;
    }
    setScrubValue(parseFloat(event.target.value));
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    supplementAudioRef.current?.pause();
  };

  const syncSupplementAudioWithVideo = () => {
    const video = videoRef.current;
    const audio = supplementAudioRef.current;
    if (!video || !audio) return;
    audio.currentTime = video.currentTime + supplementAudioOffset / 1000;
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    setDragOver(true);
    event.preventDefault();
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    setDragOver(true);
    event.preventDefault();
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    setDragOver(false);
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    if (file.name.endsWith(".lrc")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLrcContent(e.target?.result as string);
        if (videoUrl) setShowPanel(false);
      };
      reader.readAsText(file);
      toast.success("LRC file loaded successfully", { autoClose: 2000 });
    } else if (file.name.endsWith(".srv3")) {
      const reader = new FileReader();
      reader.onload = (e) => setCaptionsText(e.target?.result as string);
      reader.readAsText(file);
      toast.success("SRV file loaded successfully", { autoClose: 2000 });
    } else if (file.type.startsWith("video") || file.type.startsWith("audio")) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setCurrentMillisecond(0);
      setScrubValue(0);
      setIsPlaying(false);
      toast.success("Video/Audio file loaded successfully", {
        autoClose: 2000,
      });
    } else {
      toast.error("Unsupported file type", { autoClose: 2000 });
    }
  };

  function processData(data: any) {
    if (data.lrc) {
      fetch(data.lrc)
        .then((r) => r.text())
        .then((text) => {
          setLrcContent(text);
          if (videoUrl) setShowPanel(false);
          toast.success("LRC file loaded successfully", { autoClose: 2000 });
        })
        .catch(() =>
          toast.error("Failed to load LRC file", { autoClose: 2000 }),
        );
    }
    if (data.srv3) {
      fetch(data.srv3)
        .then((r) => r.text())
        .then((text) => {
          setCaptionsText(text);
          toast.success("SRV file loaded successfully", { autoClose: 2000 });
        })
        .catch(() =>
          toast.error("Failed to load SRV3 file", { autoClose: 2000 }),
        );
    }
    if (data.file1) {
      setVideoUrl(data.file1);
      setCurrentMillisecond(0);
      setScrubValue(0);
      setIsPlaying(false);
      toast.success("Video file loaded successfully", { autoClose: 2000 });
    }
    if (data.file2) {
      setSupplementAudioUrl(data.file2);
      setCurrentMillisecond(0);
      setScrubValue(0);
      setIsPlaying(false);
      toast.success("Supplemental audio file loaded successfully", {
        autoClose: 2000,
      });
    }
    if (data.offset) setOffset(Number(data.offset));
    if (data.offset2) setSupplementAudioOffset(Number(data.offset2));
  }

  const handleKaraokeb64Code = () => {
    try {
      const data = JSON.parse(atob(base64Input));
      processData(data);
      toast.success("Data loaded successfully", { autoClose: 2000 });
    } catch {
      toast.error("Invalid base64 or JSON data", { autoClose: 2000 });
    }
  };

  useEffect(() => {
    const dataParam = searchParams.get("code");
    if (dataParam) {
      try {
        const data = JSON.parse(atob(dataParam));
        processData(data);
        toast.success("Data loaded from query parameter", { autoClose: 2000 });
      } catch {
        toast.error("Invalid data in query parameter", { autoClose: 2000 });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <Root>
      <ToastContainer />

      <PanesContainer ref={containerRef}>
        <LyricsPane $width={leftWidth}>
          <LRCPlayer
            lrc={lrcContent}
            currentMillisecond={currentMillisecond}
            animate={animate}
            lrcColor={lrcColor}
            fontColor={fontColor}
          />
        </LyricsPane>

        <ResizeHandle onMouseDown={handleResizeMouseDown} />

        <VideoPane
          $dragOver={dragOver}
          onMouseEnter={() => setShowPanel(true)}
          onMouseLeave={() => setShowPanel(false)}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {videoUrl ? (
            <>
              <VideoElement
                ref={videoRef}
                src={videoUrl}
                onEnded={handleVideoEnded}
              />
              <audio
                ref={supplementAudioRef}
                src={supplementAudioUrl || undefined}
                style={{ display: "none" }}
              />
              <CaptionsOverlay onClick={handlePlayPause}>
                <CaptionsRenderer
                  srv3={captionsText}
                  currentTime={currentMillisecond / 1000}
                />
              </CaptionsOverlay>

              <ControlBar>
                <PlayButton
                  onClick={handlePlayPause}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </PlayButton>
                <ScrubBar
                  type="range"
                  min="0"
                  max="100"
                  value={scrubValue}
                  onChange={handleScrub}
                />
              </ControlBar>
            </>
          ) : (
            <PlaceholderWrapper>
              <PlaceholderHeading>{statusText}</PlaceholderHeading>
              <PlaceholderBody>
                Please select the video and lrc (lyrics) file
                <br />
                (Drag and Drop them here, or use the menus below!)
                <br />
                <br />
                Chrome is recommended!
                <br />
                <StyledLink href="/about">About</StyledLink>
                {" · "}
                <StyledLink href="" onClick={handleOnClickDemoButton}>
                  Demo
                </StyledLink>
              </PlaceholderBody>

              <CodeInputWrapper>
                <label htmlFor="base64Input">
                  or enter a MoekyunKaraoke code:
                </label>
                <CodeInput
                  id="base64Input"
                  type="text"
                  value={base64Input}
                  onChange={(e) => setBase64Input(e.target.value)}
                />
                <LoadButton onClick={handleKaraokeb64Code}>
                  Load Data
                </LoadButton>
              </CodeInputWrapper>
            </PlaceholderWrapper>
          )}

          <ControlPanel $visible={showPanel}>
            <PanelRow>
              <PanelLabel htmlFor="lrcUpload">
                <FaFileAlt /> LRC
              </PanelLabel>
              <HiddenFileInput
                id="lrcUpload"
                type="file"
                accept=".lrc"
                onChange={handleLrcFileChange}
              />

              <PanelLabel htmlFor="videoUpload">
                <FaVideo /> Media
              </PanelLabel>
              <HiddenFileInput
                id="videoUpload"
                type="file"
                accept="video/*,audio/*"
                onChange={handleVideoFileChange}
              />

              <PanelLabel htmlFor="srvUpload">
                <FaClosedCaptioning /> SRV
              </PanelLabel>
              <HiddenFileInput
                id="srvUpload"
                type="file"
                accept=".srv3"
                onChange={handleSrvFileChange}
              />

              <PanelLabel htmlFor="supplementAudioUpload">
                <FaHeadphones /> Audio #2
              </PanelLabel>
              <HiddenFileInput
                id="supplementAudioUpload"
                type="file"
                accept="audio/*"
                onChange={handleSupplementAudioFileChange}
              />

              <PanelDivider />

              <PanelButton onClick={syncSupplementAudioWithVideo}>
                <FaSyncAlt /> Sync Audio
              </PanelButton>
            </PanelRow>

            <PanelRow>
              <PanelFieldLabel>Balance</PanelFieldLabel>
              <PanelRangeInput
                type="range"
                min="-1"
                max="1"
                step="0.01"
                value={balance}
                onChange={(e) => setBalance(Number(e.target.value))}
              />

              <PanelDivider />

              <PanelFieldLabel>Offset</PanelFieldLabel>
              <PanelNumberInput
                type="number"
                value={offset}
                onChange={(e) => setOffset(Number(e.target.value))}
                step="25"
              />

              <PanelDivider />

              <PanelFieldLabel>Audio 2 Offset</PanelFieldLabel>
              <PanelNumberInput
                type="number"
                value={supplementAudioOffset}
                onChange={(e) =>
                  setSupplementAudioOffset(Number(e.target.value))
                }
                step="25"
              />

              <PanelDivider />

              <PanelCheckboxLabel>
                <input
                  type="checkbox"
                  checked={animate}
                  onChange={(e) => setAnimate(e.target.checked)}
                />
                Animate
              </PanelCheckboxLabel>

              <PanelDivider />

              <PanelFieldLabel>Colors</PanelFieldLabel>
              <ColorSwatch
                type="color"
                value={lrcColor}
                onChange={(e) => setLrcColor(e.target.value)}
                title="Highlight colour"
              />
              <ColorSwatch
                type="color"
                value={fontColor}
                onChange={(e) => setFontColor(e.target.value)}
                title="Font colour"
              />
              <PanelButton
                onClick={() => {
                  setLrcColor("#C8BEBE");
                  setFontColor("#000000");
                }}
              >
                Reset
              </PanelButton>
            </PanelRow>
          </ControlPanel>
        </VideoPane>
      </PanesContainer>
    </Root>
  );
}

export default function Page() {
  return (
    <Suspense>
      <KaraokePage />
    </Suspense>
  );
}
