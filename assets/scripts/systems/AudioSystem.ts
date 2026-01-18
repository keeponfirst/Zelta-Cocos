/**
 * AudioSystem - 音效系統
 * 
 * 管理 BGM 和 SFX 的播放
 */

import { _decorator, Component, AudioSource, AudioClip, resources } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('AudioSystem')
export class AudioSystem extends Component {
    private static _instance: AudioSystem | null = null;

    @property(AudioSource)
    private bgmSource: AudioSource | null = null;

    @property(AudioSource)
    private sfxSource: AudioSource | null = null;

    public volumeSFX: number = 1.0;
    public volumeMusic: number = 1.0;
    private _muted: boolean = false;

    public static getInstance(): AudioSystem | null {
        return AudioSystem._instance;
    }

    protected onLoad(): void {
        AudioSystem._instance = this;
        this.ensureAudioSources();
    }

    private ensureAudioSources() {
        if (!this.bgmSource) {
            this.bgmSource = this.node.addComponent(AudioSource);
        }
        if (!this.sfxSource) {
            this.sfxSource = this.node.addComponent(AudioSource);
        }
    }

    protected onDestroy(): void {
        AudioSystem._instance = null;
    }

    /**
     * 播放 BGM
     */
    public playBGM(path: string): void {
        resources.load(path, AudioClip, (err, clip) => {
            if (err) {
                console.error(`Failed to load BGM: ${path}`, err);
                return;
            }
            if (this.bgmSource) {
                this.bgmSource.clip = clip;
                this.bgmSource.loop = true;
                this.bgmSource.volume = this.volumeMusic;
                this.bgmSource.play();
            }
        });
    }

    /**
     * 停止 BGM
     */
    public stopBGM(): void {
        if (this.bgmSource) {
            this.bgmSource.stop();
        }
    }

    /**
     * 播放 SFX
     */
    public playSFX(path: string): void {
        resources.load(path, AudioClip, (err, clip) => {
            if (err) {
                console.error(`Failed to load SFX: ${path}`, err);
                return;
            }
            if (this.sfxSource) {
                this.sfxSource.playOneShot(clip, this.volumeSFX);
            }
        });
    }

    /**
     * 設定 BGM 音量
     */
    public setBGMVolume(volume: number): void {
        this.volumeMusic = Math.max(0, Math.min(1, volume));
        if (this.bgmSource) {
            this.bgmSource.volume = this.volumeMusic;
        }
    }

    /**
     * 設定 SFX 音量
     */
    public setSFXVolume(volume: number): void {
        this.volumeSFX = Math.max(0, Math.min(1, volume));
    }

    /**
     * 靜音/取消靜音
     */
    public setMuted(muted: boolean): void {
        this._muted = muted;
        if (this.bgmSource) {
            this.bgmSource.volume = muted ? 0 : this.volumeMusic;
        }
    }

    public get isMuted(): boolean {
        return this._muted;
    }
}
