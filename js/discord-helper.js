// Helper functions for Discord RPC from player.js

// Call this when a video starts playing
function updateDiscordRPC(videoData, isPlaying) {
    console.log('🎵 updateDiscordRPC called from renderer:', { videoData, isPlaying });

    if (window.electronAPI && window.electronAPI.discordUpdatePresence) {
        const data = {
            title: videoData.title || 'Sans titre',
            artist: videoData.owner_name || 'Artiste inconnu',
            playing: isPlaying,
            startTime: isPlaying ? Date.now() : null,
            duration: videoData.duration || null,
            url: `https://v2.protogen.fr/video/${videoData.video_id}`
        };
        console.log('📤 Sending to main process:', data);
        window.electronAPI.discordUpdatePresence(data);
    } else {
        console.warn('❌ electronAPI.discordUpdatePresence not available');
    }
}

// Call this when stopping/clearing playback
function clearDiscordRPC() {
    if (window.electronAPI && window.electronAPI.discordClearPresence) {
        window.electronAPI.discordClearPresence();
    }
}

// Call this to enable/disable Discord RPC
function setDiscordRPCEnabled(enabled) {
    if (window.electronAPI && window.electronAPI.discordSetEnabled) {
        window.electronAPI.discordSetEnabled(enabled);
    }
}

// Add to player.js onPlay() method:
// updateDiscordRPC(this.currentVideo, true);

// Add to player.js onPause() method:
// updateDiscordRPC(this.currentVideo, false);

// Add to player.js when video ends or stops:
// clearDiscordRPC();
