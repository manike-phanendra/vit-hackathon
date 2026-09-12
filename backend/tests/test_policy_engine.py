import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.models.models import Product
from app.routers.policies import create_product
from app.schemas.schemas import ProductCreate

@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()

def test_declarative_product_creation(db_session):
    new_product_payload = ProductCreate(
        product_id="COTTON_TEST_01",
        name="Cotton Rain Shield",
        crop="Cotton",
        premium=399.0,
        coverage=15000.0,
        rainfall_threshold=35.0,
        min_oracles=2,
        aggregation="median",
        window_days=7,
        payout_amount=15000.0
    )
    prod = create_product(new_product_payload, db_session)
    assert prod.product_id == "COTTON_TEST_01"
    assert prod.rainfall_threshold == 35.0

    # Query from DB to confirm data persistence without code modification
    saved = db_session.query(Product).filter(Product.product_id == "COTTON_TEST_01").first()
    assert saved is not None
    assert saved.crop == "Cotton"
