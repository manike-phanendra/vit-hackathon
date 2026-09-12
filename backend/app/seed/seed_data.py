import datetime
from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal
from app.models.models import User, Provider, Product, Policy, RainfallObservation, TriggerEvent, Payout
from app.audit.audit_trail import log_audit_event

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Clear existing data to re-seed cleanly
        db.query(Payout).delete()
        db.query(TriggerEvent).delete()
        db.query(RainfallObservation).delete()
        db.query(Policy).delete()
        db.query(Product).delete()
        db.query(Provider).delete()
        db.query(User).delete()
        db.commit()

        print("Seeding database with realistic Indian farmer profiles...")

        # 1. Real Farmer Profiles
        farmers = [
            User(user_id="USR-101", name="Ramesh Kumar", role="FARMER", mobile_number="+919876543210", device_id="DEV-WARANGAL-01", pin_hash="1234"),
            User(user_id="USR-102", name="Suresh Patel", role="FARMER", mobile_number="+919876543211", device_id="DEV-KARIMNAGAR-02", pin_hash="5678"),
            User(user_id="USR-103", name="Anitha Devi", role="FARMER", mobile_number="+919876543212", device_id="DEV-NALGONDA-03", pin_hash="1122"),
            User(user_id="USR-104", name="Kiran Rao", role="FARMER", mobile_number="+919876543213", device_id="DEV-KHAMMAM-04", pin_hash="3344"),
            User(user_id="USR-105", name="Venkatesh Naik", role="FARMER", mobile_number="+919876543214", device_id="DEV-MAHABUBNAGAR-05", pin_hash="5566"),
            User(user_id="USR-106", name="Laxmi Bai", role="FARMER", mobile_number="+919876543215", device_id="DEV-NIZAMABAD-06", pin_hash="7788"),
            User(user_id="USR-107", name="Mallesh Goud", role="FARMER", mobile_number="+919876543216", device_id="DEV-MEDAK-07", pin_hash="9900"),
            User(user_id="USR-108", name="Balu Rathod", role="FARMER", mobile_number="+919876543217", device_id="DEV-ADILABAD-08", pin_hash="2244")
        ]
        db.add_all(farmers)

        # 2. Insurer Provider
        provider = Provider(
            provider_id="PROV-001",
            unique_provider_id="KS-PROV-7A29F4",
            org_name="Telangana Farmers Mutual Insurance",
            contact_person="Anita Rao",
            email="anita@tfmi.org.in",
            password_hash="admin123"
        )
        db.add(provider)

        # 3. Insurance Products
        products = [
            Product(product_id="PADDY_MONSOON_01", name="Paddy Monsoon Shield", crop="Paddy", premium=499.0, coverage=20000.0, rainfall_threshold=40.0, min_oracles=2, aggregation="median", window_days=7, payout_amount=20000.0, status="ACTIVE"),
            Product(product_id="COTTON_RAIN_01", name="Cotton Rain Shield", crop="Cotton", premium=399.0, coverage=15000.0, rainfall_threshold=35.0, min_oracles=2, aggregation="median", window_days=7, payout_amount=15000.0, status="ACTIVE"),
            Product(product_id="GROUNDNUT_SHIELD_01", name="Groundnut Drought Shield", crop="Groundnut", premium=299.0, coverage=12000.0, rainfall_threshold=30.0, min_oracles=2, aggregation="median", window_days=7, payout_amount=12000.0, status="ACTIVE"),
            Product(product_id="CHILLI_PROTECT_01", name="Chilli Weather Protection", crop="Chilli", premium=599.0, coverage=25000.0, rainfall_threshold=30.0, min_oracles=2, aggregation="median", window_days=7, payout_amount=25000.0, status="ACTIVE")
        ]
        db.add_all(products)

        # 4. Policies for Farmers
        policies = [
            Policy(policy_id="POL-10482", user_id="USR-101", product_id="PADDY_MONSOON_01", crop="Paddy", premium=499.0, coverage=20000.0, start_date="2026-06-01", end_date="2026-09-30", status="TRIGGERED"),
            Policy(policy_id="POL-10483", user_id="USR-102", product_id="PADDY_MONSOON_01", crop="Paddy", premium=499.0, coverage=20000.0, start_date="2026-06-01", end_date="2026-09-30", status="ACTIVE"),
            Policy(policy_id="POL-10484", user_id="USR-103", product_id="COTTON_RAIN_01", crop="Cotton", premium=399.0, coverage=15000.0, start_date="2026-06-01", end_date="2026-09-30", status="TRIGGERED"),
            Policy(policy_id="POL-10485", user_id="USR-104", product_id="GROUNDNUT_SHIELD_01", crop="Groundnut", premium=299.0, coverage=12000.0, start_date="2026-06-01", end_date="2026-09-30", status="ACTIVE"),
            Policy(policy_id="POL-10486", user_id="USR-105", product_id="PADDY_MONSOON_01", crop="Paddy", premium=499.0, coverage=20000.0, start_date="2026-06-01", end_date="2026-09-30", status="TRIGGERED"),
            Policy(policy_id="POL-10487", user_id="USR-106", product_id="CHILLI_PROTECT_01", crop="Chilli", premium=599.0, coverage=25000.0, start_date="2026-06-01", end_date="2026-09-30", status="TRIGGERED"),
            Policy(policy_id="POL-10488", user_id="USR-107", product_id="COTTON_RAIN_01", crop="Cotton", premium=399.0, coverage=15000.0, start_date="2026-06-01", end_date="2026-09-30", status="ACTIVE"),
            Policy(policy_id="POL-10489", user_id="USR-108", product_id="COTTON_RAIN_01", crop="Cotton", premium=399.0, coverage=15000.0, start_date="2026-06-01", end_date="2026-09-30", status="TRIGGERED")
        ]
        db.add_all(policies)

        # 5. Telemetry Observations
        now_str = datetime.datetime.utcnow().isoformat()
        obs = [
            RainfallObservation(observation_id="OBS-A-01", station_id="ST-001", oracle_id="Oracle A", timestamp=now_str, rainfall_mm=28.0, quality_status="HEALTHY"),
            RainfallObservation(observation_id="OBS-B-01", station_id="ST-001", oracle_id="Oracle B", timestamp=now_str, rainfall_mm=27.0, quality_status="HEALTHY"),
            RainfallObservation(observation_id="OBS-C-01", station_id="ST-001", oracle_id="Oracle C", timestamp=now_str, rainfall_mm=28.0, quality_status="DELAYED")
        ]
        db.add_all(obs)

        # 6. Triggers & Idempotent Payouts
        trig_1 = TriggerEvent(event_id="EVT-90881", policy_id="POL-10482", rule_name="Rainfall < 40 mm", consensus_rainfall=28.0, threshold=40.0, status="TRIGGERED", reason="28mm rainfall recorded, 30% below 40mm threshold")
        pay_1 = Payout(payout_id="PAY-88210", event_id="EVT-90881", policy_id="POL-10482", amount=20000.0, idempotency_key="POL-10482:EVT-90881", status="PAID")

        trig_2 = TriggerEvent(event_id="EVT-90882", policy_id="POL-10484", rule_name="Rainfall < 35 mm", consensus_rainfall=18.0, threshold=35.0, status="TRIGGERED", reason="18mm rainfall recorded, below 35mm threshold")
        pay_2 = Payout(payout_id="PAY-88211", event_id="EVT-90882", policy_id="POL-10484", amount=15000.0, idempotency_key="POL-10484:EVT-90882", status="PAID")

        trig_3 = TriggerEvent(event_id="EVT-90883", policy_id="POL-10486", rule_name="Rainfall < 40 mm", consensus_rainfall=22.0, threshold=40.0, status="TRIGGERED", reason="22mm rainfall recorded, below 40mm threshold")
        pay_3 = Payout(payout_id="PAY-88212", event_id="EVT-90883", policy_id="POL-10486", amount=20000.0, idempotency_key="POL-10486:EVT-90883", status="PAID")

        trig_4 = TriggerEvent(event_id="EVT-90884", policy_id="POL-10487", rule_name="Rainfall < 30 mm", consensus_rainfall=15.0, threshold=30.0, status="TRIGGERED", reason="15mm rainfall recorded, below 30mm threshold")
        pay_4 = Payout(payout_id="PAY-88213", event_id="EVT-90884", policy_id="POL-10487", amount=25000.0, idempotency_key="POL-10487:EVT-90884", status="PAID")

        db.add_all([trig_1, pay_1, trig_2, pay_2, trig_3, pay_3, trig_4, pay_4])

        db.commit()
        log_audit_event(db, actor="SYSTEM", action="SEED_EXPANDED_FARMERS", metadata={"farmer_count": len(farmers)})
        print("Database seeded with 8 realistic farmer profiles.")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
