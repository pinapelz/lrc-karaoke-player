import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import KaraokePlayer from './components/KaraokePlayer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const FileInput = styled.input`
  padding: 10px 15px;
  border-radius: 5px;
  border: 1px solid #ddd;
  cursor: pointer;
  display: none;
  &:hover, &:focus {
    background-color: #eaeaea;
    outline: none;
  }
`;

const FileInputLabel = styled.label`
  padding: 10px 15px;
  border-radius: 5px;
  border: 1px solid #ddd;
  cursor: pointer;
  &:hover, &:focus {
    background-color: #eaeaea;
    outline: none;
  }
`;


function App() {
  
  const [currentMillisecond, setCurrentMillisecond] = useState(0);
  const [lrcContent, setLrcContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [showFileInputs, setShowFileInputs] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [offset, setOffset] = useState('0');
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
  
  const handleVideoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setShowFileInputs(true);
      toast.success("Video file loaded successfully", { autoClose: 2000 });
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const syncLrcWithVideo = () => {
      console.log(offset);
      setCurrentMillisecond((video.currentTime * 1000) + parseInt(offset));
    };
    video.addEventListener('timeupdate', syncLrcWithVideo);

    return () => {
      video.removeEventListener('timeupdate', syncLrcWithVideo);
    };
  });

  return (
    <Root>
      <ToastContainer />
      <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
        <KaraokePlayer
          lrc={lrcContent}
          currentMillisecond={currentMillisecond}
        />
        <div style={{ flex: 1, position: 'relative' }} onMouseEnter={() => setShowFileInputs(true)} onMouseLeave={() => setShowFileInputs(false)}>
          {videoUrl ? <video ref={videoRef} src={videoUrl} controls style={{ width: '100%', height: '100%' }} /> :<div style={{ width: '100%', height: '100%', backgroundColor: '#ddd', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <p style={{fontSize: '30px', textAlign: 'center', fontFamily:'Arial', fontWeight:'bold'}}>
              Please select the video and lrc (lyrics) file <br/>
              Hover over me for a menu</p>
          </div>
          }
          {showFileInputs && (
            <FileInputContainer style={{ position: 'absolute', bottom: '20px', left: 0 }}>
              <FileInputLabel htmlFor="lrcUpload" style={{ cursor: 'pointer' }}>LRC</FileInputLabel>
              <FileInput id="lrcUpload" type="file" accept=".lrc" onChange={handleLrcFileChange} />
              <FileInputLabel htmlFor="videoUpload" style={{ cursor: 'pointer' }}>Video</FileInputLabel>
              <FileInput id="videoUpload" type="file" accept="video/*" onChange={handleVideoFileChange} />
              <FileInputLabel htmlFor="srvUpload" style={{ cursor: 'pointer' }}>SRV</FileInputLabel>
              <FileInput disabled type="file" accept=".srv" />
              <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Arial' }}>
                <label>Offset (±ms) </label>
                <input
                  type="number"
                  style={{ fontSize: '20px' }}
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

export default App;
