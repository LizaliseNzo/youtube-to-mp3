const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

// Add this near the top of your file, after the requires
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});

// Validate required environment variables
const API_KEY = process.env.API_KEY;
const API_HOST = process.env.API_HOST || "youtube-mp36.p.rapidapi.com";

if (!API_KEY) {
    console.warn('Warning: API_KEY environment variable is not set. API calls will fail.');
}

//create express server
const app = express();

//set up port
const PORT = process.env.PORT || 3000;

//set up view engine
app.set("view engine", "ejs");
//set up static files
app.use(express.static("public"));

//set up body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        error: 'Something went wrong! Please try again later.',
        details: process.env.NODE_ENV === 'development' ? err.message : null
    });
});

// Health check endpoint for debugging deployment
app.get('/ping', (req, res) => {
    res.status(200).send('pong');
});

// Environment check endpoint for debugging
app.get('/env-check', (req, res) => {
    res.status(200).json({
        apiKeySet: !!API_KEY,
        apiHostSet: !!API_HOST,
        nodeEnv: process.env.NODE_ENV || 'not set'
    });
});

//set up route
app.get("/", (req, res) => {
    res.render('index', { success: undefined });  // Add initial render state
});

app.post("/convert-mp3", async(req, res) => {
    let videoID = req.body.videoID;
    
    try {
        // Validate API key is available
        if (!API_KEY) {
            return res.render("index", {
                success: false,
                error_message: "API configuration error. Please contact the administrator."
            });
        }

        if(videoID === undefined || videoID === "" || videoID === null) {
            return res.render("index", {
                success: false,
                error_message: "Please enter a valid YouTube Video ID"
            });
        }
        
        // Extract video ID from URL if it's a full YouTube URL
        if(videoID.includes("youtube.com") || videoID.includes("youtu.be")) {
            try {
                const url = new URL(videoID);
                if(videoID.includes("youtube.com")) {
                    videoID = url.searchParams.get("v");
                } else if(videoID.includes("youtu.be")) {
                    videoID = url.pathname.slice(1);
                }
            } catch (urlError) {
                console.error("URL parsing error:", urlError);
                return res.render("index", {
                    success: false,
                    error_message: "Invalid YouTube URL format"
                });
            }
        }

        if(!videoID) {
            return res.render("index", {
                success: false,
                error_message: "Could not extract video ID from the provided URL"
            });
        }

        console.log(`Attempting API request for video ID: ${videoID}`);
        
        try {
            const fetchAPI = await fetch(`https://${API_HOST}/dl?id=${videoID}`, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": API_HOST,
                    "x-rapidapi-key": API_KEY
                }
            });

            if(!fetchAPI.ok) {
                console.error(`API error: ${fetchAPI.status} ${fetchAPI.statusText}`);
                return res.render("index", {
                    success: false,
                    error_message: `API error: ${fetchAPI.status}. Please try again later.`
                });
            }

            const fetchResponse = await fetchAPI.json();
            console.log("API response:", JSON.stringify(fetchResponse).slice(0, 200) + "...");
            
            if(fetchResponse.status === "ok" && fetchResponse.link) {
                return res.render("index", {
                    success: true,
                    song_title: fetchResponse.title,
                    song_link: fetchResponse.link
                });
            } else {
                return res.render("index", {
                    success: false,
                    error_message: fetchResponse.msg || "Failed to convert video. Please check the ID and try again."
                });
            }
        } catch (apiError) {
            console.error("API request error:", apiError);
            return res.render("index", {
                success: false,
                error_message: "Error contacting the conversion service. Please try again later."
            });
        }
    } catch (error) {
        console.error("General error:", error);
        return res.render("index", {
            success: false,
            error_message: "An error occurred while processing your request. Please try again later."
        });
    }
});

// 404 handler - keep this before the global error handler
app.use((req, res, next) => {
    res.status(404).render('index', { 
        success: false, 
        error_message: "Page not found. Please try the converter on the home page."
    });
});

//start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API_KEY configured: ${!!API_KEY}`);
    console.log(`API_HOST configured: ${API_HOST}`);
});