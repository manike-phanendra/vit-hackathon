from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime, Text, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False, default="FARMER") # FARMER, PROVIDER, ADMIN
    mobile_number = Column(String, unique=True, index=True, nullable=False)
    device_id = Column(String, nullable=True)
    pin_hash = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    policies = relationship("Policy", back_populates="user")

class Provider(Base):
    __tablename__ = "providers"

    provider_id = Column(String, primary_key=True, index=True)
    unique_provider_id = Column(String, unique=True, index=True, nullable=False)
    org_name = Column(String, nullable=False)
    contact_person = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Product(Base):
    __tablename__ = "products"

    product_id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    crop = Column(String, nullable=False)
    premium = Column(Float, nullable=False)
    coverage = Column(Float, nullable=False)
    rainfall_threshold = Column(Float, nullable=False) # e.g. 40.0 mm
    min_oracles = Column(Integer, default=2)
    aggregation = Column(String, default="median") # median, mean
    window_days = Column(Integer, default=7)
    payout_amount = Column(Float, nullable=False)
    status = Column(String, default="ACTIVE")
    created_at = Column(DateTime, default=datetime.utcnow)

    policies = relationship("Policy", back_populates="product")

class Policy(Base):
    __tablename__ = "policies"

    policy_id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.user_id"), nullable=False)
    product_id = Column(String, ForeignKey("products.product_id"), nullable=False)
    crop = Column(String, nullable=False)
    premium = Column(Float, nullable=False)
    coverage = Column(Float, nullable=False)
    start_date = Column(String, nullable=False) # YYYY-MM-DD
    end_date = Column(String, nullable=False)   # YYYY-MM-DD
    status = Column(String, default="ACTIVE")    # ACTIVE, TRIGGERED, EXPIRED, CANCELLED
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="policies")
    product = relationship("Product", back_populates="policies")
    triggers = relationship("TriggerEvent", back_populates="policy")
    payouts = relationship("Payout", back_populates="policy")

class RainfallObservation(Base):
    __tablename__ = "rainfall_observations"

    observation_id = Column(String, primary_key=True, index=True)
    station_id = Column(String, nullable=False, index=True)
    oracle_id = Column(String, nullable=False, index=True) # Oracle A, Oracle B, Oracle C
    timestamp = Column(String, nullable=False) # ISO timestamp
    rainfall_mm = Column(Float, nullable=False)
    quality_status = Column(String, default="HEALTHY") # HEALTHY, DELAYED, ANOMALOUS, STALE
    anomaly_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

class TriggerEvent(Base):
    __tablename__ = "trigger_events"

    event_id = Column(String, primary_key=True, index=True)
    policy_id = Column(String, ForeignKey("policies.policy_id"), nullable=False)
    rule_name = Column(String, nullable=False)
    consensus_rainfall = Column(Float, nullable=False)
    threshold = Column(Float, nullable=False)
    status = Column(String, nullable=False) # TRIGGERED, NO_TRIGGER, REVIEW
    reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    policy = relationship("Policy", back_populates="triggers")
    payouts = relationship("Payout", back_populates="trigger_event")

class Payout(Base):
    __tablename__ = "payouts"
    __table_args__ = (UniqueConstraint('policy_id', 'event_id', name='uq_policy_event'),)

    payout_id = Column(String, primary_key=True, index=True)
    event_id = Column(String, ForeignKey("trigger_events.event_id"), nullable=False)
    policy_id = Column(String, ForeignKey("policies.policy_id"), nullable=False)
    amount = Column(Float, nullable=False)
    idempotency_key = Column(String, unique=True, index=True, nullable=False)
    status = Column(String, default="PAID") # PAID, DUPLICATE_BLOCKED, REJECTED
    created_at = Column(DateTime, default=datetime.utcnow)

    policy = relationship("Policy", back_populates="payouts")
    trigger_event = relationship("TriggerEvent", back_populates="payouts")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    log_id = Column(Integer, primary_key=True, autoincrement=True)
    actor = Column(String, nullable=False)
    action = Column(String, nullable=False)
    timestamp = Column(String, nullable=False)
    event_hash = Column(String, nullable=False)
    previous_hash = Column(String, nullable=False)
    metadata_json = Column(Text, nullable=True)

class SyncQueue(Base):
    __tablename__ = "sync_queue"

    sync_id = Column(String, primary_key=True, index=True)
    device_id = Column(String, nullable=False)
    user_id = Column(String, nullable=False)
    event_type = Column(String, nullable=False)
    payload_json = Column(Text, nullable=False)
    status = Column(String, default="SYNCED") # PENDING, SYNCED, CONFLICT
    retries = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
