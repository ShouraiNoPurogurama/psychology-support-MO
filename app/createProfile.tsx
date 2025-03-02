import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';



export default function createProfile() {
    const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
    const [selectedSport, setSelectedSport] = useState<string | null>(null);
    const [selectedFrequency, setSelectedFrequency] = useState<string | null>(null);
    const conditions = [
        "Depression", "Anxiety", "PTSD", "Bipolar Disorder", "OCD", "ADHD"
    ];
    const sports = [
        { name: "Football", image: ("https://upload.wikimedia.org/wikipedia/commons/1/1d/Football_Pallo_valmiina-cropped.jpg") },
        { name: "Basketball", image: ("https://contents.mediadecathlon.com/p2705092/k$34bfd1a1787dcb27067366160c047e32/basketball-bt900-size-7fiba-approved-for-boys-and-adults-tarmak-8648080.jpg?f=1920x0&format=auto") },
        { name: "Tennis", image: ("https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Closeup_of_a_tennis_ball_%282%29.jpg/640px-Closeup_of_a_tennis_ball_%282%29.jpg") },
        { name: "Swimming", image: ("https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/40._Schwimmzonen-_und_Mastersmeeting_Enns_2017_100m_Brust_Herren_USC_Traun-9897.jpg/640px-40._Schwimmzonen-_und_Mastersmeeting_Enns_2017_100m_Brust_Herren_USC_Traun-9897.jpg") },
        { name: "Badminton", image: ("https://www.racquetpoint.com/cdn/shop/articles/what-is-badminton-racquet-point.jpg?v=1732071171") },
        { name: "Yoga", image: ("https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2021/9/11/photo-1631370026092-1631370027286282190795.jpg") },


    ];

    const frequencies = ["Everyday", "Once a week", "Once a month", "Rarely"];

    const toggleCondition = (condition: string) => {
        setSelectedConditions(prev =>
            prev.includes(condition) ? prev.filter(c => c !== condition) : [...prev, condition]
        );
    };
    
    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.title}>EmoEase</Text>
                <View style={styles.formContainer}>
                    <Text style={styles.heading}>Create Profile</Text>
                    <Text className='font-semibold mb-3  ' >Your Personal Information</Text>
                    <TextInput style={styles.input} placeholder="Enter Your Full Name" />
                    <TextInput style={styles.input} placeholder="Enter Your Address" />
                    <TextInput style={styles.input} placeholder="Gender" />
                    <Text className=' font-semibold mb-3 ' >Your Health Condition</Text>
                    {conditions.map(condition => (
                        <TouchableOpacity
                            key={condition}
                            onPress={() => toggleCondition(condition)}
                            style={[styles.conditionOption, selectedConditions.includes(condition) && styles.selectedOption]}
                        >
                            <Text>{condition}</Text>
                        </TouchableOpacity>
                    ))}
                    <Text className=' font-semibold mb-3 mt-3 ' >Your Favourite Activities</Text>
                    <View style={styles.sportsContainer}>
                        {sports.map(sport => (
                            <TouchableOpacity
                                key={sport.name}
                                onPress={() => setSelectedSport(sport.name)}
                                style={[styles.sportOption, selectedSport === sport.name && styles.selectedOption]}
                            >
                                <Image source={{ uri: sport.image }} style={styles.sportImage} />
                                <Text>{sport.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {selectedSport && (
                        <View style={styles.frequencyContainer}>
                            <Text>How often do you play {selectedSport}?</Text>
                            {frequencies.map(freq => (
                                <TouchableOpacity
                                    key={freq}
                                    onPress={() => setSelectedFrequency(freq)}
                                    style={[styles.frequencyOption, selectedFrequency === freq && styles.selectedOption]}
                                >
                                    <Text>{freq}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}


                    <TouchableOpacity onPress={() => router.push("/user/home")} style={styles.button}>
                        <Text style={styles.buttonText}>Complete</Text>
                    </TouchableOpacity>

                </View>
            </View>

        </ScrollView>

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
    formContainer: {
        width: '80%',
        alignItems: 'center',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 2,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 15,
        width: '100%',
        marginBottom: 15,
        borderColor: '#ccc',
    },
    selectedOption: {
        backgroundColor: 'pink',
        borderColor: '#AF93D2',
        color: 'white',
    },
    conditionOption: {
        padding: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    sportsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    sportOption: {
        alignItems: 'center',
        margin: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },
    sportImage: {
        width: 50,
        height: 50,
        marginBottom: 5,
    },
    frequencyContainer: {
        marginTop: 10,
        alignItems: 'center',
      },
      frequencyOption: {
        padding: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
      },
    button: {
        backgroundColor: '#AF93D2',
        width: '100%',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
