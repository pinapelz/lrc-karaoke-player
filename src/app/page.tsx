"use client"
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import KaraokePlayer from "./components/KaraokePlayer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { CaptionsRenderer } from "react-srv3";

// Srtyled components
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

const StyledLink = styled.a`
    font-size: 20px;
    font-family: Arial;
    text-decoration: none;
    text-color: black;
    &:hover {
        text-decoration: underline;
    }
    `;

function KaraokePage() {
  const [currentMillisecond, setCurrentMillisecond] = useState(0);
  const [lrcContent, setLrcContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [scrubValue, setScrubValue] = useState(0);
  const [showFileInputs, setShowFileInputs] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [captionsText, setCaptionsText] = useState("");
  const [offset, setOffset] = useState("0");
  const [dragOver, setDragOver] = useState(false);
  const [statusText, setStatusText] = useState("No video selected");

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
    event: React.ChangeEvent<HTMLInputElement>
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
      reader.onload = (e) => {
        setCaptionsText(e.target?.result as string);
      };
      reader.readAsText(file);
      toast.success("SRV file loaded successfully", { autoClose: 2000 });
  }
  };

  // Side effects for keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        handlePlayPause();
      }
      if (e.code === "ArrowRight") {
        const video = videoRef.current;
        if (!video) return;
        video.currentTime += 5;
      }
      if (e.code === "ArrowLeft") {
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
      setCurrentMillisecond(video.currentTime * 1000 + parseInt(offset)); // updates lrc position
      setScrubValue((video.currentTime / video.duration) * 100); // update playhead position
    };
    video.addEventListener("timeupdate", syncLrcWithVideo);

    return () => {
      video.removeEventListener("timeupdate", syncLrcWithVideo);
    };
  });


  // General video control functionality

  const handleVolumeToggle = () => {
    setShowVolume(!showVolume);
  };

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

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

  const handleScrub = (event: React.ChangeEvent<HTMLInputElement>) => {
    const time =
      (parseFloat(event.target.value) / 100) * videoRef.current!.duration;
    videoRef.current!.currentTime = time;
    setScrubValue(parseFloat(event.target.value));
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = Number(event.target.value) / 100;
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
    if(file.name.endsWith(".lrc")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLrcContent(e.target?.result as string);
        if (videoUrl) setShowFileInputs(false);
      };
      reader.readAsText(file);
      toast.success("LRC file loaded successfully", { autoClose: 2000 });
    }
    else if(file.name.endsWith(".srv3")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCaptionsText(e.target?.result as string);
      };
      reader.readAsText(file);
      toast.success("SRV file loaded successfully", { autoClose: 2000 });
    }
    else if(file.type.startsWith("video") || file.type.startsWith("audio") ) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setCurrentMillisecond(0);
      setScrubValue(0);
      setIsPlaying(false);
      toast.success("Video/Audio file loaded successfully", { autoClose: 2000 });
    }
    else{
      toast.error("Unsupported file type", { autoClose: 2000 });
    }
  }



  return (
    <Root>
      <ToastContainer />
      {/*LRC viewer*/ }
      <div style={{ display: "flex", width: "100%", height: "100vh" }}>
        <KaraokePlayer
          lrc={lrcContent}
          currentMillisecond={currentMillisecond}
        />


        {/* Ternary operation for if videoUrl has been set */}
        <div
          style={{ flex: 1, position: "relative", backgroundColor: dragOver ? 'lightblue' : 'white', }}
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
                style={{ position: "absolute", width: "100%", height: "100%" }}
              />
              <div 
              style={{ width: '90%', height: '90%', margin: 'auto' }}
              onClick={() => handlePlayPause()}
              >
                <CaptionsRenderer
                  srv3={captionsText}
                  currentTime={currentMillisecond / 1000}
                />
              </div>
              { /*Video control bar*/ }
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
                  style={{ flex: 1, height: "50px" }}
                  onInput={handleScrub}
                />
                <div
                  style={{
                    position: "relative",
                    width: "50px",
                    height: "50px",
                  }}
                >
                  <button
                    onClick={handleVolumeToggle}
                    style={{
                      width: "100%",
                      height: "100%",
                      padding: "10px",
                      border: "none",
                      borderRadius: "5px",
                      backgroundColor: "white",
                      color: "black",
                    }}
                  >
                    {!showVolume ? <FaVolumeMute /> : <FaVolumeUp />}
                  </button>
                  {showVolume && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "100%",
                        transform:
                          "translateX(-50%) translateY(-100%) rotate(-90deg)",
                      }}
                    >
                      <input
                        type="range"
                        min="0"
                        max="100"
                        defaultValue="100"
                        style={{ height: "40px", width: "100px" }}
                        onChange={handleVolumeChange}
                      />
                    </div>
                  )}
                </div>
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
                flexDirection: "column"
              }}
            >
              <h1 style={{ fontFamily: "Arial", fontWeight: "bold", fontSize: "32px" }}>
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
                (Drag and Drop them here, or use the menus below!)
                <br/>
                <StyledLink href="/about>">About</StyledLink>
              </p>
            </div>
          )}

          {/* File inputs, shown on hover over video div region*/}
          {showFileInputs && (
            <FileInputContainer
              style={{ position: "absolute", bottom: "30px", left: 0 }}
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
                Video
              </FileInputLabel>
              <FileInput
                id="videoUpload"
                type="file"
                accept="video/*"
                onChange={handleVideoFileChange}
              />
              <FileInputLabel 
                htmlFor="srvUpload"
                style={{ cursor: "pointer" }}
                >
                  SRV
              </FileInputLabel>
              <FileInput id="srvUpload" type="file" accept=".srv3" onChange={handleSrvFileChange}/>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontFamily: "Arial",
                }}
              >
                <label>Offset (±ms) </label>
                <input
                  type="number"
                  style={{ fontSize: "14px" }}
                  id="numberInput"
                  value={offset}
                  onChange={(e) => setOffset(e.target.value)}
                  step="100"
                />
              </div>
            </FileInputContainer>
          )}
        </div>
      </div>
    </Root>
  );
}

export default KaraokePage;
