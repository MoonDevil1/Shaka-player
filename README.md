# LiveTGTV V1 Shaka Player

A browser-based companion player for LiveTGTV's **V1** public channel API. It fetches channel details at playback time, loads the returned DASH/HLS source with Shaka Player, and applies the API's published ClearKey values only when the response explicitly declares `drm.type: "clearkey"`.

## Run

Open `index.html` through a static web server (GitHub Pages is suitable), then provide a V1 channel ID:

```
https://YOUR_PAGES_HOST/Shaka-player/?channel=143
```

The page also has a channel-ID field. It does not contain hardcoded channel URLs, signed tokens, or DRM keys.

## V1 response expectations

The detail endpoint is `GET https://livetgtv.lovable.app/api/public/channels/{id}`.

Expected fields:
- `name`, optional `category`
- `sources`: array of media URLs (or a single `source`)
- optional `drm`: `{ "type": "clearkey", "keyId": "<hex>", "key": "<hex>" }`

The player only configures ClearKey when that exact DRM type and valid hexadecimal key fields are returned. It does not crack, derive, or bypass DRM. Signed URLs and keys are fetched at runtime and are not persisted.

## Important Vega integration status

Vega's provider `Stream` contract describes media URL, media type, quality, headers, subtitles and skip intervals. The inspected Vega app player does not currently read a provider `drm` object. This companion page implements the Shaka-side V1 playback path, but it is **not automatically launched by Vega yet**. A Vega app-side playback handoff is still required to open this page or configure native ClearKey playback from a selected LiveTGTV stream.

The supplied app fork `MoonDevil1/vega-app` was not accessible during this implementation, so no app code was changed. Do not point Vega's native video component directly at this HTML page as if it were an MPD.

## Deployment

Enable GitHub Pages for this repository using the `main` branch and repository root. After deployment, test a channel ID currently returned by the V1 API. Playback depends on API availability, CORS, regional access, browser support, and the channel's current source.
