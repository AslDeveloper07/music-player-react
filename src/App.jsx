import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Plus,
  Sun,
  Moon,
  VolumeX,
  Volume1,
  ListMusic,
  X,
  Heart,
  Shuffle,
  Repeat,
  Mic2,
  Music2,
  Clock,
} from "lucide-react";

export default function MusicPlayer() {
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [darkMode, setDarkMode] = useState(true);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [activeTab, setActiveTab] = useState("tracks");
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const volumeSliderRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        volumeSliderRef.current &&
        !volumeSliderRef.current.contains(event.target) &&
        !event.target.closest(".volume-icon")
      ) {
        setShowVolumeSlider(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(() => {});
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (songs.length === 0) return;

    if (repeatMode === 2) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
      return;
    }

    let nextIndex;
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * songs.length);
    } else {
      nextIndex = (currentSongIndex + 1) % songs.length;
    }

    setCurrentSongIndex(nextIndex);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (songs.length === 0) return;

    let prevIndex;
    if (isShuffled) {
      prevIndex = Math.floor(Math.random() * songs.length);
    } else {
      prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    }

    setCurrentSongIndex(prevIndex);
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
      src: URL.createObjectURL(file),
      cover:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
      artist: "Unknown Artist",
      duration: "3:45",
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

  const toggleMute = () => {
    setVolume(volume > 0 ? 0 : 0.8);
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX size={20} />;
    if (volume < 0.5) return <Volume1 size={20} />;
    return <Volume2 size={20} />;
  };

  const toggleRepeatMode = () => {
    setRepeatMode((prev) => (prev + 1) % 3);
  };

  const handleEnded = () => {
    if (repeatMode === 2) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } else {
      handleNext();
    }
  };

  return (
    <div
      className={`${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 text-gray-900"
      } h-screen flex flex-col overflow-hidden transition-colors duration-500 relative`}
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`${
          darkMode ? "bg-black/20" : "bg-white/50"
        } flex items-center justify-between px-6 py-4 backdrop-blur-xl border-b ${
          darkMode ? "border-gray-800" : "border-gray-200"
        } rounded-b-2xl mx-4 mt-2 z-10`}
      >
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <Music2 size={16} className="text-white" />
            </div>
          </div>
          <motion.h1
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
          >
            Harmony Pro
          </motion.h1>
        </motion.div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${
              darkMode ? "hover:bg-gray-800/50" : "hover:bg-gray-300/50"
            } transition-all`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPlaylist(!showPlaylist)}
            className={`p-2 rounded-full ${
              darkMode ? "hover:bg-gray-800/50" : "hover:bg-gray-300/50"
            } transition-all`}
          >
            <ListMusic size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl transition-all text-sm shadow-lg hover:shadow-xl"
          >
            <Plus size={16} />
            <span>Add Music</span>
          </motion.button>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </motion.nav>

      <div className="flex flex-1 overflow-hidden px-4 pb-4 pt-2 z-10">
        {/* Playlist */}
        <AnimatePresence>
          {showPlaylist && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`${
                darkMode ? "bg-black/30" : "bg-white/50"
              } w-80 p-4 flex flex-col rounded-2xl backdrop-blur-xl ${
                darkMode ? "border border-gray-800" : "border border-gray-200"
              } mr-4 shadow-xl`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Library</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowPlaylist(false)}
                  className={`p-1.5 rounded-full ${
                    darkMode ? "hover:bg-gray-800/50" : "hover:bg-gray-300/50"
                  } transition-all`}
                >
                  <X size={18} />
                </motion.button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-4">
                {["tracks", "artists", "albums", "playlists"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab
                        ? darkMode
                          ? "bg-gray-800 text-white"
                          : "bg-gray-200 text-gray-900"
                        : darkMode
                        ? "text-gray-400 hover:text-white"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {songs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col items-center justify-center text-gray-400 text-center p-4"
                >
                  <div className="text-5xl mb-4 opacity-30">♪</div>
                  <p>No music added yet</p>
                  <p className="text-sm mt-2">
                    Click "Add Music" to get started
                  </p>
                </motion.div>
              ) : (
                <ul className="flex-1 overflow-y-auto divide-y divide-gray-700">
                  {songs.map((song, idx) => (
                    <motion.li
                      key={song.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => {
                        setCurrentSongIndex(idx);
                        setIsPlaying(true);
                      }}
                      className={`p-3 cursor-pointer flex items-center gap-3 rounded-xl transition-all group ${
                        idx === currentSongIndex
                          ? `${
                              darkMode ? "bg-blue-500/30" : "bg-blue-400/30"
                            } shadow-md`
                          : `${
                              darkMode
                                ? "hover:bg-gray-800/40"
                                : "hover:bg-gray-300/40"
                            }`
                      }`}
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shadow">
                          <img
                            src={song.cover}
                            alt={song.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        {idx === currentSongIndex && isPlaying && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium text-sm">
                          {song.title}
                        </p>
                        <p className="truncate text-xs opacity-70">
                          {song.artist}
                        </p>
                      </div>
                      <div className="text-xs opacity-50 flex items-center gap-1">
                        <Clock size={12} />
                        {song.duration}
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
          {/* Visualizer Effect */}
          <AnimatePresence>
            {isPlaying && (
              <div className="absolute top-0 left-0 right-0 h-40 overflow-hidden opacity-10">
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute bottom-0 w-2 bg-blue-400 rounded-t-lg"
                    initial={{ height: "10px" }}
                    animate={{
                      height: [
                        `${Math.random() * 60 + 20}px`,
                        `${Math.random() * 80 + 40}px`,
                        `${Math.random() * 40 + 10}px`,
                      ],
                    }}
                    transition={{
                      duration: 1 + Math.random() * 1,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    style={{
                      left: `${i * 7}%`,
                    }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Album Art */}
          <motion.div
            className="mb-8 relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            key={currentSongIndex}
            transition={{ duration: 0.5 }}
          >
            {currentSong.cover ? (
              <motion.div
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{
                  rotate: {
                    repeat: isPlaying ? Infinity : 0,
                    duration: 15,
                    ease: "linear",
                  },
                }}
                className="w-72 h-72 rounded-[100%] overflow-hidden shadow-2xl border-4 border-white/10"
              >
                <img
                  src={currentSong.cover}
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ) : (
              <div className="w-72 h-72 rounded-3xl bg-gradient-to-br from-blue-400/20 to-purple-400/20 flex items-center justify-center shadow-2xl backdrop-blur-md border-4 border-white/10">
                <div className="text-6xl opacity-40">♪</div>
              </div>
            )}

            {/* Floating notes animation when playing */}
            <AnimatePresence>
              {isPlaying && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 0, x: 0 }}
                    animate={{ opacity: [0, 1, 0], y: -40, x: -20 }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                    className="absolute top-0 left-0 text-2xl"
                  >
                    ♪
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 0, x: 0 }}
                    animate={{ opacity: [0, 1, 0], y: -60, x: 20 }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                    className="absolute top-0 right-0 text-2xl"
                  >
                    ♫
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 0, x: 0 }}
                    animate={{ opacity: [0, 1, 0], y: -50, x: -10 }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    className="absolute bottom-0 left-10 text-xl"
                  >
                    ♩
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Song Info */}
          <div className="text-center mb-8">
            <motion.h2
              className="text-3xl font-bold mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {currentSong.title || "No song selected"}
            </motion.h2>
            <motion.p
              className="text-lg text-gray-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {currentSong.artist || "Unknown Artist"}
            </motion.p>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <motion.footer
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`${
          darkMode ? "bg-black/30" : "bg-white/50"
        } p-5 mx-4 mb-4 rounded-2xl backdrop-blur-xl border ${
          darkMode ? "border-gray-800" : "border-gray-200"
        } shadow-lg z-10`}
      >
        {/* Progress Bar */}
        <div className="mb-5">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(audioRef.current?.duration || 0)}</span>
          </div>
          <div className="relative h-1.5 bg-gray-600/30 rounded-full overflow-hidden">
            <motion.div
              className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              animate={{
                width: `${
                  (currentTime / (audioRef.current?.duration || 1)) * 100
                }%`,
              }}
              transition={{ duration: 0.2 }}
            ></motion.div>

            {/* Progress indicator circle */}
            <motion.div
              className="absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-lg -mt-2 -ml-2 cursor-pointer"
              animate={{
                left: `${
                  (currentTime / (audioRef.current?.duration || 1)) * 100
                }%`,
              }}
              transition={{ duration: 0.2 }}
            />
            <input
              type="range"
              min="0"
              max={audioRef.current?.duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          {/* Left side: Song info and volume */}
          <div className="flex items-center gap-4">
            {/* Mini album art */}
            {currentSong.cover && (
              <div className="w-14 h-14 rounded-xl overflow-hidden shadow">
                <img
                  src={currentSong.cover}
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Song title for mobile */}
            <div className="hidden md:block">
              <h3 className="font-medium text-sm truncate max-w-xs">
                {currentSong.title || "No song selected"}
              </h3>
              <p className="text-xs text-gray-400">
                {currentSong.artist || "Unknown Artist"}
              </p>
            </div>
          </div>

          {/* Center: Playback controls */}
          <div className="flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsShuffled(!isShuffled)}
              className={`p-2.5 rounded-full ${
                isShuffled
                  ? "text-blue-400 bg-blue-400/10"
                  : darkMode
                  ? "text-gray-400 hover:text-white hover:bg-white/10"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-400/10"
              } transition-all`}
            >
              <Shuffle size={18} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrev}
              disabled={songs.length === 0}
              className={`p-2.5 rounded-full ${
                darkMode
                  ? "text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-400/10 disabled:opacity-30"
              } transition-all`}
            >
              <SkipBack size={20} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePlayPause}
              disabled={songs.length === 0}
              className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-full shadow-md disabled:opacity-30 transition-all transform hover:shadow-lg"
            >
              {isPlaying ? (
                <Pause size={24} />
              ) : (
                <Play size={24} className="ml-0.5" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              disabled={songs.length === 0}
              className={`p-2.5 rounded-full ${
                darkMode
                  ? "text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-400/10 disabled:opacity-30"
              } transition-all`}
            >
              <SkipForward size={20} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleRepeatMode}
              className={`p-2.5 rounded-full relative ${
                repeatMode === 0
                  ? darkMode
                    ? "text-gray-400 hover:text-white hover:bg-white/10"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-400/10"
                  : repeatMode === 1
                  ? "text-blue-400 bg-blue-400/10"
                  : "text-purple-400 bg-purple-400/10"
              } transition-all`}
            >
              <Repeat size={18} />
              {repeatMode === 2 && (
                <span className="absolute -top-1 -right-1 text-xs bg-purple-400 text-white rounded-full w-4 h-4 flex items-center justify-center">
                  1
                </span>
              )}
            </motion.button>
          </div>

          {/* Right side: Volume controls */}
          <div className="flex items-center gap-3">
            <div className="relative" ref={volumeSliderRef}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMute}
                className="volume-icon p-2 rounded-full hover:bg-white/10 transition-all"
              >
                {getVolumeIcon()}
              </motion.button>

              {/* Volume slider that appears on hover */}
              <div
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-24 h-8 flex items-center justify-center"
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <AnimatePresence>
                  {showVolumeSlider && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={`${
                        darkMode ? "bg-gray-800" : "bg-white"
                      } p-2 rounded-xl shadow-lg`}
                    >
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-20 h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Always visible volume slider */}
            <div className="w-24 hidden md:block">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-gray-600/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="md:hidden p-2 rounded-full hover:bg-white/10 transition-all"
            >
              <ListMusic size={18} />
            </motion.button>
          </div>
        </div>
      </motion.footer>

      <audio ref={audioRef} src={currentSong.src} onEnded={handleEnded} />
    </div>
  );
}