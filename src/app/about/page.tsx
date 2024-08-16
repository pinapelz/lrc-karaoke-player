"use client";
import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    body {
        font-family: 'Roboto', sans-serif;
    }
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: left;
    padding: 20px;
    background-color: #f9f9f9;
    color: #333;
`;

const Title = styled.h1`
    font-size: 2.5em;
    margin-bottom: 0.5em;
    font-weight: 700;
`;

const Subtitle = styled.h2`
    font-size: 1.5em;
    margin-bottom: 1em;
    font-weight: 600;
`;

const Paragraph = styled.p`
    font-size: 1.2em;
    line-height: 1.6;
    margin-bottom: 2em;
    text-align: left;
    font-weight: 450;
`;

const Preformatted = styled.pre`
    font-size: 1em;
    background-color: #eaeaea;
    padding: 10px;
    border-radius: 5px;
    white-space: pre-wrap;
    word-wrap: break-word;
`;

const BackLink = styled.a`
    font-size: 1em;
    color: #007bff;
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
`;

const Video = styled.video`
    width: 100%;
    max-width: 600px;
    margin: 20px 0;
    border-radius: 10px;
`;

const lyrics = `[ti:CRUSH]
[al:CRUSH]
[ar:IVE]
[length: 03:29.49]
[00:00.11] La, la, la-la-la-la
[00:07.83] 瞳の奥 重なる eyes
[00:11.88] 今宵 二人を照らす moon
[00:16.06] Nine to five dreaming, これじゃまるで恋ね
[00:20.12] But the odds were high, 夢見たい気分?
[00:25.23] 待ってるだけじゃ何も始まんない`;

const AboutPage: React.FC = () => {
    return (
        <>
            <GlobalStyle />
            <Container>
                <Title>About</Title>
                <Subtitle>What is this player?</Subtitle>
                <Paragraph>
                    This player is capable of simultaneously playing back a lyric file (LRC), a main video/audio file, a SRV3 YouTube Timed Text, and a backing audio file.
                    <br />The idea is that this helps with not only karaoke but also checking how well a LRC or SRV3 file syncs with the main video/audio.
                </Paragraph>
                <Subtitle>How to use this player?</Subtitle>
                <Paragraph>
                    You'll need to prepare a few files for the media you want to play back first.
                    <br />Theoretically you can mix/match any of the files below since the main video/audio is all that's mandatory for playback.
                    <br />In this guide I'll assume that you're after a karaoke experience, and want the works.
                    <br /><br />To add any files to the player simply drag it onto the right part of the player page.
                    <br />EVERYTHING IS RAN LOCALLY, NO FILES ARE EVER UPLOADED TO ANY SERVERS.
                </Paragraph>
                <Subtitle>1. Main video/audio file</Subtitle>
                <Paragraph>
                    Note: I've renamed the second button seen in the demos from Video to Media to avoid confusion since it can support audio/video files
                </Paragraph>
                <Paragraph>
                    This is the file that you want to play back. It can be a video or an audio file.
                    <br />Supported formats: mp4, webm, ogg, mp3, wav, flac, and more.
                    <br />If you choose to use an audio file here, the right part of the player will not show a video preview.
                    <br /> <br />A good way would be to download some video from YouTube. You may need to make adjustments to the offset later depending on how well the LRC files syncs with the video.
                    <br /> How you do that will be up to you, but I recommend using <a href="https://github.com/yt-dlp/yt-dlp">yt-dlp</a> to download the video.
                </Paragraph>
                <Subtitle>2. Lyric File (LRC)</Subtitle>
                <Paragraph>
                    This is the file that contains the lyrics of the song you want to sing.
                    <br />An example LRC file is shown below...
                </Paragraph>
                <Preformatted dangerouslySetInnerHTML={{ __html: lyrics.replace(/\n/g, '<br/>') }} />
                <Paragraph>
                    The player will highlight the current line of the lyrics as the main media progresses.
                    <br />
                    If you need a LRC file, a good way is to rip it from Spotify using <a href="https://github.com/akashrchandran/syrics">Syrics</a>.
                </Paragraph>
                <br/>
                <br/>
                <Paragraph>
                    At this point you should already be able to play back the main media and have the lyrics highlighted as the media progresses.
                    <br />Depending on how well the LRC file syncs with the main media, you may need to adjust the main offset lablled as "Offset (±ms)"
                </Paragraph>
                <Video controls>
                    <source src="https://files.catbox.moe/mfaei6.mp4" type="video/mp4" />
                </Video>
                <Subtitle>3. Insturmental/Vocals (Audio 2)</Subtitle>
                <Paragraph>
                    If you only wanted one or the other, simply add that as the main media then you're done
                    <br />There are a ton of tools online to remove this but you'll want to make sure you get the insturmental track in an audio format (mp3, wav, etc.)
                    <br />Then hover over the right side of the player, click the "Audio #2" button, and find your insturmental track.
                    <br /><br />(TIP!) I suggest going back and setting the main media in step 1 (Media button) in the previous step to a vocal only video/audio.
                    <br /> This will make it significantly easier to offset the 2 tracks. You can always mux a video file on top of that if you want visuals too!
                    <br/>Ultimately it doesn't matter which "slot" the insturmental or "vocals" go into, its just better to have them seperated!
                    <br/><br/>Now adjust the offset using the numerical inputs, the "Sync" button will adjust Audio 2 relative to the main media.
                    <br/>I positioning the playhead at 00:00 and then adding the secondary audio, this will make adjustments much easier.
                    <br/><br/>
                    Now you should be able to control the balance between both of these files (which one is louder) by using the slider!
                </Paragraph>
                <Subtitle>4. YouTube Timed Text</Subtitle>
                <Paragraph>
                    If the YouTube video you downloaded has subtitles (sometimes they look really cool and fancy), you can download that using yt-dlp
                    for use in the player as well.
                    <br/><br/>Unfortunatly there is no way to adjust the offset for this, it'll play according to the main media.
                </Paragraph>
                <Video controls>
                    <source src="https://private-user-images.githubusercontent.com/21994085/285583271-5106bb53-d962-45e9-9a6b-6368dd1c6437.mp4?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MjM3OTA3MTAsIm5iZiI6MTcyMzc5MDQxMCwicGF0aCI6Ii8yMTk5NDA4NS8yODU1ODMyNzEtNTEwNmJiNTMtZDk2Mi00NWU5LTlhNmItNjM2OGRkMWM2NDM3Lm1wND9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDA4MTYlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwODE2VDA2NDAxMFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWNjNDQ2ZDdhZjEzYTNkYTFhNTdhYzBiZTU0NjUxZGZjZjJjMmViMzc0ZjVmNGZjOTAwNTc0OGNmZTY1MDhmODkmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.yJWR0mVVKOqNZcCIU8yWYR4Q22kwT8VfhlbllJu3nLI"/>
                </Video>
                <BackLink href="/">Back to player</BackLink>
            </Container>
        </>
    );
};

export default AboutPage;