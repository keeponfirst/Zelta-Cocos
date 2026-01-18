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

    private _bgmVolume: number = 1.0;
    private _sfxVolume: number = 1.0;
    private _muted: boolean = false;

    public static getInstance(): AudioSystem | null {
        return AudioSystem._instance;
    }

    protected onLoad(): void {
        AudioSystem._instance = this;
    }

    protected onDestroy(): void {
        AudioSystem._instance = null;
    }

    /**
     * 播放 BGM
     */
    public playBGM(clipName: string, loop: boolean = true): void {
        // TODO: 實作 BGM 播放
        resources.load(`audio/bgm/${clipName}`, AudioClip, (err, clip) => {
            if (err) {
                console.error('BGM load failed:', err);
                return;
            }
            if (this.bgmSource) {
                this.bgmSource.clip = clip;
                this.bgmSource.loop = loop;
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
    public playSFX(clipName: string): void {
        // TODO: 實作 SFX 播放
        resources.load(`audio/sfx/${clipName}`, AudioClip, (err, clip) => {
            if (err) {
                console.error('SFX load failed:', err);
                return;
            }
            if (this.sfxSource) {
                this.sfxSource.playOneShot(clip, this._sfxVolume);
            }
        });
    }

    /**
     * 設定 BGM 音量
     */
    public setBGMVolume(volume: number): void {
        this._bgmVolume = Math.max(0, Math.min(1, volume));
        if (this.bgmSource) {
            this.bgmSource.volume = this._bgmVolume;
        }
    }

    /**
     * 設定 SFX 音量
     */
    public setSFXVolume(volume: number): void {
        this._sfxVolume = Math.max(0, Math.min(1, volume));
    }

    /**
     * 靜音/取消靜音
     */
    public setMuted(muted: boolean): void {
        this._muted = muted;
        if (this.bgmSource) {
            this.bgmSource.volume = muted ? 0 : this._bgmVolume;
        }
    }

    public get isMuted(): boolean {
        return this._muted;
    }
}
