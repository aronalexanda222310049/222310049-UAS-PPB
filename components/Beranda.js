import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Vibration, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { ListBencana } from './ConstData';
import Icon from 'react-native-vector-icons/FontAwesome';
import { deskripsibencana } from './dekripsibencana';

const Beranda = () => {
  const [location, setLocation] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  const [address, setAddress] = useState('');
  const navigation = useNavigation();

  const triggerVibration = () => {
    Vibration.vibrate(3000);
  };
  
  const SelectedDeskripsiBencana = deskripsibencana.find(item => item.id === 1);

  const selectedBencana = ListBencana.find(item => item.id === 1);

  const showToast = () => {
    Toast.show({
      type: "info",
      text1: "Peringatan Bencana Alam!",
      text2: selectedBencana.nama,
    });
  };

  const navigateToDetail = (id) => {
    navigation.navigate('DetailBencana', { disasterId: id });
  };

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        const now = new Date();
        setCurrentTime(now.toLocaleString());

        let reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (reverseGeocode.length > 0) {
          let address = reverseGeocode[0];
          setAddress(`${address.city}, ${address.region}`);
        }
      } catch (error) {
        console.error(error);
      }
    })();

    triggerVibration();
    showToast();
    setTimeout(() => {
      navigateToDetail(selectedBencana.id);
    }, 4000);
  }, []);

  const handleInfoContainerPress = () => {
    navigateToDetail(selectedBencana.id);
  };

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
        </MapView>
      )}
      <TouchableOpacity style={styles.infoContainer} onPress={handleInfoContainerPress}>
        <Text style={styles.title}>Bencana Alam {selectedBencana.nama}</Text>
        <View style={styles.infoRow}>
          <Icon name="exclamation-circle" size={20} color="#000" />
          <Text style={styles.text}>{SelectedDeskripsiBencana.tipe} {'\n'}{SelectedDeskripsiBencana.kekuatan}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="map-marker" size={25} color="#000" />
          <Text style={styles.text}> Lokasi: {'\n'} {address || 'Loading...'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="clock-o" size={20} color="#000" />
          <Text style={styles.text}>Waktu: {'\n'}{currentTime || 'Loading...'}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '70%',
  },
  infoContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default Beranda;
