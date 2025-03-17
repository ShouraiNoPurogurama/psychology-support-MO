import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
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
]


const ServicePackagesScreen = () => {
    const [servicePackages, setServicePackages] = useState<ServicePackage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServicePackages = async () => {
            try {
                const response = await fetch(
                    'https://psychologysupportsubscription-azb9d4hfameeengd.southeastasia-01.azurewebsites.net/service-packages?PageIndex=1&PageSize=10'
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
        <View style={styles.packageContainer}>
            <Text style={styles.packageName}>{item.name}</Text>
            <Text style={styles.price}>{item.price.toLocaleString()} VND / {item.durationDays} days</Text>

            {item.features && item.features.length > 0 && (
                <>
                    <Text style={styles.subtitle}>Includes:</Text>
                    {item.features.map((feature, index) => (
                        <Text key={index} style={styles.featureText}>✔ {feature}</Text>
                    ))}
                </>
            )}

            <Text style={styles.description}>{item.description}</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    // Alert.alert("Thông báo", "Thanh toán thành công");
                    router.push('/user/userTask'); 
                }}
            >
                <Text style={styles.buttonText}>Get now</Text>

            </TouchableOpacity>
        </View>
    );


    // if (loading) {
    //     return (
    //         <View style={styles.loadingContainer}>
    //             <ActivityIndicator size="large" color="#570A57" />
    //             <Text>Loading data...</Text>
    //         </View>
    //     );
    // }

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
        padding: 16,
        marginTop: 90,
        marginBottom: 80
    },
    container: {
        flex: 1,
    },
    packageContainer: {
        backgroundColor: '#2E0249',
        padding: 16,
        marginBottom: 16,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 3,
    },
    packageName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginVertical: 8,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    featureText: {
        fontSize: 14,
        color: '#fff',
        textAlign: 'left',
        alignSelf: 'flex-start',
        marginLeft: 16,
    },
    description: {
        fontSize: 14,
        color: '#ccc',
        textAlign: 'center',
        marginBottom: 12,
        marginTop: 8,
    },
    button: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        width: '80%',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ServicePackagesScreen;
