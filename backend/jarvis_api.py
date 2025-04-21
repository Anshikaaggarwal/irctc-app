# jarvis_api.py
import os
import datetime
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import webbrowser
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key from environment variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("Warning: GEMINI_API_KEY not found in environment variables.")

# Configure Gemini API if key is available
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# FastAPI app
app = FastAPI(title="Jarvis API", description="Backend API for Jarvis AI Assistant")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Train-related constants
IRCTC_URL = "https://www.irctc.co.in/nget/train-search"
TRAIN_TIMETABLE_URL = "https://www.railyatri.in/time-table"

# Request/Response models
class MessageRequest(BaseModel):
    message: str

class MessageResponse(BaseModel):
    text: str
    action: Optional[str] = None
    actionData: Optional[dict] = None

class MessagesResponse(BaseModel):
    messages: List[dict]

# Helper function to ask Gemini
def ask_gemini(prompt):
    if not GEMINI_API_KEY:
        return "I'm sorry, but the Gemini API key is not configured."
    
    try:
        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error with Gemini API: {e}")
        return f"I encountered an error when trying to use the Gemini API: {str(e)}"

# Extract locations from command
def extract_locations(command):
    locations = []
    if "from" in command and "to" in command:
        # Extract the source and destination
        try:
            command_parts = command.split()
            from_index = command_parts.index("from")
            to_index = command_parts.index("to")
            
            # Extract source (assuming it's the word right after "from")
            if from_index + 1 < len(command_parts) and from_index + 1 < to_index:
                source = command_parts[from_index + 1]
                locations.append(source)
            
            # Extract destination (assuming it's the word right after "to")
            if to_index + 1 < len(command_parts):
                destination = command_parts[to_index + 1]
                locations.append(destination)
        except:
            pass
            
    return locations if len(locations) == 2 else None

# Process command
def process_command(command):
    sites = [("youtube", "https://youtube.com"),
             ("wikipedia", "https://www.wikipedia.org/"),
             ("google", "https://www.google.com")]

    # Exit command
    if any(quit_word in command for quit_word in ["stop", "exit", "quit"]):
        return MessageResponse(text="Goodbye! Click the close button to end our conversation.")

    # Website handling
    for site in sites:
        if f"open {site[0]}" in command:
            return MessageResponse(
                text=f"Opening {site[0]}",
                action="openUrl",
                actionData={"url": site[1]}
            )

    # Time
    if "the time" in command:
        now = datetime.datetime.now()
        return MessageResponse(text=f"The time is {now.strftime('%I:%M %p')}")
        
    # Train ticket booking
    if any(train_cmd in command for train_cmd in ["book train", "train ticket", "train booking"]):
        return MessageResponse(
            text="Opening IRCTC website for ticket booking.",
            action="openUrl",
            actionData={"url": IRCTC_URL}
        )
        
    # Train timetable
    if "train timetable" in command or "train time table" in command:
        return MessageResponse(
            text="Opening train timetable website",
            action="openUrl",
            actionData={"url": TRAIN_TIMETABLE_URL}
        )
        
    # Train timings between stations
    if ("train" in command and "timing" in command) or ("train" in command and "from" in command and "to" in command):
        locations = extract_locations(command)
        if locations:
            search_url = f"https://www.railyatri.in/trains-between-stations?from={locations[0]}&to={locations[1]}"
            return MessageResponse(
                text=f"Searching for trains from {locations[0]} to {locations[1]}",
                action="openUrl",
                actionData={"url": search_url}
            )
        else:
            # Ask Gemini about general train information
            response = ask_gemini(command)
            return MessageResponse(text=response)

    # If it's a general or AI-related query
    if any(word in command for word in ["ai", "intelligence", "explain", "tell me", "what is", "how to"]):
        response = ask_gemini(command)
        return MessageResponse(text=response)

    # Fallback to Gemini for general queries
    response = ask_gemini(command)
    return MessageResponse(text=response)

# API endpoints
@app.get("/")
async def root():
    return {"message": "Welcome to Jarvis API"}

@app.post("/api/message", response_model=MessageResponse)
async def handle_message(request: MessageRequest):
    if not request.message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    return process_command(request.message.lower())

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("jarvis_api:app", host="0.0.0.0", port=port)