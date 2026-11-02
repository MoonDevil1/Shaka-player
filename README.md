# LiveTGTV Shaka Player

A responsive LiveTGTV channel player for Android and Windows browsers, powered by Shaka Player.

## Use
- Open the deployed GitHub Pages site in a modern browser, or install the Android APK from the GitHub Actions **Android APK** artifact.
- Search the catalogue, choose a channel, select a source and press Play.
- The web version is also usable on Windows; install it as a browser app where supported.

## Stream handling
- Loads LiveTGTV public V1 and V2 channel catalogues.
- Resolves V1 source arrays (including DASH/MPD) and V2 server arrays (including HLS/M3U8).
- Applies resolver-provided request headers and explicitly supplied ClearKey configuration only.
- If the catalogue API is unavailable, tries the public directory pages as a fallback.

## Build
The `.github/workflows` directory contains:
- GitHub Pages deployment for the web player.
- Android debug APK build; the APK is published as a workflow artifact.

## Limitations
Playback still depends on the provider's current stream availability, CORS, network, browser/codec support and any provider-authorized DRM configuration. This app does not extract keys from embeds or bypass DRM/access controls. A successful build does not prove every channel is playable.
