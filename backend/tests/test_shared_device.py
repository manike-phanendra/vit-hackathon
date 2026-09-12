import pytest
from app.routers.farmer import get_farmer_policies
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.models.models import User, Policy, Product

@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()

    user_a = User(user_id="USR-RAMESH", name="Ramesh", role="FARMER", mobile_number="+911111111111")
    user_b = User(user_id="USR-SURESH", name="Suresh", role="FARMER", mobile_number="+912222222222")
    product = Product(product_id="PADDY-01", name="Paddy Shield", crop="Paddy", premium=499, coverage=20000, rainfall_threshold=40, payout_amount=20000)
    
    policy_a = Policy(policy_id="POL-RAMESH-1", user_id="USR-RAMESH", product_id="PADDY-01", crop="Paddy", premium=499, coverage=20000, start_date="2026-06-01", end_date="2026-09-30")
    
    session.add_all([user_a, user_b, product, policy_a])
    session.commit()
    yield session
    session.close()

def test_shared_device_data_isolation(db_session):
    # Query policies for Farmer A (Ramesh)
    policies_a = get_farmer_policies(user_id="USR-RAMESH", db=db_session)
    assert len(policies_a) == 1
    assert policies_a[0]["policy_id"] == "POL-RAMESH-1"

    # Query policies for Farmer B (Suresh) on same device/session context
    policies_b = get_farmer_policies(user_id="USR-SURESH", db=db_session)
    assert len(policies_b) == 0 # Zero leakage of Ramesh's policies
