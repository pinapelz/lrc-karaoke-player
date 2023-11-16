import { NextRequest, NextResponse } from 'next/server'

const spotifyLyricsAPIURL = 'https://spotify-lyric-api-984e7b4face0.herokuapp.com/'

interface Line{
    timeTag: string;
    words: string;
}

interface SpotifyLyricAPIResponse {
    error: boolean;
    syncType: string;
    usage?: string
    lines?: Line[];
}

function extractSpotifyId(url: string | null) {
    if (!url) {
        return url;
    }
    const spotifyUrlPattern = /https:\/\/open\.spotify\.com\/track\/([a-zA-Z0-9]+)/;
    const match = spotifyUrlPattern.exec(url);
    if (match && match[1]) {
        return match[1];
    } else {
        return url;
}
}

function convertLinesToLrc(lines: Line[] | undefined) {
    if (!lines) {
        return '';
    }
    let lrc = '';
    for (const line of lines) {
        lrc += `[${line['timeTag']}]${line['words']}\n`;
        console.log(lrc);
    }
    return lrc;
}

export const runtime = 'edge';
export async function GET(request: NextRequest) {
 const searchParams = request.nextUrl.searchParams
 const q = searchParams.get('q');
 const url = `${spotifyLyricsAPIURL}?trackid=${extractSpotifyId(q)}&format=lrc`
const response = await fetch(url);
if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
}
const data: SpotifyLyricAPIResponse = await response.json();
 const lrcString = convertLinesToLrc(data.lines);
 return NextResponse.json({ message: lrcString })
}
