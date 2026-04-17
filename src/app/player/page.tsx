"use client";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  Suspense,
} from "react";
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
import {
  Root,
  PanesContainer,
  LyricsPane,
  ResizeHandle,
  VideoPane,
  VideoElement,
  CaptionsOverlay,
  ControlBar,
  PlayButton,
  ScrubBar,
  ControlPanel,
  PanelRow,
  PanelDivider,
  PanelLabel,
  PanelButton,
  HiddenFileInput,
  PanelFieldLabel,
  PanelNumberInput,
  PanelRangeInput,
  PanelCheckboxLabel,
  ColorSwatch,
  PlaceholderWrapper,
  PlaceholderHeading,
  PlaceholderBody,
  CodeInputWrapper,
  CodeInput,
  LoadButton,
  StyledLink,
} from "./page.styles";

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
  const [offsetInput, setOffsetInput] = useState<string>("0");
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

  useEffect(() => {
    setOffsetInput(String(offset));
  }, [offset]);

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
                value={offsetInput}
                onChange={(e) => {
                  const next = e.target.value;
                  if (next === "" || next === "-" || next === "+") {
                    setOffsetInput(next);
                    return;
                  }
                  const parsed = Number(next);
                  if (!Number.isNaN(parsed)) {
                    setOffset(parsed);
                    setOffsetInput(next);
                  }
                }}
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
