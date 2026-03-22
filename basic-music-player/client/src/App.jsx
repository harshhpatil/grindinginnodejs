import { useEffect, useRef, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5001";

function App() {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const audioRef = useRef(null);

  useEffect(() => {
    async function fetchAlbums() {
      try {
        const res = await axios.get(`${API_BASE}/albums`);
        setAlbums(res.data);
      } catch (err) {
        setError("Could not load albums. Is backend running?");
      } finally {
        setLoading(false);
      }
    }

    fetchAlbums();
  }, []);

  useEffect(() => {
    if (!currentSong || !audioRef.current) return;

    const audio = audioRef.current;
    audio.load();
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [currentSong]);

  async function openAlbum(albumId) {
    try {
      const res = await axios.get(`${API_BASE}/albums/${albumId}`);
      setSelectedAlbum(res.data);
      setCurrentSong(null);
      setIsPlaying(false);
    } catch (err) {
      setError("Could not load selected album.");
    }
  }

  function playSong(song) {
    setCurrentSong(song);
  }

  function togglePlayPause() {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }

  return (
    <div className="app">
      <h1>Simple MERN Music Player</h1>

      {loading && <p>Loading albums...</p>}
      {error && <p className="error">{error}</p>}

      <div className="layout">
        <section>
          <h2>Albums</h2>
          <div className="album-list">
            {albums.map((item) => (
              <button
                key={item._id}
                className={`album-card ${selectedAlbum?._id === item._id ? "active" : ""}`}
                onClick={() => openAlbum(item._id)}
              >
                <img src={`${API_BASE}${item.cover}`} alt={item.album} />
                <p><strong>{item.album}</strong></p>
                <p>{item.singer}</p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2>Songs</h2>
          {!selectedAlbum && <p>Select an album to view songs.</p>}

          {selectedAlbum && (
            <ul className="song-list">
              {selectedAlbum.songs.map((song) => (
                <li key={song.file}>
                  <button
                    className={currentSong?.file === song.file ? "song active" : "song"}
                    onClick={() => playSong(song)}
                  >
                    {song.title}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="player">
        <h2>Now Playing</h2>
        <p>{currentSong ? currentSong.title : "No song selected"}</p>
        <button onClick={togglePlayPause} disabled={!currentSong}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <audio
          ref={audioRef}
          controls
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        >
          {currentSong && <source src={`${API_BASE}${currentSong.file}`} type="audio/mpeg" />}
          Your browser does not support audio.
        </audio>
      </section>
    </div>
  );
}

export default App;
