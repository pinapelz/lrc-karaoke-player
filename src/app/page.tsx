"use client";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import LRCPlayer from "./components/LRCPlayer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlay, FaPause } from "react-icons/fa";
import { CaptionsRenderer } from "react-srv3";
import { useSearchParams } from "next/navigation";

// Styled components
const Root = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;
`;

const FileInputContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 10px;
  border-radius: 5px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FileInput = styled.input`
  padding: 10px 15px;
  border-radius: 5px;
  border: 1px solid #ddd;
  justify-content: center;
  cursor: pointer;
  display: none;
  font-family: Arial;
  &:hover,
  &:focus {
    background-color: #eaeaea;
    outline: none;
  }
`;

const FileInputLabel = styled.label`
  padding: 10px 15px;
  border-radius: 5px;
  border: 1px solid #ddd;
  cursor: pointer;
  &:hover,
  &:focus {
    background-color: #eaeaea;
    outline: none;
  }
`;

const ControlBarButton = styled.button`
  padding: 10px 15px;
  border-radius: 5px;
  border: 1px solid #ddd;
  align-items: center;
  cursor: pointer;
  &:hover,
  &:focus {
    background-color: #eaeaea;
    outline: none;
  }
`;

const StyledLink = styled.a`
  font-size: 20px;
  font-family: Arial;
  text-decoration: none;
  color: black;
  &:hover {
    text-decoration: underline;
  }
`;

const LRCPlayerWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
  scroll-behavior: smooth;
  background-color: #ffffff;
`;

const StyledButton = styled.button`
  padding: 10px 15px;
  border-radius: 5px;
  border: 1px solid #ddd;
  cursor: pointer;
  &:hover,
  &:focus {
    background-color: #eaeaea;
    outline: none;
  }
`;

