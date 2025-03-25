# YouTube to MP3 Converter

A simple web application that allows users to convert YouTube videos to MP3 format with a clean, modern interface.

## Features

- Convert YouTube videos to MP3 format
- Simple and intuitive user interface
- High-quality audio conversion
- Direct download links

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/LizaliseNzo/youtube-to-mp3.git
   cd youtube-to-mp3
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   touch .env
   ```

4. Get API credentials:
   - Sign up for a free account at [RapidAPI](https://rapidapi.com/)
   - Subscribe to the [YouTube MP3 Converter API](https://rapidapi.com/ytjar/api/youtube-mp36)
   - Copy your API key from the RapidAPI dashboard

5. Add your API credentials to the `.env` file:
   ```
   API_KEY=your_rapidapi_key_here
   API_HOST=youtube-mp36.p.rapidapi.com
   PORT=3000
   ```

## Running the Application

1. Start the server:
   ```
   npm start
   ```
   
   For development with auto-restart:
   ```
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## How to Use

1. Paste a YouTube URL or video ID in the input field
2. Click the "Convert" button
3. Wait for the conversion to complete
4. Click the "Download" button to download your MP3 file

## Troubleshooting

- **API Error**: Make sure your RapidAPI key is correct and your subscription is active
- **Conversion Fails**: Some videos may be restricted and cannot be converted
- **App Crashes**: Check your .env file has correct values and ensure your RapidAPI subscription is active

## Technology Stack

- Node.js
- Express.js
- EJS Templating
- RapidAPI for YouTube conversion

## License

This project is licensed under the MIT License - see the LICENSE file for details.