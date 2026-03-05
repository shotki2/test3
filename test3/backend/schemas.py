from pydantic import BaseModel
from typing import Optional


class SpecBase(BaseModel):
    category1: Optional[str] = None
    category2: Optional[str] = None
    country: Optional[str] = None
    stage: Optional[str] = None
    status: Optional[str] = None
    ais_number: Optional[str] = None
    other_number: Optional[str] = None
    name: Optional[str] = None
    related_number: Optional[str] = None
    date: Optional[str] = None
    owner: Optional[str] = None
    issuer: Optional[str] = None
    expiry_date: Optional[str] = None
    note1: Optional[str] = None
    note2: Optional[str] = None
    evidence: Optional[str] = None


class SpecCreate(SpecBase):
    pass


class SpecUpdate(SpecBase):
    pass


class SpecResponse(SpecBase):
    id: int

    class Config:
        from_attributes = True
