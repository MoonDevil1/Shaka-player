# LiveTGTV Shaka Player

A lightweight responsive web player for Android and Windows browsers, using **Shaka Player** for MPEG-DASH and HLS playback where supported.

## Run
Open `index.html` through a local static server or deploy the repository with GitHub Pages. The Shaka library is loaded from a CDN, so an internet connection is required.

## Data flow
- Loads the documented public V1 channel catalogue and V2 catalogue.
- Resolves each selected channel through its matching public channel endpoint.
- Uses the returned stream URL with Shaka Player; V1 ClearKey configuration is applied only when explicitly returned by the public resolver.
- Provides channel search, source selection, refresh and stop controls.

## Important
This is a browser-based app, not a native APK or Windows executable. It does not extract keys from embeds or bypass DRM/access controls. A successful resolver response does not guarantee that a channel is currently online or playable on every network/device.
