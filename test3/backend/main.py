from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional
from database import get_db, engine, Base
from models import Spec
from schemas import SpecCreate, SpecUpdate, SpecResponse

app = FastAPI(title="AISpera Spec Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


@app.get("/api/specs", response_model=list[SpecResponse])
def get_specs(
    category1: Optional[str] = None,
    category2: Optional[str] = None,
    country: Optional[str] = None,
    status: Optional[str] = None,
    stage: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Spec)
    if category1:
        query = query.filter(Spec.category1 == category1)
    if category2:
        query = query.filter(Spec.category2 == category2)
    if country:
        query = query.filter(Spec.country == country)
    if status:
        query = query.filter(Spec.status == status)
    if stage:
        query = query.filter(Spec.stage == stage)
    if search:
        query = query.filter(
            or_(
                Spec.name.contains(search),
                Spec.ais_number.contains(search),
                Spec.owner.contains(search),
                Spec.issuer.contains(search),
            )
        )
    return query.order_by(Spec.id).all()


@app.get("/api/specs/categories")
def get_categories(db: Session = Depends(get_db)):
    category1_list = [r[0] for r in db.query(Spec.category1).distinct().all() if r[0]]
    category2_list = [r[0] for r in db.query(Spec.category2).distinct().all() if r[0]]
    country_list = [r[0] for r in db.query(Spec.country).distinct().all() if r[0]]
    status_list = [r[0] for r in db.query(Spec.status).distinct().all() if r[0]]
    stage_list = [r[0] for r in db.query(Spec.stage).distinct().all() if r[0]]
    return {
        "category1": sorted(category1_list),
        "category2": sorted(category2_list),
        "country": sorted(country_list),
        "status": sorted(status_list),
        "stage": sorted(stage_list),
    }


@app.get("/api/specs/{spec_id}", response_model=SpecResponse)
def get_spec(spec_id: int, db: Session = Depends(get_db)):
    spec = db.query(Spec).filter(Spec.id == spec_id).first()
    if not spec:
        raise HTTPException(status_code=404, detail="Spec not found")
    return spec


@app.post("/api/specs", response_model=SpecResponse)
def create_spec(spec: SpecCreate, db: Session = Depends(get_db)):
    db_spec = Spec(**spec.model_dump())
    db.add(db_spec)
    db.commit()
    db.refresh(db_spec)
    return db_spec


@app.put("/api/specs/{spec_id}", response_model=SpecResponse)
def update_spec(spec_id: int, spec: SpecUpdate, db: Session = Depends(get_db)):
    db_spec = db.query(Spec).filter(Spec.id == spec_id).first()
    if not db_spec:
        raise HTTPException(status_code=404, detail="Spec not found")
    for key, value in spec.model_dump(exclude_unset=True).items():
        setattr(db_spec, key, value)
    db.commit()
    db.refresh(db_spec)
    return db_spec


@app.delete("/api/specs/{spec_id}")
def delete_spec(spec_id: int, db: Session = Depends(get_db)):
    db_spec = db.query(Spec).filter(Spec.id == spec_id).first()
    if not db_spec:
        raise HTTPException(status_code=404, detail="Spec not found")
    db.delete(db_spec)
    db.commit()
    return {"message": "Deleted successfully"}
