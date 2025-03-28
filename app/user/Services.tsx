import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Student_Header } from '../../component/Student_Header';
import { Footer } from '../../component/Footer';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import WebView from 'react-native-webview';

interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  isActive: boolean;
  isPurchased?: boolean;
  features?: string[];
}

const packages = [
  {
    name: 'Student Plan',
    features: [
      'Access to the DAS21 psychological test for evaluating anxiety, stress, and tension levels',
      'Insights into mental well-being through blog articles',
      'Shopping for mental health-related products',
      'Viewing a list of trusted psychological consultants',
      'Booking appointments with licensed therapists',
    ],
  },
  {
    name: 'Basic Plan',
    features: [
      'Access to the DAS21 psychological test for evaluating anxiety, stress, and tension levels',
      'Insights into mental well-being through blog articles',
      'Viewing full detailed test results',
      'Personalized 2-week mental health improvement plan based on preferences, food, and activities',
      'Sharing personal stories on the blog',
      'Access to information about upcoming mental health workshops',
      'Shopping for mental health-related products',
      'Viewing a list of trusted psychological consultants',
      'Booking appointments with licensed therapists',
    ],
  },
  {
    name: 'Premium Plan',
    features: [
      'Personalized 1-month mental health improvement plan based on preferences, food, and activities',
      'Regular reminders to follow the personalized improvement plan',
      'AI chatbox for daily emotional support and conversations',
      'Discounts on therapist bookings',
      'Unlimited access to the psychological test',
      'Sharing personal stories on the blog',
    ],
  },
];

