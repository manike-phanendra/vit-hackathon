from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, farmer, provider, policies, triggers, payouts, oracles, sync, health
from app.seed.seed_data import seed_database

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="KrishiShield API",
    description="Offline-First Parametric Micro-Insurance Platform for Low-Connectivity Farmers (FS-2604)",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(farmer.router)
app.include_router(provider.router)
app.include_router(policies.router)
app.include_router(triggers.router)
app.include_router(payouts.router)
app.include_router(oracles.router)
app.include_router(sync.router)
app.include_router(health.router)

@app.on_event("startup")
def startup_event():
    seed_database()

@app.get("/")
def root():
    return {
        "title": "KrishiShield Parametric Insurance API",
        "tagline": "When the network disappears, protection shouldn't.",
        "status": "ONLINE",
        "docs": "/docs"
    }
