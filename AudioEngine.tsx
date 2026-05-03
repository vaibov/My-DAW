export class AudioEngine {
  private ctx: AudioContext;
  private source: AudioBufferSourceNode | null = null;
  private masterGain: GainNode;
  public analyser: AnalyserNode;
  private currentBuffer: AudioBuffer | null = null;

  constructor() {
    this.ctx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    this.masterGain = this.ctx.createGain();
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 512;

    // Route: Source -> Gain -> Analyser -> Destination
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
  }

  async loadFile(file: File): Promise<AudioBuffer> {
    const arrayBuffer = await file.arrayBuffer();
    this.currentBuffer = await this.ctx.decodeAudioData(arrayBuffer);
    return this.currentBuffer;
  }

  play(buffer?: AudioBuffer) {
    const bufferToPlay = buffer || this.currentBuffer;
    if (!bufferToPlay) return;

    // Browser security: Resume context if suspended[cite: 5]
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    this.stop(); // Stop any existing playback

    this.source = this.ctx.createBufferSource();
    this.source.buffer = bufferToPlay;
    this.source.connect(this.masterGain);
    this.source.start();
  }

  stop() {
    if (this.source) {
      this.source.stop();
      this.source.disconnect();
      this.source = null;
    }
  }

  setVolume(value: number) {
    // Smooth transition to avoid clicks[cite: 5]
    this.masterGain.gain.setTargetAtTime(value, this.ctx.currentTime, 0.05);
  }
}
