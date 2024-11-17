<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Spotify Downloader</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --spotify-green: #1DB954;
            --spotify-black: #191414;
            --spotify-light: #1ED760;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(45deg, var(--spotify-black), #0a0a0a);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }

        .spotify-container {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            padding: 40px;
            width: 100%;
            max-width: 500px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }

        .spotify-container:hover {
            transform: scale(1.02);
        }

        .spotify-header {
            text-align: center;
            margin-bottom: 30px;
        }

        .spotify-header h1 {
            font-weight: 600;
            color: var(--spotify-green);
            font-size: 2.5rem;
            margin-bottom: 10px;
        }

        .spotify-input {
            display: flex;
            margin-bottom: 20px;
        }

        .spotify-input input {
            flex-grow: 1;
            padding: 12px 15px;
            border: 2px solid rgba(255,255,255,0.1);
            background: rgba(255,255,255,0.05);
            color: white;
            border-radius: 10px 0 0 10px;
            transition: all 0.3s ease;
        }

        .spotify-input input:focus {
            outline: none;
            border-color: var(--spotify-green);
        }

        .spotify-input button {
            padding: 12px 20px;
            background-color: var(--spotify-green);
            color: white;
            border: none;
            border-radius: 0 10px 10px 0;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .spotify-input button:hover {
            background-color: var(--spotify-light);
        }

        .result-card {
            background: rgba(255,255,255,0.1);
            border-radius: 15px;
            padding: 20px;
            text-align: center;
            margin-top: 20px;
        }

        .track-image {
            width: 250px;
            height: 250px;
            object-fit: cover;
            border-radius: 15px;
            box-shadow: 0 15px 30px rgba(0,0,0,0.3);
            margin-bottom: 20px;
        }

        .download-btn {
            background-color: var(--spotify-green);
            color: white;
            padding: 12px 25px;
            border: none;
            border-radius: 50px;
            text-decoration: none;
            display: inline-block;
            margin-top: 15px;
            transition: all 0.3s ease;
        }

        .download-btn:hover {
            background-color: var(--spotify-light);
            transform: scale(1.05);
        }

        .loading {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            margin-top: 20px;
        }

        .spinner {
            border: 4px solid rgba(255,255,255,0.1);
            border-top: 4px solid var(--spotify-green);
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @media (max-width: 576px) {
            .spotify-container {
                margin: 20px;
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="spotify-container">
        <div class="spotify-header">
            <h1>Spotify Downloader</h1>
            <p>Masukkan URL Spotify Track</p>
        </div>

        <div class="spotify-input">
            <input 
                type="text" 
                id="spotifyUrl" 
                placeholder="Contoh: https://open.spotify.com/track/..."
            >
            <button onclick="downloadTrack()">Download</button>
        </div>

        <div id="loading" class="loading" style="display:none;">
            <div class="spinner"></div>
            <p>Sedang memproses...</p>
        </div>

        <div id="result" style="display:none;" class="result-card">
            <img id="trackImage" class="track-image" src="" alt="Track Image">
            <h3 id="trackTitle"></h3>
            <p id="trackArtist"></p>
            <a id="downloadLink" href="#" class="download-btn">Download Lagu</a>
        </div>
    </div>

    <script>
        async function downloadTrack() {
            const url = document.getElementById('spotifyUrl').value;
            const loading = document.getElementById('loading');
            const result = document.getElementById('result');

            // Reset tampilan
            loading.style.display = 'flex';
            result.style.display = 'none';

            try {
                const response = await fetch(`https://sxt-server2.vercel.app/api/download?url=${encodeURIComponent(url)}`);
                const data = await response.json();

                // Update tampilan
                document.getElementById('trackImage').src = data.result.image;
                document.getElementById('trackTitle').textContent = data.result.title;
                document.getElementById('trackArtist').textContent = data.result.artis;
                
                const downloadLink = document.getElementById('downloadLink');
                downloadLink.href = data.result.download;

                // Sembunyikan loading, tampilkan hasil
                loading.style.display = 'none';
                result.style.display = 'block';

            } catch (error) {
                console.error('Error:', error);
                loading.style.display = 'none';
                alert('Gagal mengambil data. Pastikan URL valid.');
            }
        }
    </script>
</body>
          </html>
