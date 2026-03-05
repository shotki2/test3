from sqlalchemy import Column, Integer, String, Date, Text
from database import Base


class Spec(Base):
    __tablename__ = "specs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category1 = Column(String(50), comment="구분(1단계)")
    category2 = Column(String(50), comment="구분(2단계)")
    country = Column(String(10), comment="국가")
    stage = Column(String(50), comment="단계")
    status = Column(String(50), comment="상태")
    ais_number = Column(String(50), comment="AIS 관리번호")
    other_number = Column(String(100), comment="타사 관리번호")
    name = Column(String(500), comment="명칭")
    related_number = Column(String(200), comment="관련 번호")
    date = Column(String(20), comment="일자")
    owner = Column(String(200), comment="소유자")
    issuer = Column(String(200), comment="발급기관")
    expiry_date = Column(String(20), comment="만료일")
    note1 = Column(Text, comment="비고1")
    note2 = Column(Text, comment="비고2")
    evidence = Column(String(200), comment="증빙자료")
