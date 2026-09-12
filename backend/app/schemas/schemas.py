from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# Authentication
class SendOTPRequest(BaseModel):
    mobile_number: str
    device_id: Optional[str] = None

class SendOTPResponse(BaseModel):
    status: str
    message: str
    otp_demo: str = "123456" # Demo OTP

class VerifyOTPRequest(BaseModel):
    mobile_number: str
    otp: str
    device_id: Optional[str] = None

class ProviderLoginRequest(BaseModel):
    unique_provider_id: str
    password: str

class ProviderRegisterRequest(BaseModel):
    org_name: str
    contact_person: str
    email: str
    password: str

class ProviderRegisterResponse(BaseModel):
    status: str
    unique_provider_id: str
    message: str

class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    role: str
    name: str

# Products
class ProductCreate(BaseModel):
    product_id: str
    name: str
    crop: str
    premium: float
    coverage: float
    rainfall_threshold: float
    min_oracles: int = 2
    aggregation: str = "median"
    window_days: int = 7
    payout_amount: float

class ProductResponse(ProductCreate):
    status: str
    created_at: Any

# Policies
class PolicyCreate(BaseModel):
    user_id: str
    product_id: str
    start_date: str
    end_date: str

class PolicyResponse(BaseModel):
    policy_id: str
    user_id: str
    product_id: str
    crop: str
    premium: float
    coverage: float
    start_date: str
    end_date: str
    status: str
    created_at: Any

# Oracles & Observations
class OracleReading(BaseModel):
    oracle_id: str
    station_id: str
    rainfall_mm: float
    timestamp: Optional[str] = None

class MultiOracleObservationRequest(BaseModel):
    station_id: str
    readings: List[OracleReading]

class ConsensusResult(BaseModel):
    station_id: str
    consensus_mm: float
    valid_oracles: List[str]
    flagged_oracles: List[Dict[str, Any]]
    confidence: str # HIGH, MEDIUM, LOW

# Triggers & Payouts
class TriggerEvaluationRequest(BaseModel):
    policy_id: str
    rainfall_readings: List[OracleReading]

class TriggerEvaluationResponse(BaseModel):
    event_id: str
    policy_id: str
    consensus_rainfall: float
    threshold: float
    status: str # TRIGGERED, NO_TRIGGER, REVIEW
    reason: str
    payout_status: Optional[str] = None
    payout_amount: Optional[float] = None

class PayoutReconstructionResponse(BaseModel):
    payout_id: str
    policy_id: str
    event_id: str
    farmer_name: str
    crop: str
    rainfall_mm: float
    threshold_mm: float
    consensus_method: str
    oracle_breakdown: List[Dict[str, Any]]
    rule_evaluated: str
    eligibility_checks: Dict[str, bool]
    duplicate_check_passed: bool
    payout_amount: float
    decision: str
    timestamp: str

# Sync
class SyncItem(BaseModel):
    event_id: str
    event_type: str
    payload: Dict[str, Any]
    device_version: int = 1

class BatchSyncRequest(BaseModel):
    device_id: str
    user_id: str
    events: List[SyncItem]

class BatchSyncResponse(BaseModel):
    status: str
    synced_count: int
    rejected_count: int
    details: List[Dict[str, Any]]
