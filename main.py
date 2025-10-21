# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import chat_routes
# from routes.ad_routes import router as ad_router
app = FastAPI(title="Reva AI - Common Crawl LLM Backend (Streaming)")

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# Mount routes
app.include_router(chat_routes.router)
# app.include_router(ad_router)


@app.get("/")
async def root():
    return {"message": "Reva AI backend is running. Use /chat or /chat/stream."}