function KaraokePage() {
  const [currentMillisecond, setCurrentMillisecond] = useState(0);
  const [lrcContent, setLrcContent] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [supplementAudioUrl, setSupplementAudioUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showVolume, setShowVolume] = useState<boolean>(false);
  const [scrubValue, setScrubValue] = useState<number>(0);
  const [showFileInputs, setShowFileInputs] = useState<boolean>(true);
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

  // Functions for handling file input changes
  const handleLrcFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLrcContent(e.target?.result as string);
        if (videoUrl) setShowFileInputs(false);
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
      toast.success("Video file loaded successfully", {
        autoClose: 2000,
      });
    }
  };

  const handleSrvFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCaptionsText(e.target?.result as string);
      };
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
      toast.success("Supplemental Audio file loaded successfully", {
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
    ).then(function (response) {
      response.text().then(function (responseString) {
        setLrcContent(responseString);
      });
    });
    setVideoUrl(
      "https://utfs.io/f/84f5dfa6-821d-407f-a16d-a685b09c11d9-7xx2h4.webm",
    );
    toast.success("Loading Demo: Mr.Raindrop - Amplified");
    toast.success("Applied offset of -1550ms");
  };

  // Side effects for keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        handlePlayPause();
      }
      if (e.code === "ArrowRight") {
        if (document.activeElement?.tagName === "INPUT") return;
        const video = videoRef.current;
        if (!video) return;
        video.currentTime += 5;
      }
      if (e.code === "ArrowLeft") {
        if (document.activeElement?.tagName === "INPUT") return;
        const video = videoRef.current;
        if (!video) return;
        video.currentTime -= 5;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  // Side effects for the video itself
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const syncLrcWithVideo = () => {
      setCurrentMillisecond(video.currentTime * 1000 + offset); // updates lrc position
      setScrubValue((video.currentTime / video.duration) * 100); // update playhead position
    };
    video.addEventListener("timeupdate", syncLrcWithVideo);

    return () => {
      video.removeEventListener("timeupdate", syncLrcWithVideo);
    };
  });

  // Side effect for volume controls
  useEffect(() => {
    const video = videoRef.current;
    const audio = supplementAudioRef.current;
    if (!video || !audio) return;

    if (balance < 0) {
      video.volume = 1 + balance;
    } else {
      video.volume = 1;
      audio.volume = 1 - balance;
    }
  }, [balance]);

  // Side effect for audio
  useEffect(() => {
    const video = videoRef.current;
    const audio = supplementAudioRef.current;
    if (!video || !audio) return;
    if (supplementAudioOffset === null || supplementAudioOffset == null) return;
    audio.currentTime = video.currentTime + supplementAudioOffset / 1000;
  }, [supplementAudioOffset]);

  // General video control functionality

  const handleVolumeToggle = () => {
    setShowVolume(!showVolume);
  };

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

  // Status text styling depending on whats loaded. Not all visible
  useEffect(() => {
    if (videoUrl && lrcContent) {
      setStatusText("Ready to play!");
    } else if (videoUrl) {
      setStatusText("No lyrics file selected");
    } else if (lrcContent) {
      setStatusText("No video file selected");
    } else {
      setStatusText("No video or lyrics file selected");
    }
  }, [videoUrl, lrcContent]);

  //  Video Control Bar functionality
  const handleScrub = (event: React.ChangeEvent<HTMLInputElement>) => {
    const time =
      (parseFloat(event.target.value) / 100) * videoRef.current!.duration;
    videoRef.current!.currentTime = time;
    if (supplementAudioOffset === null || supplementAudioOffset == null) {
      supplementAudioRef.current!.currentTime = time;
    } else {
      supplementAudioRef.current!.currentTime =
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
    if (supplementAudioOffset === null || supplementAudioOffset == null) return;
    audio.currentTime = video.currentTime + supplementAudioOffset / 1000;
  };

  // Handling drag and drop files
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
    if (file.name.endsWith(".lrc")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLrcContent(e.target?.result as string);
        if (videoUrl) setShowFileInputs(false);
      };
      reader.readAsText(file);
      toast.success("LRC file loaded successfully", { autoClose: 2000 });
    } else if (file.name.endsWith(".srv3")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCaptionsText(e.target?.result as string);
      };
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
        .then((response) => response.text())
        .then((text) => {
          setLrcContent(text);
          if (videoUrl) setShowFileInputs(false);
          toast.success("LRC file loaded successfully", {
            autoClose: 2000,
          });
        })
        .catch((error) => {
          toast.error("Failed to load LRC file", { autoClose: 2000 });
        });
    }
    if (data.srv3) {
      fetch(data.srv3)
        .then((response) => response.text())
        .then((text) => {
          setCaptionsText(text);
          toast.success("SRV file loaded successfully", {
            autoClose: 2000,
          });
        })
        .catch((error) => {
          toast.error("Failed to load SRV3 file", {
            autoClose: 2000,
          });
        });
    }
    if (data.file1) {
      setVideoUrl(data.file1);
      setCurrentMillisecond(0);
      setScrubValue(0);
      setIsPlaying(false);
      toast.success("Video file loaded successfully", {
        autoClose: 2000,
      });
    }
    if (data.file2) {
      setSupplementAudioUrl(data.file2);
      setCurrentMillisecond(0);
      setScrubValue(0);
      setIsPlaying(false);
      toast.success("Supplemental Audio file loaded successfully", {
        autoClose: 2000,
      });
    }
    if (data.offset1) {
      setOffset(Number(data.offset));
    }
    if (data.offset2) {
      setOffset(Number(data.offset2));
    }
  }

  // Handle base64 input from user
  const handleKaraokeb64Code = () => {
    try {
      const decodedString = atob(base64Input);
      console.log(decodedString);
      const data = JSON.parse(decodedString);
      processData(data);
      toast.success("Data loaded successfully", { autoClose: 2000 });
    } catch (e) {
      toast.error("Invalid base64 or JSON data", { autoClose: 2000 });
    }
  };

  // Check for query parameter
  useEffect(() => {
    const dataParam = searchParams.get("code");
    if (dataParam) {
      try {
        const decodedString = atob(dataParam);
        const data = JSON.parse(decodedString);
        processData(data);
        toast.success("Data loaded from query parameter", {
          autoClose: 2000,
        });
      } catch (e) {
        toast.error("Invalid data in query parameter", {
          autoClose: 2000,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <Root>
      <ToastContainer />
      {/*LRC viewer*/}
      <div style={{ display: "flex", width: "100%", height: "100vh" }}>
        <LRCPlayerWrapper>
          <LRCPlayer
            lrc={lrcContent}
            currentMillisecond={currentMillisecond}
            animate={animate}
            lrcColor={lrcColor}
            fontColor={fontColor}
          />
        </LRCPlayerWrapper>

        {/* Ternary operation for if videoUrl has been set */}
        <div
          style={{
            flex: 1,
            position: "relative",
            backgroundColor: dragOver ? "lightblue" : "white",
          }}
          onMouseEnter={() => setShowFileInputs(true)}
          onMouseLeave={() => setShowFileInputs(false)}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {videoUrl ? (
            <>
              <video
                ref={videoRef}
                src={videoUrl}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                }}
                onEnded={handleVideoEnded}
              />
              <audio
                ref={supplementAudioRef}
                src={supplementAudioUrl}
                style={{ display: "none" }}
              />
              <div
                style={{
                  width: "90%",
                  height: "90%",
                  margin: "auto",
                }}
                onClick={() => handlePlayPause()}
              >
                <CaptionsRenderer
                  srv3={captionsText}
                  currentTime={currentMillisecond / 1000}
                />
              </div>
              {/*Video control bar*/}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  height: "50px",
                }}
              >
                <button
                  onClick={handlePlayPause}
                  style={{
                    width: "50px",
                    height: "50px",
                    padding: "10px",
                    border: "none",
                    borderRadius: "5px",
                    backgroundColor: "white",
                    color: "black",
                  }}
                >
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={scrubValue}
                  style={{
                    flex: 1,
                    height: "50px",
                    width: "100%",
                  }}
                  onInput={handleScrub}
                />
              </div>
            </>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <h1
                style={{
                  fontFamily: "Arial",
                  fontWeight: "bold",
                  fontSize: "32px",
                }}
              >
                {statusText}
              </h1>
              {/* Show a placeholder while no video selected */}
              <p
                style={{
                  fontSize: "30px",
                  textAlign: "center",
                  fontFamily: "Arial",
                }}
              >
                Please select the video and lrc (lyrics) file <br />
                (Drag and Drop them here, or use the menus below!) <br />
                <br />
                Chrome is recommended!
                <br />
                <StyledLink href="/about"> About </StyledLink>
                <StyledLink href="" onClick={handleOnClickDemoButton}>
                  {" "}
                  Demo{" "}
                </StyledLink>
              </p>
              <div>
                <label htmlFor="base64Input">
                  or enter a MoekyunKaraoke code:
                </label>
                <input
                  id="base64Input"
                  type="text"
                  value={base64Input}
                  onChange={(e) => setBase64Input(e.target.value)}
                  style={{ width: "100%", fontSize: "16px" }}
                />
                <StyledButton onClick={handleKaraokeb64Code}>
                  Load Data
                </StyledButton>
              </div>
            </div>
          )}

          {/* File inputs, shown on hover over video div region*/}
          {showFileInputs && (
            <FileInputContainer
              style={{
                position: "absolute",
                bottom: "30px",
                left: 0,
              }}
            >
              <FileInputLabel htmlFor="lrcUpload" style={{ cursor: "pointer" }}>
                LRC
              </FileInputLabel>
              <FileInput
                id="lrcUpload"
                type="file"
                accept=".lrc"
                onChange={handleLrcFileChange}
              />
              <FileInputLabel
                htmlFor="videoUpload"
                style={{ cursor: "pointer" }}
              >
                Media
              </FileInputLabel>
              <FileInput
                id="videoUpload"
                type="file"
                accept="video/*,audio/*"
                onChange={handleVideoFileChange}
              />
              <FileInputLabel htmlFor="srvUpload" style={{ cursor: "pointer" }}>
                SRV
              </FileInputLabel>
              <FileInput
                id="srvUpload"
                type="file"
                accept=".srv3"
                onChange={handleSrvFileChange}
              />
              <FileInputLabel
                htmlFor="supplementAudioUpload"
                style={{ cursor: "pointer" }}
              >
                Audio #2
              </FileInputLabel>
              <FileInput
                id="supplementAudioUpload"
                type="file"
                accept="audio/*"
                onChange={handleSupplementAudioFileChange}
              />
              <ControlBarButton onClick={syncSupplementAudioWithVideo}>
                Sync Audio
              </ControlBarButton>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontFamily: "Arial",
                }}
              >
                <label>Audio/Video Balance</label>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.01"
                  value={balance}
                  onChange={(e) => setBalance(Number(e.target.value))}
                />
                <label>Offset (±ms) </label>
                <input
                  type="number"
                  style={{ fontSize: "14px" }}
                  id="numberInput"
                  value={offset}
                  onChange={(e) => setOffset(Number(e.target.value))}
                  step="25"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontFamily: "Arial",
                }}
              >
                <label>Audio 2 Offset (±ms) </label>
                <input
                  type="number"
                  style={{ fontSize: "14px" }}
                  id="numberInput"
                  value={supplementAudioOffset}
                  onChange={(e) =>
                    setSupplementAudioOffset(Number(e.target.value))
                  }
                  step="25"
                />
                <label
                  style={{
                    fontSize: "14px",
                    fontFamily: "Arial",
                    userSelect: "none",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={animate}
                    onChange={(e) => setAnimate(e.target.checked)}
                    onSelect={(e) => e.preventDefault()}
                    style={{ marginRight: "8px" }}
                  />
                  Line Animation
                </label>
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <input
                    type="color"
                    value={lrcColor}
                    onChange={(e) => setLrcColor(e.target.value)}
                  />
                  <input
                    type="color"
                    value={fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                  />
                  <button
                    onClick={() => {
                      setLrcColor("#C8BEBE");
                      setFontColor("#000000");
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </FileInputContainer>
          )}
        </div>
      </div>
    </Root>
  );
}

export default KaraokePage;
