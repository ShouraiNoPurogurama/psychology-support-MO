import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Thêm gradient
import { Student_Header } from '../../component/Student_Header';
import { Footer } from '../../component/Footer';
import { router } from 'expo-router';

interface ServicePackage {
    id: string;
    name: string;
    description: string;
    price: number;
    durationDays: number;
    isActive: boolean;
    features?: string[];
}

const packages = [
    // Dữ liệu gói dịch vụ giữ nguyên như bạn đã cung cấp
    {
        name: "Student Plan",
        features: [
            "Access to the DAS21 psychological test for evaluating anxiety, stress, and tension levels",
            "Insights into mental well-being through blog articles",
            "Shopping for mental health-related products",
            "Viewing a list of trusted psychological consultants",
            "Booking appointments with licensed therapists"
        ]
    },
    {
        name: "Basic Plan",
        features: [
            "Access to the DAS21 psychological test for evaluating anxiety, stress, and tension levels",
            "Insights into mental well-being through blog articles",
            "Viewing full detailed test results",
            "Personalized 2-week mental health improvement plan based on preferences, food, and activities",
            "Sharing personal stories on the blog",
            "Access to information about upcoming mental health workshops",
            "Shopping for mental health-related products",
            "Viewing a list of trusted psychological consultants",
            "Booking appointments with licensed therapists"
        ]
    },
    {
        name: "Premium Plan",
        features: [
            "Personalized 1-month mental health improvement plan based on preferences, food, and activities",
            "Regular reminders to follow the personalized improvement plan",
            "AI chatbox for daily emotional support and conversations",
            "Discounts on therapist bookings",
            "Unlimited access to the psychological test",
            "Sharing personal stories on the blog"
        ]
    }
];

const ServicePackagesScreen = () => {
    const [servicePackages, setServicePackages] = useState<ServicePackage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServicePackages = async () => {
            try {
                const response = await fetch(
                    'https://psychologysupport-subscription.azurewebsites.net/service-packages?PageIndex=1&PageSize=10'
                );
                const result = await response.json();
                console.log("API Response:", result);

                if (!result.servicePackages || !Array.isArray(result.servicePackages.data)) {
                    throw new Error("API did not return an array in servicePackages.data");
                }

                const activePackages = result.servicePackages.data
                    .filter((pkg: ServicePackage) => pkg.isActive)
                    .map((pkg: any) => {
                        const matchedPackage = packages.find(p => p.name === pkg.name);
                        return {
                            ...pkg,
                            features: matchedPackage ? matchedPackage.features : []
                        };
                    });

                setServicePackages(activePackages);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchServicePackages();
    }, []);

    const renderItem = ({ item }: { item: ServicePackage }) => (
        <LinearGradient
            colors={['#2E0249', '#570A57']} 
            style={styles.packageContainer}
        >
            <Text style={styles.packageName}>{item.name}</Text>
            <Text style={styles.price}>{item.price.toLocaleString()} VND / {item.durationDays} days</Text>

            {item.features && item.features.length > 0 && (
                <>
                    <Text style={styles.subtitle}>Includes:</Text>
                    {item.features.map((feature, index) => (
                        <Text key={index} style={styles.featureText}>
                            <Text style={styles.tick}>✔ </Text>{feature}
                        </Text>
                    ))}
                </>
            )}

            <Text style={styles.description}>{item.description}</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/user/userTask')}
            >
                <Text style={styles.buttonText}>Get Now</Text>
            </TouchableOpacity>
        </LinearGradient>
    );

    return (
        <>
            <Student_Header />
            <ScrollView style={styles.container}>
                <FlatList
                    data={servicePackages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                    scrollEnabled={false}
                />
            </ScrollView>
            <Footer />
        </>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        padding: 20,
        marginTop: 100, // Tăng khoảng cách trên
        marginBottom: 90, // Tăng khoảng cách dưới
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5', // Nền sáng hơn cho toàn bộ trang
    },
    packageContainer: {
        padding: 20, // Tăng padding
        marginBottom: 20,
        borderRadius: 15, // Bo góc mềm hơn
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 5,
    },
    packageName: {
        fontSize: 24, // Tăng kích thước chữ
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
        marginLeft: 20, // Tăng khoảng cách bên trái
        marginVertical: 4, // Thêm khoảng cách dọc giữa các feature
    },
    tick: {
        color: '#00cc00', // Màu xanh lá cây cho dấu tick
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        color: '#ddd',
        textAlign: 'center',
        marginVertical: 12,
    },
    button: {
        backgroundColor: '#fff', // Nền trắng cho nút
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25, // Bo góc nút
        width: '80%',
        alignItems: 'center',
        marginTop: 15,
        alignSelf: 'center', // Căn giữa nút trong container cha
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
    },
    buttonText: {
        color: '#2E0249', // Màu chữ nút tương phản với nền
        fontWeight: '700',
        fontSize: 16,
    },
});

export default ServicePackagesScreen;