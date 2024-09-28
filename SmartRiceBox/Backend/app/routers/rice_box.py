from fastapi import APIRouter, status, Depends, HTTPException
from .. import schemas, utils, models, oauth2
from sqlalchemy.orm import Session
from ..database import get_db
from typing import List, Dict
from opencage.geocoder import OpenCageGeocode
from ..config import settings
from sqlalchemy import or_, and_
import pandas as pd

router = APIRouter(
    prefix="/api/rice_box",
    tags=["Rice Box"]
)

geocoder = OpenCageGeocode(settings.opencage_api_key)


@router.get("", status_code=status.HTTP_200_OK, response_model=List[schemas.GetRiceBoxRes])
def getRiceBox(cur_user_id: schemas.TokenData = Depends(oauth2.get_current_user), db: Session = Depends(get_db)):
    print(cur_user_id)
    devices = db.query(models.RiceBox).filter(
        models.RiceBox.owner_id == cur_user_id).all()
    return devices


@router.put("", status_code=status.HTTP_200_OK, response_model=schemas.UpdateRiceBoxRes)
def updateRiceBox(update_rice_box_req: schemas.UpdateRiceBoxReq, cur_user_id: schemas.TokenData = Depends(oauth2.get_current_user), db: Session = Depends(get_db)):
    if (update_rice_box_req.longitude and update_rice_box_req.latitude):
        long = update_rice_box_req.longitude
        lat = update_rice_box_req.latitude
    else:
        address = f"{update_rice_box_req.house_num_street}, {update_rice_box_req.ward}, {
            update_rice_box_req.district}, {update_rice_box_req.city}"
        coord = geocoder.geocode(address)
        long = float(coord[0]['geometry']['lng'])
        lat = float(coord[0]['geometry']['lat'])
    # print(coord[0]['geometry']['lat'], coord[0]['geometry']['lng'])
    rice_box_query = db.query(models.RiceBox).filter(
        models.RiceBox.access_token == update_rice_box_req.rice_box_seri)
    if (rice_box_query.first()):
        rice_box_query.update({
            "house_num_street": update_rice_box_req.house_num_street,
            "ward": update_rice_box_req.ward,
            "district": update_rice_box_req.district,
            "city": update_rice_box_req.city,
            "owner_id": cur_user_id,
            "alarm_rice_threshold": update_rice_box_req.alarm_rice_threshold,
            "name": update_rice_box_req.name,
            "longitude": long,
            "latitude": lat
        })
        db.commit()
        return rice_box_query.first()
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Invalid Seri Number")


@router.put("/add_provider", status_code=status.HTTP_200_OK, response_model=schemas.AddProviderRes)
def addProvider(req: schemas.AddProviderReq, cur_user_id: schemas.TokenData = Depends(oauth2.get_current_user), db: Session = Depends(get_db)):
    cur_user_role = db.query(models.UserRole).filter(
        models.UserRole.user_id == cur_user_id).all()
    role_names = []
    for r in cur_user_role:
        role_name = db.query(models.Role).filter(
            models.Role.id == r.role_id).first().name
        role_names.append(role_name)
    if "admin" not in role_names:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Not enough permission")
    rice_box_query = db.query(models.RiceBox).filter(
        models.RiceBox.access_token == req.rice_box_seri)
    if not rice_box_query.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Invalid Seri Number")
    provider = db.query(models.User).filter(
        models.User.username == req.provider_username).first()
    if not provider:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Invalid Phone Number")

    rice_box_query.update({
        "provider_id": provider.id
    })
    db.commit()
    response = schemas.AddProviderRes(
        name=rice_box_query.first().name, provider_username=req.provider_username)
    return response


@router.get("/get_marker", status_code=status.HTTP_200_OK, response_model=Dict[int, List[schemas.GetMarkerRes]])
def getMarker(city_filter: str = None, district_filter: str = None, ward_filter: str = None, get_alarm: bool = False, db: Session = Depends(get_db), cur_user_id: schemas.TokenData = Depends(oauth2.get_current_user)):
    cur_user_role = db.query(models.UserRole).filter(
        models.UserRole.user_id == cur_user_id).all()
    role_names = []
    for r in cur_user_role:
        role_name = db.query(models.Role).filter(
            models.Role.id == r.role_id).first().name
        role_names.append(role_name)
    if "provider" not in role_names:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Not enough permission")
    customers = db.query(models.User).all()
    response = {}
    for customer in customers:
        query = db.query(models.RiceBox).filter(and_(
            models.RiceBox.owner_id == customer.id, models.RiceBox.provider_id == cur_user_id))
        if city_filter:
            query.filter(models.RiceBox.city == city_filter)
        if district_filter:
            query.filter(models.RiceBox.district == district_filter)
        if ward_filter:
            query.filter(models.RiceBox.ward == ward_filter)
        if get_alarm:
            query.filter(models.RiceBox.current_rice_amount <=
                         models.RiceBox.alarm_rice_threshold)
        if not query.first():
            continue
        response[customer.id] = query.all()

    return response


@router.put("/send_buy_rice_request", status_code=status.HTTP_200_OK)
def send_buy_rice_request(rice_box_id: int, db: Session = Depends(get_db)):
    query = db.query(models.RiceBox).filter(models.RiceBox.id == rice_box_id)
    if (query.first()):
        query.update({
            "have_buy_rice_request": True
        })
        db.commit()
        return {
            "message": "OK"
        }
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Not found rice box")


