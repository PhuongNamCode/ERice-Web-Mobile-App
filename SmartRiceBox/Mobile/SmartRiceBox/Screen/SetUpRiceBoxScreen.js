import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env'

const SetUpRiceBoxScreen = (props) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState(null);
  const [riceBoxId, setRiceBoxId] = useState("");
  const [threshold, setThreshold] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [ward, setWard] = useState("");
  const [district, setDistrict] = useState("");
  const [houseNumStreet, setHouseNumStreet] = useState("");
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);


  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        // Call function to fetch and display address
        getAddressFromCoordinates(location.coords.latitude, location.coords.longitude);
      } catch (error) {
        setErrorMsg("Error fetching location");
        console.error(error);
      }
    })();
  }, []);

  const getAddressFromCoordinates = async (latitude, longitude) => {
    fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=b01cb522f4f54eb5a6cffc773e999e0f&language=vi`
    )
    .then(response => response.json())
    .then(data => {
      console.log("API Response:", data);
      if (data.results.length > 0) {
        const addressComponents = data.results[0].components;
        console.log("Address Components:", addressComponents);
        const { building, city, quarter, suburb, house_number, road } = addressComponents;
        setName(building || 'Test');
        setCity(city || '');
        setWard(quarter || 'Quận 10');
        setDistrict(suburb || 'HCM');
        setHouseNumStreet(`${house_number || ''} ${road || ''}`);
        setLongitude(longitude);
        setLatitude(latitude);
        setAddress(data.results[0].formatted);
      } else {
        console.log("No results found");
      }
    })
    .catch(error => {
      console.error(error);
    });
  };
  

  const handleAddRiceBox = async () => {
    if (!riceBoxId) {
      Alert.alert("Vui lòng nhập ID Thùng gạo");
      return;
    }
    if (!threshold) {
      Alert.alert("Vui lòng nhập ngưỡng gạo");
      return;
    }

    console.log(riceBoxId);
    console.log(threshold);

    var token = await AsyncStorage.getItem("token")
    const body = JSON.stringify({
      rice_box_seri: riceBoxId,
      name: name,
      city: city,
      ward: ward,
      district: district,
      alarm_rice_threshold: threshold,
      house_num_street: houseNumStreet,
      longitude: longitude,
      latitude: latitude
    });
    const response = await fetch(
      `${API_URL}/api/rice_box`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': "application/json"
        },
        method: "PUT",
        body: body
      }
    )
    console.log(token)
    console.log(JSON.stringify(body))
    
    const responseJson = await response.json()
    console.log(responseJson)

    setRiceBoxId("");
    setThreshold("");
    
    props.navigation.navigate('DrawerNavigationRoutes');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>

        <View style={styles.inputContainer}>
          <Text style={styles.setupText}>Thiết lập thùng gạo</Text>
          <TextInput
            style={styles.input}
            onChangeText={setRiceBoxId}
            value={riceBoxId}
            placeholder="ID Thùng gạo"
          />
          <TextInput
            style={styles.input}
            onChangeText={setThreshold}
            value={threshold}
            placeholder="Cài đặt ngưỡng gạo"
          />
        </View>

        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={{
              latitude: location ? location.coords.latitude : 0,
              longitude: location ? location.coords.longitude : 0,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {location && (
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Vị trí hiện tại"
              />
            )}
          </MapView>
          {errorMsg ? (
            <Text style={styles.errorText}>{errorMsg}</Text>
          ) : (
            <View style={styles.locationContainer}>
              {address && (
                <View style={styles.addressContainer}>
                  <Text style={styles.addressLabel}>Địa chỉ:</Text>
                  <Text style={styles.addressText}>{address}</Text>
                </View>
              )}
            </View>
          )}
        </View>

      </ScrollView>
      <TouchableOpacity onPress={handleAddRiceBox} style={styles.addButton}>
        <Text style={styles.addButtonLabel}>Thêm thùng gạo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  inputContainer: {
    marginTop: 150,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  mapContainer: {
    width: "100%",
    marginBottom: 25,
  },
  map: {
    width: "100%",
    height: 250,
    borderRadius: 20,
    marginBottom: 20,
  },
  locationContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    marginTop: 20,
  },
  addressContainer: {
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
    marginTop: 10,
  },
  addressLabel: {
    fontWeight: "bold",
    fontSize: 16,
  },
  addressText: {
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 20,
  },
  addButtonLabel: {
    color: "#fff",
    fontSize: 16,
  },
  setupText: {
    fontSize: 24, // Tăng kích thước chữ
    fontWeight: "bold",
    marginBottom: 40, // Tăng khoảng cách với các phần tử khác
    color: "#007bff", // Màu sắc tùy chỉnh
    letterSpacing: 1, // Tăng khoảng cách giữa các ký tự
    textAlign: "center", // Canh giữa văn bản
    marginTop: -50, // Dịch vị trí lên trên
  },    
});

export default SetUpRiceBoxScreen;
