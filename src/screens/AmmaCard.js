import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native'; // Added Alert
import { useNavigation } from '@react-navigation/native'; // Import hook
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { styles } from './AmmaListStyles';
import log from '../../utils/logger';

const AMMA_IMAGE = require('../../assets/amma-pic1.png');

export default function AmmaCard({ data }) {
  const [liked, setLiked] = useState(false);
  const navigation = useNavigation(); // Initialize navigation hook

  useEffect(() => {
    log.setScreen('AmmaCard.js');
  }, []);

  const handleBookAppointmentPress = (ammaDetails) => {
    log.i(`Navigating to BookingScreen from AmmaCard for: ${ammaDetails}`);

    // Simplest approach: Always navigate if the button is pressed
    //navigation.navigate('BookingScreen', {
    //  ammaId: data.id,
    //  ammaName: data.name
   // });
    navigation.navigate('BookingScreen')
  };

  return (
    <View style={styles.cardContainer}>
      {/* Amma Image */}
      <View style={styles.imageWrapper}>
        <Image
          source={AMMA_IMAGE}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Card Content */}
      <View style={[styles.cardContent, { paddingRight: 40 }]}>
        {/* Header: Name & Status */}
        <View style={styles.cardHeader}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{data.name}</Text>
            {data.isOnline && <View style={styles.onlineIndicator} />}
          </View>
          <Text style={styles.services}>{data.services}</Text>
        </View>

        {/* Badges Row */}
        <View style={styles.badgesRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{data.rating}</Text>
            <AntDesign name="star" size={8} color="#FFA03C" />
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{data.age} (age)</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.priceIcon}>₹</Text>
            <Text style={styles.badgeText}>{data.price}+</Text>
          </View>
        </View>

        {/* Time & Date */}
        <View style={styles.detailsRow}>
          <View style={styles.detailBlock}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>{data.time}</Text>
          </View>
          <View style={styles.detailBlock}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{data.date}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => handleBookAppointmentPress('ammaDetails')}
        >
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsRow}>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="share" size={18} color="#1C1B1F" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setLiked(!liked)}
        >
          <AntDesign
            name={liked ? "heart" : "hearto"}
            size={18}
            color={liked ? "#FF4B4B" : "#1C1B1F"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}