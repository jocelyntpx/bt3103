<template>
  <div class="controls">
    <h2>Call overview</h2>
    <hr />
    <h3>Invite participants</h3>
    <label for="urlInput">Share URL below to invite others</label>
    <div>
      Room URL to copy and share
      <input type="text" id="urlInput" :value="roomUrl" />
      <button @click="copyUrl" class="teal">{{ copyButtonText }}</button>
    </div>
    <hr />
    <h3>Example custom controls</h3>
    <p>
      You can also create your own meeting controls using daily-js methods
    </p> 
    <div>
      <button @click="toggleCamera">Toggle camera</button>
      <button @click="toggleMic">Toggle mic</button>
      <button @click="expandFullscreen">Expand fullscreen</button>
      <button @click="toggleLocalVideo">
        {{ localVideoText }} local video
      </button>
      <button @click="toggleRemoteParticipants">
        {{ remoteVideoText }} remote participants (Speaker view only)
      </button>
      <button @click="leaveCall">
        Leave call
      </button>
    </div>
  </div>
</template>