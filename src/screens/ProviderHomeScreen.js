import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const services = [
  { id: '1', name: 'DocHeal', icon: require('../../assets/doctor.png') },
  { id: '2', name: 'Ammaheal', icon: require('../../assets/elderly.png') },
  { id: '3', name: 'Counselors', icon: require('../../assets/counselor.png') },
  { id: '4', name: 'Physioheal', icon: require('../../assets/physio.png') },
  { id: '5', name: 'Health Educators', icon: require('../../assets/educator.png') },
  { id: '6', name: 'Yoga Instructors', icon: require('../../assets/yoga.png') },
];

const products = [
  {
    id: '1',
    name: 'Amla Hair Oil',
    weight: '250 g',
    price: 500,
    image: require('../../assets/oil.png'),
    isFavorite: false,
    inCart: 0,
  },
  {
    id: '2',
    name: 'knee spray for pain',
    weight: '250 ml',
    price: 1200,
    image: require('../../assets/spray.png'),
    isFavorite: true,
    inCart: 1,
  },
  {
    id: '3',
    name: 'knee spray for pain',
    weight: '250 ml',
    price: 1200,
    image: require('../../assets/spray.png'),
    isFavorite: false,
    inCart: 1,
  },
];

const habits = [
  { id: '1', title: 'Nutrition', color: '#9DB4FF', description: 'Start your day with...' },
  { id: '2', title: 'Exercise', color: '#E8FF9D', description: 'Daily movement...' },
  { id: '3', title: 'Sleep', color: '#F5C4FF', description: 'Quality rest...' },
  { id: '4', title: 'Meditation', color: '#9B6FD6', description: 'Mental wellness...' },
  { id: '5', title: 'Hydration', color: '#C5E7FF', description: 'Drink water...' },
  { id: '6', title: 'Mindfulness', color: '#B99DFF', description: 'Be present...' },
];

