import { router } from "expo-router";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Footer } from '../../component/Footer';
import { Student_Header } from "../../component/Student_Header";
import { useState, useEffect } from 'react';
import React from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";


export default function studentTest() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<{ id: string, content: string }[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: string | null }>({});




  useEffect(() => {

    const fetchToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          const decoded: any = jwtDecode(token);
          console.log("User ID:", decoded.userId);
        }
      } catch (error) {
        console.error("Error getting token:", error);
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          "https://psychologysupport-test.azurewebsites.net/test-questions/8fc88dbb-daee-4b17-9eca-de6cfe886097",
          {
            params: { PageIndex: 0, PageSize: 21 },
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        console.log("Fetched data:", response.data);
        const testData = response.data?.testQuestions?.data;
        if (!testData || testData.length === 0) {
          throw new Error("No questions found");
        }
        if (!testData || !Array.isArray(testData)) {
          throw new Error("Invalid API response");
        }


        setQuestions(testData);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();

  }, []);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        if (!questions[currentIndex]?.id) return;
        const questionId = questions[currentIndex].id;

        const response = await axios.get(
          `https://psychologysupport-test.azurewebsites.net/question-options/${questionId}`,
          {
            params: { PageIndex: 0, PageSize: 10 },
            headers: { 'Content-Type': 'application/json' }
          }
        );

        console.log("Fetched options:", response.data);
        const optionData = response.data?.questionOptions?.data || [];

        if (!Array.isArray(optionData) || optionData.length === 0) {
          throw new Error("No options found");
        }

        const formattedOptions = optionData.map(opt => ({
          id: opt.id,
          content: opt.content,
        }));

        setOptions(formattedOptions);
      } catch (err) {
        console.error("Error fetching options:", err);
      }
    };

    if (questions.length > 0) {
      fetchOptions();
    }
  }, [questions, currentIndex]);

  const handleSelectOption = (index: number, optionId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [index]: optionId,
    }));
    // Tự động chuyển sang câu tiếp theo hoặc submit nếu là câu cuối
    setTimeout(() => {
      if (index < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        submitTestResults();
      }
    }, 300);
  };

  // const submitTestResults = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem('authToken');
  //     if (!token) throw new Error("User not authenticated");

  //     const decoded: any = jwtDecode(token);
  //     const patientId = decoded.userId; 

  //     const testId = "8fc88dbb-daee-4b17-9eca-de6cfe886097"; 
  //     const selectedOptionIds = questions
  //       .map((q, index) =>
  //         selectedOption !== null ? q.options[selectedOption]?.id : null 
  //       )
  //       .filter(Boolean); 

  //     const response = await axios.post(
  //       "https://psychologysupporttest-cvexa2gae4a3a4gt.eastasia-01.azurewebsites.net/test-results",
  //       { patientId, testId, selectedOptionIds },
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${token}`
  //         }
  //       }
  //     );

  //     console.log("Test results submitted:", response.data);
  //     // router.push("/user/testResult"); 
  //   } catch (error) {
  //     console.error("Error submitting test results:", error);
  //   }
  // };
  const submitTestResults = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error("User not authenticated");

      const decoded: any = jwtDecode(token);
      const patientId = decoded.profileId;

      const testId = "8fc88dbb-daee-4b17-9eca-de6cfe886097";
      const selectedOptionIds = questions.map((q, index) => selectedOptions[index]).filter(Boolean);

      console.log(typeof selectedOptionIds[0]);
      console.log("TestId:", testId);
      console.log("user IDs:", patientId);
      console.log("Selected Option IDs:", selectedOptionIds);

      const response = await axios.post(
        "https://psychologysupport-test.azurewebsites.net/test-results",
        { patientId, testId, selectedOptionIds },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log("Test results submitted:", response.data);
      const testResultId = response.data.testResultId;

      router.push({ pathname: "/user/testResult", params: { testResultId } });

    } catch (error) {
      console.error("Error submitting test results:", error);
    }
  };



  if (loading) {
    return <ActivityIndicator size="large" color="#6B21A8" style={{ marginTop: 50 }} />;
  }

  if (error) {
    return <Text style={{ textAlign: "center", marginTop: 50, color: "red" }}>{error}</Text>;
  }

  if (!questions || questions.length === 0) {
    return <Text style={{ textAlign: "center", marginTop: 50 }}>No questions available.</Text>;
  }

  const currentQuestion = questions[currentIndex];

  return (
    <>
    <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
      <View className='justify-center items-center mt-7'>
        <Text style={styles.title}>MENTAL HEALTH TEST</Text>
        <Text className="mt-2 text-gray-500">Question {currentIndex + 1} of {questions?.length}</Text>

        <View style={styles.questionBox}>
          <Text style={styles.questionText}>{currentQuestion?.content || "No content available"}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                selectedOptions[currentIndex] === option.id && styles.selectedOption
              ]}
              onPress={() => handleSelectOption(currentIndex, option.id)}
            >
              <Text style={styles.optionText}>{option.content}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </View>

      <View style={styles.navigationContainer}>
        <TouchableOpacity style={styles.startOverButton}
          onPress={() => {
            setCurrentIndex(0);
            setSelectedOption(null);
          }}>
          <Text style={styles.buttonText}>Start Over</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.beforeButton, currentIndex === 0 && styles.disabledButton]}
          onPress={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
        >
          <Text style={styles.buttonText}>Before</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>

    <Student_Header />
    <Footer />
  </>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 140,
    fontSize: 27,
    fontWeight: "800",
    color: "#AF93D2"
  },
  questionBox: {
    width: '90%',
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
    textAlign: 'center',
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
});

