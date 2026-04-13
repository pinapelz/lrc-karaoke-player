# lrc-karaoke-player
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

A karaoke-oriented media player. Supports simultaneous playback of a main video/audio file, a secondary audio track, LRC lyrics, and SRV3 (YouTube Timed Text) subtitles.

https://github.com/Patchwork-Archive/Patchwork-Karaoke/assets/21994085/5106bb53-d962-45e9-9a6b-6368dd1c6437

---

## Build

```sh
pnpm i
pnpm run dev
```

---

## Features

- **LRC lyrics** — scrolling line-by-line lyrics with highlight animation
- **SRV3 subtitles** — YouTube Timed Text rendered over the video
- **Dual audio** — mix a main media file with a secondary audio track (e.g. vocals + instrumental)
- **Audio/Video balance** — slider to blend the two audio sources
- **Timing offsets** — independently adjust LRC sync and Audio #2 sync in milliseconds
- **Drag and drop** — drop any supported file directly onto the player
- **Resizable panes** — drag the divider between the lyrics and video panels
- **MoekyunKaraoke codes** — shareable codes that load a full session from remote URLs

---

## Supported File Types

| Slot | Accepted formats |
|------|-----------------|
| Media (file1) | `mp4`, `webm`, `ogg`, `mp3`, `wav`, `flac`, and any format the browser supports |
| Audio #2 (file2) | Same as above |
| Lyrics | `.lrc` |
| Subtitles | `.srv3` (YouTube Timed Text) |

The purpose of having `Audio #2` is if you want to dynamically change the volume of 2 tracks. As an example, you may want `Media` to be an insturmental, while `Audio #2` to be acapella/vocal-isolated version. This way you can dynamically change the volume of either.


---

## MoekyunKaraoke Code

A MoekyunKaraoke code is a **Base64-encoded JSON object** that encodes remote URLs and timing settings for a session. Paste one into the input field on the player page, or pass it as a `?code=` URL query parameter to share a fully-loaded session as a single link.

### Encoding / decoding

```js
// Encode
const code = btoa(JSON.stringify(payload));

// Decode (done internally by the player)
const payload = JSON.parse(atob(code));
```

### Fields

All fields are optional — include only the ones you need.

| Field | Type | Description |
|-------|------|-------------|
| `lrc` | `string` (URL) | URL to an `.lrc` lyrics file. Fetched by the player at load time. |
| `srv3` | `string` (URL) | URL to a `.srv3` YouTube Timed Text subtitle file. Fetched by the player at load time. |
| `file1` | `string` (URL) | URL to the main video or audio file. |
| `file2` | `string` (URL) | URL to the supplemental (secondary) audio file. |
| `offset` | `number` (ms) | LRC timing offset in milliseconds. Negative values shift lyrics earlier; positive values shift them later. |
| `offset2` | `number` (ms) | Audio #2 timing offset in milliseconds. |

### Example payload

```json
{
  "lrc":    "https://example.com/song.lrc",
  "file1":  "https://example.com/song.webm",
  "offset": -800
}
```

Full session with every field:

```json
{
  "lrc":     "https://example.com/song.lrc",
  "srv3":    "https://example.com/song.srv3",
  "file1":   "https://example.com/song.webm",
  "file2":   "https://example.com/instrumental.mp3",
  "offset":  -800,
  "offset2": 120
}
```

### Sharing via URL

```
https://your-player-domain.com/?code=eyJsciI6Imh0dHBzOi8v...
```

### Notes

- `lrc` and `srv3` are fetched client-side and require the hosting server to send permissive CORS headers (`Access-Control-Allow-Origin: *`).
- `file1` and `file2` are set as media `src` attributes directly and are subject to the same CORS restrictions for cross-origin URLs.

> See [`KARAOKE_CODE.md`](./KARAOKE_CODE.md) for the full format reference including code generation examples in JavaScript and Python.
