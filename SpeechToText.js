import React, { useState, useEffect } from "react";

// Check if browser supports SpeechRecognition
const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = "bn-BD"; // Set to Bangla (Bengali) language

function App() {
    const [isListening, setIsListening] = useState(false);
    const [note, setNote] = useState("");
    const [transliteration, setTransliteration] = useState("");

    useEffect(() => {
        handleListen();
    }, [isListening]);

    const handleListen = () => {
        if (isListening) {
            mic.start();
            mic.onend = () => {
                console.log("continue..");
                mic.start();
            };
        } else {
            mic.stop();
            mic.onend = () => {
                console.log("Stopped Mic on Click");
            };
        }

        mic.onstart = () => {
            console.log("Mics on");
        };

        mic.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map((result) => result[0])
                .map((result) => result.transcript)
                .join("");
            console.log(transcript);
            setNote(transcript);
            setTransliteration(transliterate(transcript));
            mic.onerror = (event) => {
                console.log(event.error);
            };
        };
    };

    const transliterate = (text) => {
        // Basic transliteration function. This is a placeholder and can be improved.
        return text
            .split("")
            .map((char) => {
                if (char === "অ") return "ô";
                if (char === "আ") return "a";
                if (char === "ই") return "i";
                // Add more transliteration rules as needed
                return char;
            })
            .join("");
    };

    const copyToClipboard = () => {
        if (note) {
            navigator.clipboard
                .writeText(note)
                .then(() => {
                    alert("Text copied to clipboard!");
                })
                .catch((err) => {
                    console.error("Failed to copy text: ", err);
                });
        }
    };

    return (
        <div className="container">
            <h1>বাংলা ভয়েস নোটস</h1>
            <div className="box">
                <label htmlFor="note">বাংলা নোট:</label>
                <textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
                <div className="controls">
                    {isListening ? <span>🎙️</span> : <span>🛑🎙️</span>}
                    <button onClick={() => setIsListening((prevState) => !prevState)}>
                        {isListening ? "Stop" : "Start"} Listening
                    </button>
                    <button onClick={copyToClipboard} disabled={!note}>
                        Copy to Clipboard
                    </button>
                </div>
                <p className="transliteration">{transliteration}</p>
            </div>
            <style jsx="true">{`
        @import url("https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali&display=swap");

        body {
          font-family: "Noto Serif Bengali", serif;
          background-color: #f9f9f9;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }

        .container {
          text-align: center;
          width: 80%;
          max-width: 600px;
          padding: 20px;
          background: #ffffff;
          border: 1px solid #ccc;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }

        h1 {
          font-size: 2em;
          margin-bottom: 20px;
        }

        .box {
          border: 1px solid #ddd;
          padding: 20px;
          border-radius: 10px;
          background: #f1f1f1;
          margin-top: 20px;
        }

        label {
          display: block;
          margin-bottom: 10px;
          font-size: 1.2em;
        }

        textarea {
          width: 100%;
          height: 100px;
          padding: 10px;
          font-size: 1em;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-family: "Noto Serif Bengali", serif;
        }

        .controls {
          margin-top: 20px;
        }

        button {
          background-color: #4caf50;
          color: white;
          border: none;
          padding: 10px 20px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          margin: 5px;
          border-radius: 5px;
          cursor: pointer;
        }

        button:hover {
          background-color: #45a049;
        }

        .transliteration {
          margin-top: 20px;
          font-size: 1.2em;
        }
      `}</style>
        </div>
    );
}

export default App;
