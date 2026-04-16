import { AudioManagerInterface } from '../types';

export class AudioManager implements AudioManagerInterface {
  private context: AudioContext | null = null;
  private musicNode: OscillatorNode | null = null;
  private musicGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicVolume: number = 0.5;
  private sfxVolume: number = 0.5;
  private masterVolume: number = 1.0;
  private initialized: boolean = false;

  init() {
    if (this.initialized) return;
    this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.context.createGain();
    this.masterGain.connect(this.context.destination);
    this.sfxGain = this.context.createGain();
    this.sfxGain.connect(this.masterGain);
    this.musicGain = this.context.createGain();
    this.musicGain.connect(this.masterGain);
    this.setMasterVolume(this.masterVolume);
    this.setMusicVolume(this.musicVolume);
    this.setSFXVolume(this.sfxVolume);
    this.initialized = true;
  }

  private ensureContext() {
    if (!this.initialized) this.init();
    else if (this.context && this.context.state === 'suspended') this.context.resume();
  }

  playMusic(trackId: number) {
    this.ensureContext();
    this.stopMusic();
    if (!this.context) return;
    const osc = this.context.createOscillator();
    osc.type = trackId === 1 ? 'sine' : trackId === 2 ? 'square' : 'sawtooth';
    osc.frequency.value = 220 + trackId * 50;
    osc.connect(this.musicGain!);
    osc.start();
    this.musicNode = osc;
  }

  stopMusic() {
    if (this.musicNode) {
      this.musicNode.stop();
      this.musicNode = null;
    }
  }

  setMusicVolume(vol: number) {
    this.musicVolume = vol;
    if (this.musicGain) {
      this.musicGain.gain.setValueAtTime(vol * this.masterVolume, this.context?.currentTime || 0);
    }
  }

  setSFXVolume(vol: number) {
    this.sfxVolume = vol;
    if (this.sfxGain) {
      this.sfxGain.gain.setValueAtTime(vol * this.masterVolume, this.context?.currentTime || 0);
    }
  }

  setMasterVolume(vol: number) {
    this.masterVolume = vol;
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(vol, this.context?.currentTime || 0);
    }
  }

  playSFX(sfx: 'jump' | 'death' | 'click' | 'win') {
    this.ensureContext();
    if (!this.context) return;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.connect(gain);
    gain.connect(this.sfxGain!);
    gain.gain.setValueAtTime(0.1, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.2);
    switch (sfx) {
      case 'jump':
        osc.frequency.setValueAtTime(400, this.context.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.context.currentTime + 0.1);
        break;
      case 'death':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, this.context.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.context.currentTime + 0.2);
        break;
      case 'click':
        osc.frequency.setValueAtTime(600, this.context.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, this.context.currentTime + 0.05);
        gain.gain.setValueAtTime(0.05, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.05);
        break;
      case 'win':
        osc.frequency.setValueAtTime(500, this.context.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1000, this.context.currentTime + 0.3);
        break;
    }
    osc.start();
    osc.stop(this.context.currentTime + 0.3);
  }
}