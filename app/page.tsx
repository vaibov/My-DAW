"use client";
import React, { useState, useEffect } from "react";
import { AudioEngine } from "@/engine/AudioEngine";
import Visualizer from "@/components/Visualizer";
import { Play, Square, Upload, Volume2 } from "lucide-react";

export default function NeonDAW() {
  const [engine, setEngine] = useState<AudioEngine | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
    // Initialize the engine only on the client side
    setEngine(new AudioEngine());
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && engine) {
      setFileName(file.name);
      await engine.loadFile(file);
      engine.play();
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (!engine || !fileName) return;
    if (isPlaying) {
      engine.stop();
    } else {
      engine.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    engine?.setVolume(val);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex justify-between items-center border-b border-zinc-800 pb-6">
          <h1 className="text-3xl font-bold tracking-tighter text-purple-500">
            NEON_DAW
          </h1>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer bg-zinc-900 hover:bg-zinc-800 px-4 py-2 rounded-md border border-zinc-700 flex items-center gap-2 transition-all">
              <Upload size={18} />
              <span>{fileName ? "Change Track" : "Upload Audio"}</span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept="audio/*"
              />
            </label>
          </div>
        </header>

        <main className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 backdrop-blur-sm">
          <Visualizer analyser={engine?.analyser || null} />

          <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                disabled={!fileName}
                className="w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPlaying ? (
                  <Square fill="white" size={24} />
                ) : (
                  <Play fill="white" size={24} className="ml-1" />
                )}
              </button>
              <div>
                <p className="text-sm text-zinc-400 uppercase tracking-widest font-semibold">
                  Current Track
                </p>
                <p className="text-lg font-medium truncate max-w-[200px]">
                  {fileName || "No file loaded"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-zinc-900 p-4 rounded-lg border border-zinc-800 w-full md:w-auto">
              <Volume2 size={20} className="text-zinc-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-32 accent-purple-500"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
