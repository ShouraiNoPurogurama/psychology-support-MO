import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Dimensions} from 'react-native';
import { router } from 'expo-router';
import { Footer } from '../../component/Footer';
import { Student_Header } from '../../component/Student_Header';
import '../../assets/images/HomeScreen.png';
import '../../assets/images/Doctor.jpg';

const { width: screenWidth } = Dimensions.get('window');
const HomeScreenImage= require("../../assets/images/HomeScreen.png");
const DoctorImage= require("../../assets/images/Doctor.jpg");

export default function Home() {
    return (
        <>
            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                <View className="flex-1 justify-center items-center px-4">
                    <View style={{ position: 'relative' }}>
                        <Image
                            source={HomeScreenImage}
                            style={{ width: screenWidth, height: 500, borderRadius:20 }}
                            resizeMode="cover"
                        />

                        <View style={styles.bannerContainer}>
                            <Text style={styles.bannerText}>
                                Proceed to assess your current condition with the first test 
                            </Text>
                            <TouchableOpacity 
                            style={styles.testButton}
                            onPress={() =>router.push("/user/studentTest")}
                            >
                                <Text style={styles.testButtonText}>Do the test</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View className="flex-1 justify-center items-center px-4 mt-1">
                    <View style={{ position: 'relative' }}>
                        <Image
                            source={DoctorImage}
                            style={{ width: screenWidth, height: 500, borderRadius:20}}
                            resizeMode="cover"
                        />

                        <View style={styles.bannerContainer}>
    
                            <TouchableOpacity 
                            style={styles.testButton}
                            onPress={() =>router.push("/user/doctorList")}
                            >
                                <Text style={styles.testButtonText}>CONTACT WITH OUR DOCTOR</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <Footer />
            <Student_Header />
        </>
    );
}

const styles = StyleSheet.create({
    bannerContainer: {
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: [{ translateX: -190 }, { translateY: 155 }],
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        gap: 50, 
        width: 'auto'
    },
    bannerText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
        width:250
    },
    testButton: {
        backgroundColor: '#AF93D2',
        paddingVertical: 9,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    testButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
