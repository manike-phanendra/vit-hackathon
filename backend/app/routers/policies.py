import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Product, Policy
from app.schemas.schemas import ProductCreate, ProductResponse, PolicyCreate, PolicyResponse
from app.audit.audit_trail import log_audit_event

router = APIRouter(prefix="", tags=["Policy Engine"])

@router.get("/products")
def list_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

@router.post("/products", response_model=ProductResponse)
def create_product(payload: ProductCreate, db: Session = Depends(get_db)):
    """
    Declarative Policy Engine:
    Create a new insurance product dynamically stored in the database without code redeployment.
    """
    existing = db.query(Product).filter(Product.product_id == payload.product_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Product ID already exists")

    product = Product(
        product_id=payload.product_id,
        name=payload.name,
        crop=payload.crop,
        premium=payload.premium,
        coverage=payload.coverage,
        rainfall_threshold=payload.rainfall_threshold,
        min_oracles=payload.min_oracles,
        aggregation=payload.aggregation,
        window_days=payload.window_days,
        payout_amount=payload.payout_amount,
        status="ACTIVE"
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    log_audit_event(db, actor="ADMIN", action="PRODUCT_CREATED", metadata={"product_id": product.product_id, "name": product.name})
    return product

@router.post("/policies", response_model=PolicyResponse)
def purchase_policy(payload: PolicyCreate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.product_id == payload.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Selected insurance product not found")

    policy_id = f"POL-{uuid.uuid4().hex[:8].upper()}"
    policy = Policy(
        policy_id=policy_id,
        user_id=payload.user_id,
        product_id=payload.product_id,
        crop=product.crop,
        premium=product.premium,
        coverage=product.coverage,
        start_date=payload.start_date,
        end_date=payload.end_date,
        status="ACTIVE"
    )

    db.add(policy)
    db.commit()
    db.refresh(policy)

    log_audit_event(db, actor=payload.user_id, action="POLICY_PURCHASED", metadata={
        "policy_id": policy_id,
        "product_id": payload.product_id,
        "coverage": product.coverage
    })

    return policy

@router.get("/policies/{policy_id}")
def get_policy_details(policy_id: str, db: Session = Depends(get_db)):
    policy = db.query(Policy).filter(Policy.policy_id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    return policy
