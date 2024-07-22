import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';

const Lokasi = () => {
  const [selectedKecamatan, setSelectedKecamatan] = useState('');
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState(null);
  const navigation = useNavigation();

  const kecamatanBogor = [
    "Bogor Selatan",
    "Bogor Tengah",
    "Bogor Utara",
    "Bogor Timur",
    "Bogor Barat",
    "Tanah Sereal",
  ];

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);

      let address = await Location.reverseGeocodeAsync(location.coords);
      setAddress(address[0]);
    };

    getLocation();
  }, []);

  const handleUseGPS = async () => {
    if (location) {
      let address = await Location.reverseGeocodeAsync(location);
      setAddress(address[0]);
    
      const nearestKecamatan = findNearestKecamatan(location);
      setSelectedKecamatan(nearestKecamatan.name);
    
      Alert.alert(
        'Lokasi Anda',
        `Lokasi Anda: ${address[0].city}, ${address[0].region}`,
        [
          { text: 'OK', onPress: () => navigation.navigate('Beranda', { selectedKecamatan: nearestKecamatan.name }) }
        ]
      );
    }
  };   

  const findNearestKecamatan = (coords) => {
    let nearestKecamatan = kecamatanBogor[0];
    let minDistance = getDistance(coords.latitude, coords.longitude, nearestKecamatan.lat, nearestKecamatan.lon);

    kecamatanBogor.forEach((kecamatan) => {
      let distance = getDistance(coords.latitude, coords.longitude, kecamatan.lat, kecamatan.lon);
      if (distance < minDistance) {
        nearestKecamatan = kecamatan;
        minDistance = distance;
      }
    });

    return nearestKecamatan;
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    var R = 6371; 
    var dLat = deg2rad(lat2 - lat1); 
    var dLon = deg2rad(lon2 - lon1); 
    var a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    var distance = R * c; 
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/maps.png')} style={styles.image} />
      <Text style={styles.heading}>Silahkan Pilih Lokasi Anda {'\n'}Menggunakan Mode GPS</Text>
      <TouchableOpacity style={styles.button} onPress={handleUseGPS}>
        <Text style={styles.buttonText}>Lanjut</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  locationText: {
    fontSize: 16,
    marginVertical: 10,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    width: '80%',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 20,
  },
  picker: {
    height: 40,
  },
  button: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  orText: {
    fontSize: 18,
    marginVertical: 10,
  },
  gpsButton: {
    backgroundColor: '#f0f0f0',
    borderColor: 'red', 
    borderWidth: 1, 
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsButtonText: {
    color: 'red',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default Lokasi;