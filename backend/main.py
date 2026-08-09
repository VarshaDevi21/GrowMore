from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
from core.config import settings
from models.schemas import InterviewRequest, InterviewResponse
from services.interview_engine import interview_engine

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("ai-interview-agent")

app = FastAPI(
    title="AI Interview Agent Backend",
    description="Adaptive Technical Interview Engine for 31-Day AI Engineering Cohort",
    version="1.0.0"
)

# CORS Configuration for frontend deployments and local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://grow-more-gules.vercel.app/",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/", tags=["Health"])
async def root():
    """Root endpoint for basic server reachability."""
    return {
        "status": "ok",
        "message": "AI Interview Agent Backend is running",
        "health": "/health",
        "interview_api": "/api/interview",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Basic health check endpoint."""
    return {
        "status": "ok",
        "app": "AI Interview Agent Backend",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT
    }

@app.post("/api/interview", response_model=InterviewResponse, tags=["Interview"])
async def handle_interview_turn(request: InterviewRequest):
    """
    Process a single interview turn.
    Initiates the session or evaluates the candidate's response.
    """
    try:
        response = await interview_engine.process_turn(request)
        return response
    except HTTPException as http_exc:
        # Re-raise explicit HTTP exceptions if any are thrown
        raise http_exc
    except Exception as e:
        logger.error(f"Unhandled error in handle_interview_turn: {e}", exc_info=True)
        # Avoid leaking internal stack trace or secrets
        raise HTTPException(
            status_code=500,
            detail="An internal error occurred while processing the interview turn."
        )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for unexpected server errors."""
    logger.error(f"Unhandled Exception on {request.url}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred."}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )
