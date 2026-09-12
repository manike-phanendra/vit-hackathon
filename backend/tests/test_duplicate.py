import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.models.models import User, Product, Policy, TriggerEvent
from app.engines.payout import process_idempotent_payout

@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()

    user = User(user_id="USR-TEST", name="Test Farmer", role="FARMER", mobile_number="+910000000000")
    product = Product(product_id="PROD-TEST", name="Test Product", crop="Paddy", premium=100, coverage=1000, rainfall_threshold=40, payout_amount=1000)
    policy = Policy(policy_id="POL-TEST", user_id="USR-TEST", product_id="PROD-TEST", crop="Paddy", premium=100, coverage=1000, start_date="2026-01-01", end_date="2026-12-31")
    event = TriggerEvent(event_id="EVT-TEST", policy_id="POL-TEST", rule_name="Test Rule", consensus_rainfall=25, threshold=40, status="TRIGGERED")
    
    session.add_all([user, product, policy, event])
    session.commit()
    yield session
    session.close()

def test_idempotent_payout_blocks_duplicate(db_session):
    # First attempt: Should succeed
    res1 = process_idempotent_payout(db_session, event_id="EVT-TEST", policy_id="POL-TEST", amount=1000.0)
    assert res1["status"] == "SUCCESS"
    assert res1["amount"] == 1000.0

    # Second attempt with same event: Should be blocked cleanly
    res2 = process_idempotent_payout(db_session, event_id="EVT-TEST", policy_id="POL-TEST", amount=1000.0)
    assert res2["status"] == "DUPLICATE_BLOCKED"
    assert "blocked" in res2["message"].lower()
