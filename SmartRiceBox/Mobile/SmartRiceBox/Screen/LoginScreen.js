import React, { useState, createRef } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import Loader from './Components/Loader';

const LoginScreen = ({ navigation }) => {
  const [phoneNum, setPhoneNum] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const passwordInputRef = createRef();

  const handleSubmitPress = async () => {
    setErrortext('');
    if (!phoneNum || !userPassword) {
      alert('Please fill Phone Number and Password');
      return;
    }
    setLoading(true);
    let dataToSend = { phone_num: phoneNum, password: userPassword };
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify(dataToSend),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const responseJson = await response.json();
      setLoading(false);
      if (response.status === 200) {
        AsyncStorage.setItem('token', responseJson.access_token);
        navigation.replace('DrawerNavigationRoutes');
      } else {
        setErrortext(responseJson.detail);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Image
          source={require('../Image/logoBK.png')}
          style={[styles.logo, { marginTop: -50 }, { width: 200, height: 200 }]}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={setPhoneNum}
            placeholder="Enter Phone Number"
            keyboardType="numeric"
            returnKeyType="next"
            onSubmitEditing={() => passwordInputRef.current.focus()}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={setUserPassword}
            placeholder="Enter Password"
            secureTextEntry
            ref={passwordInputRef}
          />
        </View>
        {errortext != '' && <Text style={styles.errorText}>{errortext}</Text>}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleSubmitPress}
        >
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate('RegisterScreen')}
        >
          <Text style={styles.registerButtonText}>New Here? Register</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '50%',
    height: 100,
    resizeMode: 'contain',
    marginVertical: 30,
  },
  inputContainer: {
    width: '80%',
    marginVertical: 10,
    marginTop:30,
  },
  input: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 30,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  loginButton: {
    backgroundColor: '#0f68a0',
    width: '80%',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginVertical: 20,
    marginTop:30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    width: '80%',
    paddingVertical: 15,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#000',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