const ServicePackagesScreen = () => {
  const [servicePackages, setServicePackages] = useState<ServicePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoCodes, setPromoCodes] = useState<{ [key: string]: string }>({});
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [profileId, setProfileId] = useState<string | null>(null);
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [upgradeModalVisible, setUpgradeModalVisible] = useState(false);

  useEffect(() => {
    const fetchProfileId = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) throw new Error('User not authenticated');
        const decoded: any = jwtDecode(token);
        const patientId = decoded.profileId;
        if (!patientId) throw new Error('profileId not found in token');
        setProfileId(patientId);
      } catch (error) {
        console.error('Error decoding token:', error);
        router.push('/login');
      }
    };
    fetchProfileId();
  }, []);

  useEffect(() => {
    const fetchServicePackages = async () => {
      if (!profileId) return;
      try {
        const response = await axios.get(
          `https://psychologysupport-subscription.azurewebsites.net/service-packages?patientId=${profileId}&PageIndex=1&PageSize=10`
        );
        const activePackages = response.data.servicePackages.data
          .filter((pkg: ServicePackage) => pkg.isActive)
          .map((pkg: any) => {
            const matchedPackage = packages.find((p) => p.name === pkg.name);
            return {
              ...pkg,
              features: matchedPackage ? matchedPackage.features : [],
            };
          })
          .sort((a: ServicePackage, b: ServicePackage) => a.price - b.price);
        setServicePackages(activePackages);
        setPromoCodes(activePackages.reduce((acc, pkg) => ({ ...acc, [pkg.id]: '' }), {}));
        setLoadingStates(activePackages.reduce((acc, pkg) => ({ ...acc, [pkg.id]: false }), {}));
      } catch (error) {
        console.error('Error fetching service packages:', error);
      } finally {
        setLoading(false);
      }
    };
    if (profileId) fetchServicePackages();
  }, [profileId]);

  const handleBuyService = async (packageId: string) => {
    if (!profileId) {
      router.push('/login');
      return;
    }

    const selectedPackage = servicePackages.find((pkg) => pkg.id === packageId);
    if (!selectedPackage) {
      console.error('Package not found');
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [packageId]: true }));

    try {
      const currentDate = new Date();
      const startDate = currentDate.toISOString();
      const endDate = new Date(currentDate);
      endDate.setDate(endDate.getDate() + selectedPackage.durationDays);
      const endDateISO = endDate.toISOString();

      const payloadData = {
        userSubscription: {
          patientId: profileId,
          servicePackageId: packageId,
          promoCode: promoCodes[packageId] || null,
          giftId: null,
          startDate: startDate,
          endDate: endDateISO,
          paymentMethodName: 'VNPay',
        },
        returnUrl: 'http://localhost:5173/payments/callback',
      };

      console.log('Payload:', JSON.stringify(payloadData, null, 2));
      const response = await axios.post(
        'https://psychologysupport-subscription.azurewebsites.net/user-subscriptions',
        payloadData
      );

      console.log('Response:', JSON.stringify(response.data, null, 2));
      if (response.data && response.data.paymentUrl) {
        setPaymentUrl(response.data.paymentUrl);
        setWebViewVisible(true);
      } else {
        console.error('No payment URL returned');
      }
    } catch (error) {
      console.error('Error purchasing subscription:', error.response?.data || error.message);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [packageId]: false }));
    }
  };

  const handleWebViewNavigation = async (navState: any) => {
    const { url } = navState;
    console.log('WebView URL:', url);

    if (url.includes('http://localhost:5173/payments/callback')) {
      setWebViewVisible(false);

      try {
        const queryParams = new URLSearchParams(url.split('?')[1]);

        const paymentData = {
          amount: queryParams.get("vnp_Amount"),
          bankCode: queryParams.get("vnp_BankCode"),
          bankTranNo: queryParams.get("vnp_BankTranNo"),
          cardType: queryParams.get("vnp_CardType"),
          orderInfo: queryParams.get("vnp_OrderInfo"),
          payDate: queryParams.get("vnp_PayDate"),
          responseCode: queryParams.get("vnp_ResponseCode"),
          tmnCode: queryParams.get("vnp_TmnCode"),
          transactionNo: queryParams.get("vnp_TransactionNo"),
          transactionStatus: queryParams.get("vnp_TransactionStatus"),
          txnRef: queryParams.get("vnp_TxnRef"),
          secureHash: queryParams.get("vnp_SecureHash"),
        };

        await axios.get(
          `https://psychologysupport-payment.azurewebsites.net/payments/callback?${queryParams.toString()}`
        );

        if (
          paymentData.responseCode === "00" &&
          paymentData.transactionStatus === "00"
        ) {
          router.replace({
            pathname: "/user/PaymentSuccessScreen",
            params: {
              transactionNo: paymentData.transactionNo,
              amount: paymentData.amount
                ? (parseInt(paymentData.amount) / 100).toString()
                : "0",
              payDate: paymentData.payDate,
            },
          });
        } else {
          router.replace({
            pathname: "/user/PaymentFailedScreen",
            params: {
              responseCode: paymentData.responseCode,
              message: getVNPayErrorMessage(paymentData.responseCode || "99"),
            },
          });
        }
      } catch (error) {
        console.error("Error processing payment callback:", error);
        router.replace({
          pathname: "/user/PaymentFailedScreen",
          params: {
            error: "Đã xảy ra lỗi khi xử lý kết quả thanh toán",
          },
        });
      }
    }
  };

  const getVNPayErrorMessage = (responseCode: string) => {
    const errorMessages = {
      "24": "Khách hàng hủy giao dịch",
      "51": "Tài khoản không đủ số dư",
      "65": "Vượt hạn mức giao dịch trong ngày",
      "75": "Ngân hàng thanh toán đang bảo trì",
      "99": "Lỗi không xác định",
      "02": "Giao dịch thất bại",
    };
    return errorMessages[responseCode] || "Giao dịch thất bại";
  };

  const handlePromoCodeChange = (packageId: string, value: string) => {
    setPromoCodes((prev) => ({ ...prev, [packageId]: value }));
  };

  const handleUpgradePress = () => {
    setUpgradeModalVisible(true);
  };

  const hasPurchasedPackage = servicePackages.some((pkg) => pkg.isPurchased);
  const isPremiumPurchased = servicePackages.some(
    (pkg) => pkg.isPurchased && pkg.name === 'Premium Plan'
  );

  const renderItem = ({ item }: { item: ServicePackage }) => {
    const isCurrentPlan = item.isPurchased === true;
    const showUpgradeButton = hasPurchasedPackage && !isCurrentPlan && !isPremiumPurchased;
    const showBestPlanMessage = isPremiumPurchased && !isCurrentPlan;

    return (
      <LinearGradient colors={['#2E0249', '#570A57']} style={styles.packageContainer}>
        <Text style={styles.packageName}>{item.name}</Text>
        <Text style={styles.price}>
          {item.price.toLocaleString()} VND / {item.durationDays} days
        </Text>
        {item.features && item.features.length > 0 && (
          <>
            <Text style={styles.subtitle}>Includes:</Text>
            {item.features.map((feature, index) => (
              <Text key={index} style={styles.featureText}>
                <Text style={styles.tick}>✔ </Text>
                {feature}
              </Text>
            ))}
          </>
        )}
        <Text style={styles.description}>{item.description}</Text>
        <TextInput
          placeholder="Add Promotion Code"
          placeholderTextColor="#aaa"
          value={promoCodes[item.id] || ''}
          onChangeText={(text) => handlePromoCodeChange(item.id, text)}
          style={styles.promoInput}
          editable={!isCurrentPlan}
        />
        <TouchableOpacity
          style={[
            styles.button,
            loadingStates[item.id] && styles.buttonDisabled,
            isCurrentPlan && styles.buttonPurchased,
            showBestPlanMessage && styles.buttonDisabled, // Disable style for "Your plan is the best"
          ]}
          onPress={() =>
            showUpgradeButton
              ? handleUpgradePress()
              : !isCurrentPlan && !showBestPlanMessage && handleBuyService(item.id)
          }
          disabled={loadingStates[item.id] || isCurrentPlan || showBestPlanMessage}
        >
          <Text
            style={[
              styles.buttonText,
              isCurrentPlan && styles.buttonTextPurchased,
              showBestPlanMessage && styles.buttonTextDisabled, // Optional: style for disabled text
            ]}
          >
            {loadingStates[item.id]
              ? 'Đang xử lý...'
              : isCurrentPlan
              ? 'Your Current Choice'
              : showBestPlanMessage
              ? 'Your plan is the best'
              : showUpgradeButton
              ? 'Upgrade'
              : 'Get Now'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  };

  if (!profileId && !loading) return null;

  return (
    <>
      <Student_Header />
      <ScrollView style={styles.container}>
        {loading ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>Đang tải...</Text>
        ) : (
          <FlatList
            data={servicePackages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            scrollEnabled={false}
          />
        )}
      </ScrollView>
      <Footer />

      <Modal visible={webViewVisible} animationType="slide" onRequestClose={() => setWebViewVisible(false)}>
        <View style={{ flex: 1 }}>
          {paymentUrl && (
            <WebView
              source={{ uri: paymentUrl }}
              onNavigationStateChange={handleWebViewNavigation}
              style={{ flex: 1 }}
            />
          )}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setWebViewVisible(false)}
          >
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        visible={upgradeModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setUpgradeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              This feature is currently not supported on the current platform
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setUpgradeModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 20,
    marginTop: 100,
    marginBottom: 90,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  packageContainer: {
    padding: 20,
    marginBottom: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  packageName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginVertical: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginTop: 10,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginVertical: 4,
  },
  tick: {
    color: '#00cc00',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#ddd',
    textAlign: 'center',
    marginVertical: 12,
  },
  promoInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    color: '#2E0249',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
    marginTop: 15,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonPurchased: {
    backgroundColor: '#00cc00',
  },
  buttonText: {
    color: '#2E0249',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonTextPurchased: {
    color: '#fff',
  },
  buttonTextDisabled: {
    color: '#fff', // Optional: White text for "Your plan is the best"
  },
  closeButton: {
    backgroundColor: '#2E0249',
    padding: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalText: {
    fontSize: 16,
    color: '#2E0249',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#2E0249',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ServicePackagesScreen;