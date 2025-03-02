import { router } from "expo-router";

import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Footer } from '../../component/Footer';
import { Student_Header } from "../../component/Student_Header";
import { useState } from 'react';



export default function studentTest() {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  return (
    <>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View className='justify-center items-center mt-7' >
          <Text style={{ marginTop: 50, fontSize: 27, fontWeight: "800", color: "#AF93D2" }} >MENTAL HEALTH TEST</Text>
          <Text className="mt-2 text-gray-500">Question 1 of 21</Text>
          <View style={styles.questionBox}>
            <Text style={styles.questionText}>
              I experienced breathing difficulty (e.g. excessively rapid breathing,
              breathlessness in the absence of physical exertion)          </Text>
          </View>
          <View style={styles.optionsContainer}>
            {['Did not apply to me at all', 'Applied to me to some degree, or some of the time', 'Applied to me to a considerable degree or a good part of time', 'Applied to me very much or most of the time'].map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.optionButton, selectedOption === index && styles.selectedOption]}
                onPress={() => setSelectedOption(index)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.navigationContainer}>
          <TouchableOpacity style={styles.startOverButton} onPress={() => setSelectedOption(null)}>
            <Text style={styles.buttonText}>Start Over</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.beforeButton}>
            <Text style={styles.buttonText}>Before</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.nextButton, selectedOption === null && styles.disabledButton]}
            onPress={() => {
              if (selectedOption !== null) {
                router.push("/user/testResult");
              }
            }}
            disabled={selectedOption === null}

          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <Student_Header />
      <Footer />
    </>


  );
}
const styles = StyleSheet.create({
  questionBox: {
    width: '100%',
    backgroundColor: '#E9D5FF',
    padding: 20,
    borderRadius: 20,
    marginTop: 20,
    borderColor: "black",
    borderWidth: 2

  },
  questionText: {
    fontSize: 22,
    color: '#6B21A8',
    fontWeight: 'bold',
  },
  optionsContainer: {
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 40,
  },
  optionButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    marginVertical: 5,
    alignItems: 'center',
    height: 80,
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 18,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'

  },
  selectedOption: {
    backgroundColor: '#A855F7',
    borderColor: '#6B21A8',

  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 40,
  },
  startOverButton: {
    flex: 1,
    padding: 12,
    backgroundColor: 'green',
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  beforeButton: {
    flex: 1,
    padding: 12,
    backgroundColor: 'skyblue',
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  nextButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#AF93D2',
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  disabledButton: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
})


