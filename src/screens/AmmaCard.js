import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { styles } from './AmmaListStyles';

const AMMA_IMAGE = require('../../assets/AmmaName.png');

export default function AmmaCard({ data }) {
  const [liked, setLiked] = useState(false);

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

        {/* Badges: Rating, Age, Price */}
        <View style={styles.badgesRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{data.rating}</Text>
            <AntDesign name="star" size={8} color="#FFA03C" solid />
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{data.age} (age)</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.priceIcon}>₹</Text>
            <Text style={styles.badgeText}>{data.price}+</Text>
            <Text style={styles.badgeText}>Per hour</Text>
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

        {/* Book Appointment Button */}
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons: Share & Like */}
      <View style={styles.actionButtonsRow}>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="share" size={18} color="#1C1B1F" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setLiked(!liked)}
        >
          <AntDesign
            name="heart"
            size={18}
            color="#1C1B1F"
            solid={liked}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}