import csv
import os
import pymysql
from dotenv import load_dotenv
from database import engine, Base, SessionLocal
from models import Spec

load_dotenv()

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", "3306"))
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "aispera_spec")


def create_database():
    conn = pymysql.connect(host=DB_HOST, port=DB_PORT, user=DB_USER, password=DB_PASSWORD)
    cursor = conn.cursor()
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    conn.close()
    print(f"Database '{DB_NAME}' created or already exists.")


def create_tables():
    Base.metadata.create_all(bind=engine)
    print("Tables created.")


def import_csv():
    csv_path = os.path.join(os.path.dirname(__file__), "..", "aispera_spec.csv")
    db = SessionLocal()

    existing = db.query(Spec).count()
    if existing > 0:
        print(f"Data already exists ({existing} rows). Skipping import.")
        db.close()
        return

    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        header_row = next(reader)  # skip first row (date row)
        header_row = next(reader)  # actual header

        count = 0
        for row in reader:
            if len(row) < 16 or not row[0].strip():
                continue

            spec = Spec(
                category1=row[0].strip() or None,
                category2=row[1].strip() or None,
                country=row[2].strip() or None,
                stage=row[3].strip() or None,
                status=row[4].strip() or None,
                ais_number=row[5].strip() or None,
                other_number=row[6].strip() or None,
                name=row[7].strip() or None,
                related_number=row[8].strip() or None,
                date=row[9].strip() or None,
                owner=row[10].strip() or None,
                issuer=row[11].strip() or None,
                expiry_date=row[12].strip() or None,
                note1=row[13].strip() or None,
                note2=row[14].strip() or None,
                evidence=row[15].strip() or None,
            )
            db.add(spec)
            count += 1

        db.commit()
        print(f"Imported {count} records from CSV.")
    db.close()


if __name__ == "__main__":
    create_database()
    create_tables()
    import_csv()
    print("Initialization complete!")
