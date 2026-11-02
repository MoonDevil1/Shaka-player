(() => {
  "use strict";

  const API_BASE = "https://livetgtv.lovable.app/api/public/channels/";
  const video = document.getElementById("video");
  const form = document.getElementById("channel-form");
  const channelInput = document.getElementById("channel-id");
  const nameNode = document.getElementById("channel-name");
  const categoryNode = document.getElementById("channel-category");
  const statusNode = document.getElementById("status");
  const messageNode = document.getElementById("message");
  const placeholder = document.getElementById("placeholder");
  const playButton = document.getElementById("play-button");

  let player = null;
  let requestNumber = 0;

  function cleanText(value) {
    if (typeof value !== "string") return "";
    const text = value.trim();
    const markdown = text.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/i);
    return markdown ? markdown[2] : text;
  }

  function setStatus(status, message) {
    statusNode.textContent = status;
    if (message !== undefined) messageNode.textContent = message;
  }

  function normalizeDetail(payload) {
    return payload && (payload.channel || payload.data || payload);
  }

  function validateClearKey(drm) {
    if (!drm || String(drm.type || "").toLowerCase() !== "clearkey") return null;
    const keyId = String(drm.keyId || drm.key_id || "").replace(/^0x/i, "").trim().toLowerCase();
    const key = String(drm.key || "").replace(/^0x/i, "").trim().toLowerCase();
    const valid = value => value.length > 0 && value.length % 2 === 0 && /^[0-9a-f]+$/.test(value);
    if (!valid(keyId) || !valid(key) || keyId.length !== key.length) {
      throw new Error("The V1 API returned invalid ClearKey fields.");
    }
    return {keyId, key};
  }

  async function loadChannel(channelId) {
    const requestId = ++requestNumber;
    playButton.disabled = true;
    setStatus("Loading", "Fetching a fresh LiveTGTV V1 channel response…");
    placeholder.hidden = false;

    try {
      if (!window.shaka || !shaka.Player.isBrowserSupported()) {
        throw new Error("This browser does not support Shaka Player. Try an up-to-date Chrome browser.");
      }

      if (player) {
        await player.destroy();
        player = null;
      }

      const response = await fetch(API_BASE + encodeURIComponent(channelId), {
        method: "GET",
        headers: {Accept: "application/json"},
        cache: "no-store"
      });
      if (!response.ok) throw new Error("LiveTGTV V1 API returned HTTP " + response.status + ".");
      const payload = await response.json();
      const data = normalizeDetail(payload);
      if (!data || typeof data !== "object") throw new Error("The V1 channel response is empty.");

      const sources = Array.isArray(data.sources)
        ? data.sources.map(cleanText).filter(Boolean)
        : (typeof data.source === "string" ? [cleanText(data.source)] : []);
      if (!sources.length) throw new Error("This channel has no playable V1 source.");

      if (requestId !== requestNumber) return;
      nameNode.textContent = data.name || ("Channel " + channelId);
      categoryNode.textContent = (data.category || "Live television") + " • LiveTGTV V1";

      player = new shaka.Player();
      await player.attach(video);
      const clearKey = validateClearKey(data.drm);
      if (clearKey) {
        player.configure({drm: {clearKeys: {[clearKey.keyId]: clearKey.key}}});
      }

      player.addEventListener("error", event => {
        const detail = event.detail || {};
        setStatus("Playback error", "Shaka error " + (detail.code || "unknown") + ". Check source availability and API permissions.");
      });

      let lastError = null;
      for (const source of sources) {
        if (requestId !== requestNumber) return;
        try {
          await player.load(source);
          video.play().catch(() => setStatus("Ready", "Press Play to start the live channel."));
          placeholder.hidden = true;
          setStatus("Loaded", clearKey ? "V1 MPD loaded with ClearKey configuration." : "V1 stream loaded.");
          return;
        } catch (error) {
          lastError = error;
        }
      }
      throw lastError || new Error("All V1 sources failed to load.");
    } catch (error) {
      console.error("LiveTGTV V1 playback failed:", error);
      setStatus("Could not play", error && error.message ? error.message : "Unknown playback error.");
    } finally {
      if (requestId === requestNumber) playButton.disabled = false;
    }
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    const id = channelInput.value.trim();
    if (!id) return;
    const url = new URL(window.location.href);
    url.searchParams.set("channel", id);
    history.replaceState(null, "", url);
    loadChannel(id);
  });

  const initialId = new URLSearchParams(window.location.search).get("channel");
  if (initialId) {
    channelInput.value = initialId;
    loadChannel(initialId);
  }
})();