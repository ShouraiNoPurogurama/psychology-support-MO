import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Footer } from '../../component/doctorFooter';

export default function Home() {
    return (
        <>
            <View style={styles.container}>
                <Text style={styles.title}>EmoEase</Text>
                <View style={styles.content}>
                    <Text style={styles.heading}>Welcome, Doctor</Text>
                    <TouchableOpacity style={styles.button} onPress={() => console.log('Appointment Request')}>
                        <Text style={styles.buttonText}>Appointment Request</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => console.log('My Patients')}>
                        <Text style={styles.buttonText}>My Patients</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => console.log('My Schedule')}>
                        <Text style={styles.buttonText}>My Schedule</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Footer />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 50,
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#AF93D2',
        marginBottom: 20,
    },
    content: {
        width: '80%',
        alignItems: 'center',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#AF93D2',
        width: '100%',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});


