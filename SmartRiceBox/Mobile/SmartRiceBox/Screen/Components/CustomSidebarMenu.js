import React from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomSidebarMenu = (props) => {
  const handleLogout = () => {
    props.navigation.toggleDrawer();
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => {
            return null;
          },
        },
        {
          text: 'Confirm',
          onPress: async () => {
            AsyncStorage.clear();
            props.navigation.replace('Auth');
          },
        },
      ],
      { cancelable: false },
    );
  };

  const handleUserGuide = () => {
    // Implement user guide functionality here
  };

  const handleProducts = () => {
    props.navigation.toggleDrawer();
    props.navigation.navigate('Products'); // Điều hướng đến màn hình Products.js
  };

  return (
    <View style={stylesSidebar.sideMenuContainer}>
      <View style={stylesSidebar.profileHeader}>
        <View style={stylesSidebar.profileHeaderPicCircle}>
          <Text style={{ fontSize: 25, color: '#307ecc' }}>
            {'SRB'.charAt(0)}
          </Text>
        </View>
        <Text style={stylesSidebar.profileHeaderText}>
          Smart Rice Box
        </Text>
      </View>
      <View style={stylesSidebar.profileHeaderLine} />
      <TouchableOpacity onPress={handleUserGuide} style={stylesSidebar.button}>
        <Text style={stylesSidebar.buttonText}>User Guide</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleProducts} style={stylesSidebar.button}>
        <Text style={stylesSidebar.buttonText}>Products</Text>
      </TouchableOpacity>
    
      <TouchableOpacity onPress={handleLogout} style={stylesSidebar.button}>
        <Text style={stylesSidebar.buttonText}>Logout</Text>
      </TouchableOpacity>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={stylesSidebar.logoContainer}>
        <Image source={require("../../Image/logoBK.png")} style={stylesSidebar.logo}></Image>
      </View>
      <View style={stylesSidebar.footer}>
        <Text style={stylesSidebar.footerText}>Version 1.0.0</Text>
        <Text style={stylesSidebar.footerText}>© 3DIoT</Text>
      </View>
    </View>
  );
};

export default CustomSidebarMenu;

const stylesSidebar = StyleSheet.create({
  sideMenuContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 40,
    color: '#307ecc',
  },
  profileHeader: {
    flexDirection: 'row',
    backgroundColor: '#307ecc',
    padding: 20,
    alignItems: 'center',
  },
  profileHeaderPicCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeaderText: {
    color: 'white',
    marginLeft: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileHeaderLine: {
    height: 5,
    marginHorizontal: 20,
    backgroundColor: '#e2e2e2',
    marginTop: 15,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  footerText: {
    color: '#757575',
    fontSize: 14,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 150, // Điều chỉnh kích thước của ảnh
    height: 75,  // Điều chỉnh kích thước của ảnh
    resizeMode: 'contain', // Giữ tỷ lệ của ảnh khi thay đổi kích thước
  },
});
