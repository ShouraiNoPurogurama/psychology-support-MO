import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Student_Header } from '../../component/Student_Header';
import { Footer } from '../../component/Footer';

interface ServicePackage {
    id: number;
    name: string;
    description: string;
    price: number;
    isActive: boolean;
    features: string[];
}

const ServicePackagesScreen = () => {
    const [servicePackages, setServicePackages] = useState<ServicePackage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServicePackages = async () => {
            try {
                const response = await fetch(
                    'https://psychologysupportsubscription-gmgqg4hudadufya9.eastasia-01.azurewebsites.net/service-packages?PageIndex=1&PageSize=10'
                );
                const result = await response.json();

                console.log("API Response:", result);

                if (!result.servicePackages || !Array.isArray(result.servicePackages.data)) {
                    throw new Error("API did not return an array in servicePackages.data");
                }

                const fakeFeatures = [
                    "24/7 mental health support",
                    "Exclusive therapy sessions",
                    "Personalized progress tracking",
                    "Access to mental wellness courses",
                    "Community support & events"
                ];

                const activePackages = result.servicePackages.data
                    .filter((pkg: { isActive: any; }) => pkg.isActive)
                    .map((pkg: any) => ({
                        ...pkg,
                        features: fakeFeatures.slice(0, Math.floor(Math.random() * fakeFeatures.length) + 2) // Random features
                    }));

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
            <Text style={styles.price}>${item.price.toFixed(2)} / month</Text>

            <Text style={styles.subtitle}>Everything on Basic plus:</Text>

            {item.features.map((feature, index) => (
                <Text key={index} style={styles.featureText}>✔ {feature}</Text>
            ))}

            <Text style={styles.description}>{item.description}</Text>

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Get now</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#570A57" />
                <Text>Loading data...</Text>
            </View>
        );
    }

    return (
        <>
            <Student_Header />
            <ScrollView style={styles.container}>
                <FlatList
                    data={servicePackages}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                />
            </ScrollView>
            <Footer/>   
        </>


    );
};

const styles = StyleSheet.create({
    listContainer: {
        padding: 16,
        marginTop: 80,
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