export default function ProviderHomeScreen({ navigation, route }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [productList, setProductList] = useState(products);
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();

  const userName = route?.params?.userName || 'Provider';
  const userAddress = '7890 Techzone I, Noida, UP';

  const handleFavoriteToggle = (productId) => {
    setProductList((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, isFavorite: !product.isFavorite }
          : product
      )
    );
  };

  const handleAddToCart = (productId) => {
    setProductList((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, inCart: product.inCart + 1 }
          : product
      )
    );
  };

  const handleRemoveFromCart = (productId) => {
    setProductList((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId && product.inCart > 0
          ? { ...product, inCart: product.inCart - 1 }
          : product
      )
    );
  };

  const categories = ['ALL', 'Oil', 'Cream', 'Spray'];

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#F283AF" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Image
              source={require('../../assets/profile-placeholder2.png')}
              style={styles.profileImage}
            />
            <View style={styles.userInfo}>
              <Text style={styles.greeting}>
                Hi, <Text style={styles.userName}>{userName}</Text>
              </Text>
              <Text style={styles.address}>{userAddress}</Text>
            </View>
          </View>

          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Text style={styles.icon}>🛒</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>1</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Text style={styles.icon}>🔔</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Text style={styles.icon}>👤</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={t('searchServiceProduct') || "What 'Service/Product' do you need?"}
            placeholderTextColor="rgba(0, 0, 0, 0.2)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Services Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('services')}</Text>
          <View style={styles.servicesGrid}>
            {services.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceCard}
                activeOpacity={0.7}
              >
                <View style={styles.serviceIconContainer}>
                  <Text style={styles.serviceIconPlaceholder}>👨‍⚕️</Text>
                </View>
                <Text style={styles.serviceText}>{service.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Products Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('products')}</Text>

          {/* Category Filter */}
          <View style={styles.categoryContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Products Grid */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.productsContainer}>
              {productList.map((product) => (
                <View key={product.id} style={styles.productCard}>
                  {/* Favorite Icon */}
                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => handleFavoriteToggle(product.id)}
                  >
                    <Text style={styles.favoriteIcon}>
                      {product.isFavorite ? '❤️' : '🤍'}
                    </Text>
                  </TouchableOpacity>

                  {/* Product Image Placeholder */}
                  <View style={styles.productImageContainer}>
                    <Text style={styles.productImagePlaceholder}>🧴</Text>
                  </View>

                  {/* Product Info */}
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productWeight}>{product.weight}</Text>

                  {/* Price and Cart */}
                  <View style={styles.productFooter}>
                    <Text style={styles.productPrice}>₹ {product.price}</Text>

                    {product.inCart > 0 ? (
                      <View style={styles.cartControls}>
                        <TouchableOpacity
                          onPress={() => handleRemoveFromCart(product.id)}
                          style={styles.cartButton}
                        >
                          <Text style={styles.cartButtonText}>−</Text>
                        </TouchableOpacity>
                        <Text style={styles.cartQuantity}>{product.inCart}</Text>
                        <TouchableOpacity
                          onPress={() => handleAddToCart(product.id)}
                          style={styles.cartButton}
                        >
                          <Text style={styles.cartButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => handleAddToCart(product.id)}
                      >
                        <Text style={styles.addButtonText}>Add</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* New Habits Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>New habits for you</Text>
          <Text style={styles.sectionSubtitle}>
            Add this habits in your daily routine to improve health.
          </Text>
          <View style={styles.habitsGrid}>
            {habits.map((habit) => (
              <TouchableOpacity
                key={habit.id}
                style={[styles.habitCard, { backgroundColor: habit.color }]}
                activeOpacity={0.7}
              >
                <Text style={styles.habitTitle}>{habit.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Trending Now Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Now</Text>
          <TouchableOpacity style={styles.promoCard} activeOpacity={0.7}>
            <Text style={styles.promoTitle}>
              📢 Health Check Month Promo
            </Text>
            <Text style={styles.promoSubtitle}>
              Trusted Doctors. Better Healing.
            </Text>
            <Text style={styles.promoArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacer */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Home Indicator */}
      <View style={styles.homeIndicator} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F9',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#F283AF',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    marginRight: 12,
    backgroundColor: '#FFC0CB',
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '300',
    color: '#FFF',
    fontFamily: 'Raleway',
  },
  userName: {
    fontWeight: '700',
  },
  address: {
    fontSize: 11,
    fontWeight: '400',
    color: '#FFF',
    fontFamily: 'Raleway',
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  icon: {
    fontSize: 20,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#D34671',
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '500',
    fontFamily: 'Raleway',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginTop: -20,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 11,
    fontWeight: '400',
    fontFamily: 'Raleway',
    color: '#000',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Raleway',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 11,
    fontWeight: '400',
    color: '#000',
    fontFamily: 'Raleway',
    marginBottom: 12,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  serviceCard: {
    width: '30%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  serviceIconContainer: {
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceIconPlaceholder: {
    fontSize: 32,
  },
  serviceText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Raleway',
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFE6EC',
    backgroundColor: '#FFF',
  },
  categoryButtonActive: {
    backgroundColor: '#F283AF',
    borderColor: '#F283AF',
  },
  categoryText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Raleway',
  },
  categoryTextActive: {
    color: '#FFF',
  },
  productsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  productCard: {
    width: 137,
    backgroundColor: '#FFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    padding: 12,
    position: 'relative',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
  },
  favoriteIcon: {
    fontSize: 15,
  },
  productImageContainer: {
    width: '100%',
    height: 94,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  productImagePlaceholder: {
    fontSize: 48,
  },
  productName: {
    fontSize: 8,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Raleway',
    marginBottom: 4,
  },
  productWeight: {
    fontSize: 6,
    fontWeight: '400',
    color: '#000',
    fontFamily: 'Raleway',
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 6,
    fontWeight: '400',
    color: '#000',
    fontFamily: 'Raleway',
  },
  addButton: {
    backgroundColor: '#F283AF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  addButtonText: {
    fontSize: 5,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Raleway',
  },
  cartControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F283AF',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
    gap: 4,
  },
  cartButton: {
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFF',
  },
  cartQuantity: {
    fontSize: 6,
    fontWeight: '500',
    color: '#FFF',
    fontFamily: 'Raleway',
    minWidth: 8,
    textAlign: 'center',
  },
  habitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  habitCard: {
    width: '47%',
    height: 82,
    borderRadius: 10,
    padding: 12,
    justifyContent: 'flex-start',
  },
  habitTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
    fontFamily: 'Raleway',
  },
  promoCard: {
    backgroundColor: '#FFE6EC',
    borderRadius: 10,
    padding: 16,
    position: 'relative',
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Raleway',
    marginBottom: 8,
  },
  promoSubtitle: {
    fontSize: 11,
    fontWeight: '400',
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Raleway',
  },
  promoArrow: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    fontSize: 20,
    color: '#000',
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    width: 190,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
});