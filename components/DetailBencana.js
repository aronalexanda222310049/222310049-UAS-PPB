  import React, { useState, useEffect } from 'react';
  import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
  import * as Location from 'expo-location';
  import { useNavigation } from '@react-navigation/native';
  import MapView, { Marker } from 'react-native-maps';
  import Icon from 'react-native-vector-icons/FontAwesome'; 
import { deskripsibencana } from './dekripsibencana';

  const disasterTitles = {
    1: 'Gempa Bumi Dirasakan',
    2: 'Tanah Longsor Dirasakan',
    3: 'Banjir Dirasakan',
    4: 'Gunung Meletus Dirasakan',
    5: 'Tsunami Dirasakan'
  };

  const SelectedDeskripsiBencana = deskripsibencana.find(item => item.id === 1);

  const DetailBencana = ({ route }) => {
    const { disasterId } = route.params;
    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
      (async () => {
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
      })();
    }, []);

    const handleViewStorePress = () => {
      if (location) {
        navigation.navigate('MapView', { location });
      }
    };

    const handleShowDescription = () => {
      setShowConfirmation(true);
    };

    const handleYesPress = () => {
      setShowConfirmation(false);
      setModalVisible(true);
    };

    const handleNoPress = () => {
      setShowConfirmation(false);
    };

    const handleOkPress = () => {
      setModalVisible(false);
      navigation.navigate('Beranda');
    };

    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: -8.27,
            longitude: 115.53,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {location && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Your Location"
            />
          )}
        </MapView>

        <ScrollView contentContainerStyle={styles.overlay}>
          <Text style={styles.title}>{disasterTitles[disasterId]}</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Icon name="exclamation-circle" size={20} color="#000" />
              <Text style={styles.infoText}>{SelectedDeskripsiBencana.nama}{'\n'}{SelectedDeskripsiBencana.kekuatan}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="map-marker" size={25} color="#000" />
              <Text style={styles.infoText}> Lokasi: {'\n'} {address || 'Loading...'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="clock-o" size={20} color="#000" />
              <Text style={styles.infoText}>Waktu: {'\n'}{currentTime || 'Loading...'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleViewStorePress}>
            <Text style={styles.buttonText}>Lihat Lokasi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton} onPress={handleShowDescription}>
            <Text style={styles.confirmButtonText}>Saya Juga Merasakan</Text>
          </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent={true}
            visible={showConfirmation}
            onRequestClose={() => setShowConfirmation(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.sectionTitle}>Apakah Anda Merasakan?</Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.okButton} onPress={handleYesPress}>
                    <Text style={styles.okButtonText}>Iya</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelButton} onPress={handleNoPress}>
                    <Text style={styles.cancelButtonText}>Tidak</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.sectionTitle}>Terima Kasih</Text>
                  <TouchableOpacity style={styles.okButton} onPress={handleOkPress}>
                    <Text style={styles.okButtonText}>OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </ScrollView>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    overlay: {
      flexGrow: 1,
      alignItems: 'center',
      backgroundColor: 'rgba(240, 240, 240, 0.8)',
      padding: 20,
      marginTop: '50%', 
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    infoContainer: {
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 10,
      width: '100%',
      marginBottom: 20,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    infoText: {
      fontSize: 16,
      marginLeft: 10,
    },
    button: {
      backgroundColor: 'red',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginBottom: 20,
      width: '100%',
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
    },
    confirmButton: {
      backgroundColor: 'navy',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginBottom: 20,
      width: '100%',
      alignItems: 'center',
    },
    confirmButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      width: '70%',
      alignItems: 'center', 
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center', 
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'center', 
      alignItems: 'center', 
      marginTop: 20,
      width: '100%', 
    },
    okButton: {
      backgroundColor: 'red',
      paddingVertical: 10,
      paddingHorizontal: 27,
      borderRadius: 5,
      marginRight: 10,
    },
    okButtonText: {
      color: '#fff',
      fontSize: 16,
      textAlign: 'center', 
    },
    cancelButton: {
      backgroundColor: 'navy',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginLeft: 10, 
    },
    cancelButtonText: {
      color: '#fff',
      fontSize: 16,
      textAlign: 'center', 
    },
  });

  export default DetailBencana;
