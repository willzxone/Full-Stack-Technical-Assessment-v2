import random
import uuid
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from api.database import engine, Base, SessionLocal
from api.models import Product, User, Order, Transaction


def seed_database():
    """Seed the database with 100k+ realistic records."""
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if data already exists
        if db.query(Product).count() > 0:
            print("Database already seeded. Skipping...")
            return
        
        print("Starting database seeding...")
        
        # Sample data for realistic generation
        product_names = [
            "Laptop Pro", "Wireless Mouse", "USB-C Cable", "Monitor 4K",
            "Keyboard Mechanical", "Webcam HD", "Speaker Bluetooth", "SSD 1TB",
            "Headphones Wireless", "Desk Lamp", "Router WiFi", "Graphics Card",
            "RAM 16GB", "Power Supply", "Case ATX", "Cooling Fan",
        ]
        
        categories = ["Electronics", "Accessories", "Components", "Peripherals"]
        countries = ["USA", "Canada", "UK", "Germany", "France", "Japan", "Australia", "Brazil", "India", "Mexico"]
        statuses = ["completed", "pending", "cancelled", "shipped"]
        payment_methods = ["credit_card", "debit_card", "paypal", "bank_transfer", "crypto"]
        
        # Generate 1000 products
        print("Generating 1000 products...")
        products = []
        for i in range(1000):
            product = Product(
                id=str(uuid.uuid4()),
                sku=f"SKU-{i:06d}",
                name=f"{random.choice(product_names)} {i}",
                description=f"High-quality product {i} with great features",
                category=random.choice(categories),
                price=round(random.uniform(10, 2000), 2),
                stock=random.randint(0, 500),
                created_at=datetime.utcnow() - timedelta(days=random.randint(0, 365)),
            )
            products.append(product)
        
        db.add_all(products)
        db.commit()
        print(f"✓ Created {len(products)} products")
        
        # Generate 5000 users
        print("Generating 5000 users...")
        users = []
        for i in range(5000):
            user = User(
                id=str(uuid.uuid4()),
                email=f"user{i}@example.com",
                name=f"User {i}",
                country=random.choice(countries),
                signup_date=datetime.utcnow() - timedelta(days=random.randint(0, 730)),
                total_orders=0,
                lifetime_value=0.0,
            )
            users.append(user)
        
        db.add_all(users)
        db.commit()
        print(f"✓ Created {len(users)} users")
        
        # Generate 100,000 orders
        print("Generating 100,000 orders...")
        orders = []
        transactions = []
        
        for i in range(100000):
            user = random.choice(users)
            product = random.choice(products)
            quantity = random.randint(1, 10)
            total_price = product.price * quantity
            
            order = Order(
                id=str(uuid.uuid4()),
                user_id=user.id,
                product_id=product.id,
                quantity=quantity,
                total_price=total_price,
                status=random.choice(statuses),
                order_date=datetime.utcnow() - timedelta(days=random.randint(0, 365)),
            )
            orders.append(order)
            
            # Create corresponding transaction
            transaction = Transaction(
                id=str(uuid.uuid4()),
                order_id=order.id,
                amount=total_price,
                currency="USD",
                payment_method=random.choice(payment_methods),
                status=random.choice(["completed", "pending", "failed"]),
                transaction_date=order.order_date,
            )
            transactions.append(transaction)
            
            # Update user stats
            user.total_orders += 1
            user.lifetime_value += total_price
            
            if (i + 1) % 10000 == 0:
                print(f"  Progress: {i + 1}/100,000 orders...")
        
        db.add_all(orders)
        db.add_all(transactions)
        db.commit()
        print(f"✓ Created {len(orders)} orders")
        print(f"✓ Created {len(transactions)} transactions")
        
        # Update user stats in database
        for user in users:
            db.merge(user)
        db.commit()
        
        print("\n✓ Database seeding completed successfully!")
        print(f"Total records: {1000 + 5000 + 100000 + 100000} (products + users + orders + transactions)")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
