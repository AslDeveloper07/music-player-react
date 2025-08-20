import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Volume2, Plus } from "lucide-react";

export default function MusicPlayer() {
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  const currentSong = songs[currentSongIndex] || {};

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    const updateTime = () => setCurrentTime(audio.currentTime);
    audio.addEventListener("timeupdate", updateTime);
    if (isPlaying) audio.play().catch(() => {});
    return () => audio.removeEventListener("timeupdate", updateTime);
  }, [currentSongIndex, isPlaying, volume]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(() => {});
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (songs.length === 0) return;
    setCurrentSongIndex((i) => (i + 1) % songs.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (songs.length === 0) return;
    setCurrentSongIndex((i) => (i - 1 + songs.length) % songs.length);
    setIsPlaying(true);
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newSongs = files.map((file, idx) => ({
      id: songs.length + idx + 1,
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Local File",
      src: URL.createObjectURL(file),
      cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
    }));
    setSongs((prev) => [...prev, ...newSongs]);
    if (songs.length === 0) {
      setCurrentSongIndex(0);
      setIsPlaying(true);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
      {/* Background Image with Blur */}
      {currentSong.cover && (
        <div
          className="fixed inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${currentSong.cover})` }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-3xl"></div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 overflow-hidden">
        {/* Playlist Sidebar */}
        <div className="w-64 bg-black/40 backdrop-blur-xl p-4 flex flex-col border-r border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Playlist</h2>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Plus size={18} />
              <span>Add Music</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {songs.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-center p-4">
              <p>No music added yet. Click the "Add Music" button to get started.</p>
            </div>
          ) : (
            <ul className="flex-1 overflow-y-auto space-y-2 pr-2">
              {songs.map((song, idx) => (
                <motion.li
                  key={song.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setCurrentSongIndex(idx)}
                  className={`p-3 rounded-lg cursor-pointer transition-all flex items-center ${
                    idx === currentSongIndex
                      ? "bg-blue-600/30 backdrop-blur border border-blue-500/50"
                      : "hover:bg-white/10"
                  }`}
                >
                  <div className="w-10 h-10 bg-blue-700/30 rounded-md flex items-center justify-center mr-3">
                    {idx === currentSongIndex && isPlaying ? (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-2 h-2 bg-blue-400 rounded-full"
                      />
                    ) : (
                      <span className="text-sm">{idx + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${idx === currentSongIndex ? "text-blue-300" : ""}`}>
                      {song.title}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </div>

        {/* Player Main Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
          {/* Album Art with Rotation */}
          <div className="mb-8 relative">
            {currentSong.cover ? (
              <motion.div
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{
                  rotate: {
                    repeat: isPlaying ? Infinity : 0,
                    duration: 10,
                    ease: "linear"
                  }
                }}
                className="w-64 h-64 rounded-full overflow-hidden shadow-2xl"
              >
                <img
                  src={currentSong.cover}
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ) : (
              <div className="w-64 h-64 rounded-full bg-gray-800/50 flex items-center justify-center shadow-2xl border-2 border-gray-700/50">
                <div className="text-5xl text-gray-600">♪</div>
              </div>
            )}

            {/* Glow effect when playing */}
            {isPlaying && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl -z-10"
              />
            )}
          </div>

          {/* Song Info */}
          <div className="text-center mb-8 w-full max-w-xl">
            <motion.h2
              key={currentSong.title || "empty"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold mb-2 truncate"
            >
              {currentSong.title || "No song selected"}
            </motion.h2>
            <motion.p
              key={currentSong.artist || "empty"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-gray-400 text-lg"
            >
              {currentSong.artist || "Add music to begin"}
            </motion.p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-xl mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(audioRef.current?.duration || 0)}</span>
            </div>
            <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
              <input
                type="range"
                min="0"
                max={audioRef.current?.duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="absolute w-full h-full opacity-0 cursor-pointer z-20"
              />
              <div className="absolute w-full h-full bg-gray-700 rounded-full"></div>
              <motion.div
                className="absolute h-full bg-blue-600 rounded-full"
                animate={{
                  width: `${(currentTime / (audioRef.current?.duration || 1)) * 100}%`,
                }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-6 mb-8">
            <button
              onClick={handlePrev}
              disabled={songs.length === 0}
              className="p-3 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <SkipBack size={28} />
            </button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={togglePlayPause}
              disabled={songs.length === 0}
              className="p-4 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} />}
            </motion.button>

            <button
              onClick={handleNext}
              disabled={songs.length === 0}
              className="p-3 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <SkipForward size={28} />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-3 w-full max-w-xs">
            <Volume2 size={20} className="text-gray-400" />
            <div className="relative flex-1 h-2 bg-gray-700 rounded-full">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="absolute w-full h-full opacity-0 cursor-pointer z-20"
              />
              <div className="absolute w-full h-full bg-gray-700 rounded-full"></div>
              <motion.div
                className="absolute h-full bg-white rounded-full"
                animate={{ width: `${volume * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={currentSong.src} onEnded={handleNext} />
    </div>
  );
}