const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

// Add this near the top of your file, after the requires
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});

//create express server
const app = express();

//set up port
const PORT = process.env.PORT || 3000;

//set up view engine
app.set("view engine", "ejs");
//set up static files
app.use(express.static("public"));

//set up body parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

// Health check endpoint for debugging deployment
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

//set up route
app.get("/", (req, res) => {
    res.render('index', { success: undefined });  // Add initial render state
});

app.post("/convert-mp3", async(req, res) => {
    let videoID = req.body.videoID;
    
    try {
        if(videoID === undefined || videoID === "" || videoID === null) {
            return res.render("index", {
                success: false,
                error_message: "Please enter a valid YouTube Video ID"
            });
        }
        
        // Extract video ID from URL if it's a full YouTube URL
        if(videoID.includes("youtube.com") || videoID.includes("youtu.be")) {
            const url = new URL(videoID);
            if(videoID.includes("youtube.com")) {
                videoID = url.searchParams.get("v");
            } else if(videoID.includes("youtu.be")) {
                videoID = url.pathname.slice(1);
            }
        }

        if(!videoID) {
            throw new Error("Could not extract video ID");
        }

        const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoID}`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": process.env.API_HOST,
                "x-rapidapi-key": process.env.API_KEY
            }
        }).catch(error => {
            console.error("Fetch Error:", error);
            throw error;
        });

        if(!fetchAPI.ok) {
            throw new Error(`API responded with status: ${fetchAPI.status}`);
        }

        const fetchResponse = await fetchAPI.json();
        
        if(fetchResponse.status === "ok" && fetchResponse.link) {
            return res.render("index", {
                success: true,
                song_title: fetchResponse.title,
                song_link: fetchResponse.link
            });
        } else {
            return res.render("index", {
                success: false,
                error_message: "Failed to convert video. Please check the ID and try again."
            });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.render("index", {
            success: false,
            error_message: "An error occurred while processing your request. Please try again later."
        });
    }
});

//start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});