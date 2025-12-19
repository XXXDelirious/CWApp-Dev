import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AmmaCard from './AmmaCard';
import { styles } from './AmmaListStyles';

const AMMA_DATA = [
  {
    id: '1',
    name: 'Amma Name',
    services: 'Services',
    rating: 4.3,
    age: 23,
    price: 200,
    time: '09:00 am - 11:00 am',
    date: '12/12/2025',
    isOnline: true,
  },
  {
    id: '2',
    name: 'Amma Name',
    services: 'Services',
    rating: 4.3,
    age: 23,
    price: 200,
    time: '09:00 am - 11:00 am',
    date: '12/12/2025',
    isOnline: true,
  },
  {
    id: '3',
    name: 'Amma Name',
    services: 'Services',
    rating: 4.3,
    age: 23,
    price: 200,
    time: '09:00 am - 11:00 am',
    date: '12/12/2025',
    isOnline: true,
  },
  {
    id: '4',
    name: 'Amma Name',
    services: 'Services',
    rating: 4.3,
    age: 23,
    price: 200,
    time: '09:00 am - 11:00 am',
    date: '12/12/2025',
    isOnline: true,
  },
  {
    id: '5',
    name: 'Amma Name',
    services: 'Services',
    rating: 4.3,
    age: 23,
    price: 200,
    time: '09:00 am - 11:00 am',
    date: '12/12/2025',
    isOnline: true,
  },
];

export default function AmmaListScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleBackPress = () => {
    if (navigation?.goBack) {
      navigation.goBack();
    }
  };

  const renderAmmaCard = ({ item }) => <AmmaCard data={item} />;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.safeArea}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Amma</Text>
          <Text style={styles.location}> Providing care and housekeeping services.</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <MaterialIcons name="search" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search a Amma"
              placeholderTextColor="rgba(0,0,0,0.2)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Amma List */}
        <FlatList
          scrollEnabled={false}
          data={AMMA_DATA}
          renderItem={renderAmmaCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
