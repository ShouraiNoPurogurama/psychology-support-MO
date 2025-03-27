import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Linking from 'expo-linking';

const PaymentCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useLocalSearchParams();

  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const { url } = event;
      console.log('Received deep link:', url);

      if (url && url.startsWith('yourapp://payment')) {
        const queryParams = new URLSearchParams(url.split('?')[1]);
        const paymentData = {
          amount: queryParams.get('vnp_Amount'),
          bankCode: queryParams.get('vnp_BankCode'),
          bankTranNo: queryParams.get('vnp_BankTranNo'),
          cardType: queryParams.get('vnp_CardType'),
          orderInfo: queryParams.get('vnp_OrderInfo'),
          payDate: queryParams.get('vnp_PayDate'),
          responseCode: queryParams.get('vnp_ResponseCode'),
          tmnCode: queryParams.get('vnp_TmnCode'),
          transactionNo: queryParams.get('vnp_TransactionNo'),
          transactionStatus: queryParams.get('vnp_TransactionStatus'),
          txnRef: queryParams.get('vnp_TxnRef'),
          secureHash: queryParams.get('vnp_SecureHash'),
        };

        console.log('Payment Data:', paymentData);

        if (!paymentData.responseCode || !paymentData.transactionStatus) {
          setError('Không nhận được trạng thái giao dịch từ VNPay');
          router.replace({
            pathname: '/user/PaymentFailedScreen',
            params: { error: 'Không nhận được trạng thái giao dịch từ VNPay' },
          });
          return;
        }

        if (paymentData.responseCode === '00' && paymentData.transactionStatus === '00') {
          router.replace({
            pathname: '/user/PaymentSuccessScreen',
            params: {
              transactionNo: paymentData.transactionNo,
              amount: paymentData.amount ? (parseInt(paymentData.amount) / 100).toString() : '0',
              payDate: paymentData.payDate,
            },
          });
        } else {
          router.replace({
            pathname: '/user/PaymentFailedScreen',
            params: {
              responseCode: paymentData.responseCode,
              message: getVNPayErrorMessage(paymentData.responseCode),
            },
          });
        }
      } else {
        setError('URL callback không hợp lệ');
        router.replace({
          pathname: '/user/PaymentFailedScreen',
          params: { error: 'URL callback không hợp lệ' },
        });
      }
      setLoading(false);
    };

    const initialize = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink({ url: initialUrl });
      } else if (params.url) {
        console.log('Processing URL from params:', params.url);
        handleDeepLink({ url: params.url }); // Xử lý URL từ WebView
      } else {
        setError('Không nhận được URL thanh toán');
        router.replace({
          pathname: '/user/PaymentFailedScreen',
          params: { error: 'Không nhận được URL thanh toán' },
        });
        setLoading(false);
      }
    };

    initialize();

    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => subscription.remove();
  }, [params.url]);

  const getVNPayErrorMessage = (responseCode: string) => {
    const errorMessages = {
      '00': 'Thanh toán thành công',
      '24': 'Khách hàng hủy giao dịch',
      '51': 'Tài khoản không đủ số dư',
      '65': 'Vượt hạn mức giao dịch trong ngày',
      '75': 'Ngân hàng thanh toán đang bảo trì',
      '99': 'Lỗi không xác định',
      '02': 'Giao dịch thất bại',
    };
    return errorMessages[responseCode] || 'Giao dịch thất bại';
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <View style={{ alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text style={{ marginTop: 10, fontSize: 16, color: '#2E0249' }}>
            Đang xử lý kết quả thanh toán...
          </Text>
        </View>
      ) : error ? (
        <Text style={{ fontSize: 16, color: 'red', textAlign: 'center' }}>{error}</Text>
      ) : null}
    </View>
  );
};

export default PaymentCallback;