@router.get("/get_data_table", status_code=status.HTTP_200_OK)
def get_data_table(db: Session = Depends(get_db)):
    response = []
    rice_boxs = db.query(models.RiceBox).filter(or_(models.RiceBox.current_rice_amount <=
                                                models.RiceBox.alarm_rice_threshold, models.RiceBox.have_buy_rice_request == True)).all()
    for e in rice_boxs:
        try:
            response.append(
                {
                    "imei": e.access_token,
                    "address": f"{e.house_num_street}, {e.ward}, {e.district}, {e.city}",
                    "phone_num": db.query(models.User).filter(models.User.id == e.owner_id).first().phone_num,
                    "status_request": e.have_buy_rice_request,
                    "is_tick": e.tick_deliver,
                    "amount": e.current_rice_amount
                }
            )
        except Exception as e:
            print(e)
    return response


@router.put("/tick_deliver", status_code=status.HTTP_200_OK)
def tick_deliver(access_token: str, rice_type_id: int = None, quantity: int = None, db: Session = Depends(get_db)):
    rice_box_query = db.query(models.RiceBox).filter(
        models.RiceBox.access_token == access_token)
    rice_box = rice_box_query.first()
    if (rice_box):
        if rice_type_id != None and quantity != None:
            if rice_box.tick_deliver == False:
                new_buy_rice_deliver = models.BuyRiceDelivery(
                    ricebox_id=rice_box.id,
                    rice_type_id=rice_type_id,
                    quantity=quantity
                )
                db.add(new_buy_rice_deliver)
        rice_box_query.update({
            "tick_deliver": not (rice_box_query.first().tick_deliver)
        })
        db.commit()
        return {
            "message": "OK"
        }
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Invalid Seri Number")


@router.get("/find_route", status_code=status.HTTP_200_OK)
def find_route(db: Session = Depends(get_db)):
    rice_boxs = db.query(models.RiceBox).filter(
        models.RiceBox.tick_deliver == True).all()
    shortest_route = utils.find_shortest_route(rice_boxs)
    response = []
    for e in shortest_route:
        try:
            response.append(
                {
                    "address": f"{e.house_num_street}, {e.ward}, {e.district}, {e.city}",
                    "phone": db.query(models.User).filter(e.owner_id == models.User.id).first().phone_num,
                    "id": e.id,
                    "position": {
                        "lat": e.latitude,
                        "lng": e.longitude
                    }
                }
            )
        except Exception as e:
            print("Error", e)
    return response


@router.get("/get_rice_type", status_code=status.HTTP_200_OK)
def get_rice_type(db: Session = Depends(get_db)):
    rice_types = db.query(models.RiceType).all()
    return rice_types

@router.get("/visualization", status_code=status.HTTP_200_OK)
def visualization(db: Session = Depends(get_db), start_month: int = None, end_month: int = None, start_year: int = None, end_year: int = None):
    if start_month == None or end_month == None or start_year == None or end_year == None:
        return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing parameter")
    df = pd.read_csv("data.csv")
    df["created_at"] = pd.to_datetime(df["created_at"]).dt.to_period('M')
    df_filtered = df[(df['created_at'] >= f'{start_year}-{start_month}') & (df['created_at'] <= f'{end_year}-{end_month}')]
    # print(df_filtered)
    data_list = df_filtered.to_dict(orient="records")
    # print(start_month, end_month, start_year, end_year)
    # print(data_list)
    bar_data = []
    pie_data = {}
    bar_dict = {}
    for e in data_list:
        if "Quận " + e["district"] not in bar_dict:
            bar_dict["Quận " + e["district"]] = e["quantity"]
        else:
            bar_dict["Quận " + e["district"]] += e["quantity"]
    
    for key, value in bar_dict.items():
        bar_data.append({
            "district" : key, 
            "total_quanlity" : value
        })
    type_name_rice = {
        1: "Gạo thơm thái",
        2: "Gạo Bắc Hương",
        3: "Gạo Tám Xoan",
        4: "Gạo ST24",
        5: "Gạo Hàm Châu",
        6: "Gạo Tài Nguyên"
    }

    rice_type_df = df_filtered[["district", "rice_type_id", "quantity"]]
    rice_type_df_list = rice_type_df.to_dict(orient="records")
    rice_type_df_dict = {}

    for e in rice_type_df_list:
        if e["district"] not in rice_type_df_dict:
            rice_type_df_dict[e["district"]] = {}
            rice_type_df_dict[e["district"]][e["rice_type_id"]] = rice_type_df_dict[e["district"]].get(e["rice_type_id"], 0) + e["quantity"]
        else:
            rice_type_df_dict[e["district"]][e["rice_type_id"]] = rice_type_df_dict[e["district"]].get(e["rice_type_id"], 0) + e["quantity"]
    
    for key, value in rice_type_df_dict.items():
        temp = []
        for k, v in value.items():
            temp.append({
                "id" : k,
                "value" : v,
                "label" : type_name_rice[k]
            })
        rice_type_df_dict[key] = temp
    
    pie_data = rice_type_df_dict
    # print(bar_data, pie_data)
    return {
        "bar_data": bar_data,
        "pie_data": pie_data,
        "district": list(pie_data.keys()),
    }