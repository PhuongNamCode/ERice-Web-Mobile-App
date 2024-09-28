from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class Token(BaseModel):
    access_token: str
    token_type: str


class UserOut(BaseModel):
    id: int
    username: str
    created_at: datetime

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    username: str
    phone_num: Optional[str] = None
    email: Optional[str] = None
    password: str
    repeat_password: str
    role: str


class UserLogin(BaseModel):
    username: str
    password: str


class TokenData(BaseModel):
    id: Optional[int] = None


class GetRiceBoxRes(BaseModel):
    id: int
    name: str
    current_rice_amount: Optional[int] = None
    current_humidity: Optional[int] = None
    current_temperature: Optional[int] = None
    url_dashboard:str
    house_num_street: str
    ward: str
    district : str
    city : str


class UpdateRiceBoxRes(BaseModel):
    id: int
    name: str
    house_num_street: str
    ward: str
    district: str
    city: str
    alarm_rice_threshold: int
    longitude: float
    latitude: float

class AddProviderRes(BaseModel):
    name: str
    provider_username: str

class AddProviderReq(BaseModel):
    rice_box_seri: str
    provider_username: str

class UpdateRiceBoxReq(BaseModel):
    rice_box_seri: str
    name: str
    city: str
    ward: str
    district: str
    house_num_street: str
    alarm_rice_threshold: int
    longitude: Optional[float] = None
    latitude:Optional[float] = None


class GetMarkerRes(BaseModel):
    id: int
    longitude: float
    latitude: float
    access_token: str
    current_rice_amount: Optional[int] = None
    current_humidity: Optional[int] = None
    current_temperature: Optional[int] = None
    url_dashboard: Optional[str] = None
    house_num_street: Optional[str] = None
    ward: Optional[str] = None
    district: Optional[str] = None
    city: Optional[str] = None
