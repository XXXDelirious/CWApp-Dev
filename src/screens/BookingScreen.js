import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const BookingScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isBooked, setIsBooked] = useState(false);

  // Calendar Helpers
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isSameDate = (d1, year, month, day) => {
    return d1 && d1.getFullYear() === year && d1.getMonth() === month && d1.getDate() === day;
  };

  const isDateInPast = (year, month, day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(year, month, day) < today;
  };

  const handleDateSelect = (day) => {
    setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    setIsBooked(false);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

const handleBooking = () => {
  setIsBooked(true);

  Alert.alert(
    "Success",
    "Your booking has been confirmed!. Check in My booking for making any changes later on",
    [
      {
        text: "OK",
        onPress: () => {
          // This code only runs after the user taps "OK"
          navigation.navigate('HomeScreen');
        }
      }
    ],
    { cancelable: false } // Prevents the user from dismissing the alert by clicking outside
  );
};

  const handleTabPress = (tabId) => {
    if (tabId === 'CW') {
      navigation.navigate('HomeScreen');
    } else if (tabId === 'Account') {
      navigation.navigate('MenuScreen');
    } else {
      // Already on Bookings
    }
  };

  // Calendar Data
  const days = daysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const startDay = firstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

  const calendarWeeks = [];
  let currentWeek = Array(7).fill(null);
  for (let i = 0; i < startDay; i++) currentWeek[i] = null;

  for (let d = 1; d <= days; d++) {
    const dayPos = (startDay + d - 1) % 7;
    currentWeek[dayPos] = d;
    if (dayPos === 6 || d === days) {
      calendarWeeks.push(currentWeek);
      currentWeek = Array(7).fill(null);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Bookings</Text>
          <Text style={styles.headerSubtitle}>Schedule your next service</Text>
        </View>

        {/* Calendar Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcon name="calendar-month" size={20} color="#1a1a1a" />
            <Text style={styles.sectionTitle}>Select Date</Text>
          </View>

          <View style={styles.calendarContainer}>
            <View style={styles.monthNavigation}>
              <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
                <MaterialIcon name="chevron-left" size={24} color="#1a1a1a" />
              </TouchableOpacity>
              <Text style={styles.monthYear}>{formatMonthYear(currentMonth)}</Text>
              <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
                <MaterialIcon name="chevron-right" size={24} color="#1a1a1a" />
              </TouchableOpacity>
            </View>

            <View style={styles.dayLabelsRow}>
              {dayLabels.map((label) => (
                <Text key={label} style={styles.dayLabel}>{label}</Text>
              ))}
            </View>

            {calendarWeeks.map((week, weekIndex) => (
              <View key={weekIndex} style={styles.calendarWeek}>
                {week.map((day, dayIndex) => {
                  const isPast = day && isDateInPast(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                  const isSelected = day && isSameDate(selectedDate, currentMonth.getFullYear(), currentMonth.getMonth(), day);

                  return (
                    <TouchableOpacity
                      key={dayIndex}
                      style={[
                        styles.calendarDay,
                        isSelected && styles.calendarDaySelected,
                        isPast && styles.calendarDayDisabled,
                      ]}
                      onPress={() => day !== null && !isPast && handleDateSelect(day)}
                      disabled={!day || isPast}
                    >
                      {day && (
                        <Text style={[
                          styles.calendarDayText,
                          isSelected && styles.calendarDayTextSelected,
                          isPast && styles.calendarDayTextDisabled,
                        ]}>
                          {day}
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        {/* Time Slot Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcon name="clock-outline" size={20} color="#1a1a1a" />
            <Text style={styles.sectionTitle}>Select Time</Text>
          </View>

          <View style={styles.timeSlotsGrid}>
            {timeSlots.map((time) => {
              const isSelected = selectedTime === time;
              return (
                <TouchableOpacity
                  key={time}
                  style={[styles.timeSlot, isSelected && styles.timeSlotSelected]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={[styles.timeSlotText, isSelected && styles.timeSlotTextSelected]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Booking Summary */}
        {selectedDate && selectedTime && (
          <View style={styles.section}>
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Booking Summary</Text>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Date:</Text>
                <Text style={styles.summaryValue}>{selectedDate.toLocaleDateString()}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Time:</Text>
                <Text style={styles.summaryValue}>{selectedTime}</Text>
              </View>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.bookButton,
            isBooked && styles.bookButtonConfirmed,
            (!selectedDate || !selectedTime) && styles.bookButtonDisabled,
          ]}
          onPress={handleBooking}
          disabled={isBooked || !selectedDate || !selectedTime}
        >
          <Text style={styles.bookButtonText}>
            {isBooked ? 'Booking Confirmed' : 'Confirm Booking'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.helpText}>
          Cancellations can be made up to 24 hours before your booking
        </Text>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <BottomNavigation activeTab="Bookings" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

const navTabs = [
  { id: 'CW', label: 'CW', icon: 'briefcase-variant' },
  { id: 'Bookings', label: 'Bookings', icon: 'file-document-outline' },
  { id: 'Account', label: 'Account', icon: 'account' },
];

const BottomNavigation = ({ activeTab, onTabPress }) => (
  <View style={styles.bottomNavigation}>
    {navTabs.map((tab) => {
      const isActive = activeTab === tab.id;
      return (
        <TouchableOpacity key={tab.id} style={styles.navTab} onPress={() => onTabPress(tab.id)}>
          <MaterialIcon name={tab.icon} size={24} color={isActive ? '#1a1a1a' : '#a0a0a0'} />
          <Text style={[styles.navTabLabel, isActive && styles.navTabLabelActive]}>{tab.label}</Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F9',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 30, // Matching MenuScreen top space
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthYear: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  dayLabelsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayLabel: {
    flex: 1,
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  calendarWeek: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  calendarDay: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  calendarDaySelected: {
    backgroundColor: '#1a1a1a',
  },
  calendarDayDisabled: {
    opacity: 0.3,
  },
  calendarDayText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  calendarDayTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    width: '48%',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFE4F0',
    alignItems: 'center',
  },
  timeSlotSelected: {
    backgroundColor: '#1a1a1a',
    borderColor: '#1a1a1a',
  },
  timeSlotText: {
    color: '#1a1a1a',
    fontWeight: '600',
  },
  timeSlotTextSelected: {
    color: '#FFFFFF',
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFE4F0',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  bookButton: {
    marginHorizontal: 24,
    backgroundColor: '#1a1a1a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  bookButtonConfirmed: {
    backgroundColor: '#10b981',
  },
  bookButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  helpText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999999',
    marginTop: 15,
  },
  bottomSpacing: {
    height: 100, // Bottom padding to prevent content overlap with Nav
  },
  bottomNavigation: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#FFE4F0',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 10,
  },
  navTab: {
    alignItems: 'center',
  },
  navTabLabel: {
    fontSize: 12,
    color: '#a0a0a0',
    marginTop: 4,
  },
  navTabLabelActive: {
    color: '#1a1a1a',
    fontWeight: '600',
  },
});

export default BookingScreen;
