import { router, useLocalSearchParams } from "expo-router";

import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Footer } from '../../component/Footer';
import { Student_Header } from "../../component/Student_Header";
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from "react";
import axios from "axios";


type EvaluationType = 'stress' | 'anxiety' | 'depression';

export default function testResult() {

  const { testResultId } = useLocalSearchParams();
  console.log("id:", testResultId);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState({
    stress: 0,
    anxiety: 0,
    depression: 0,
  });
  useEffect(() => {
    const fetchTestResult = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://psychologysupport-test.azurewebsites.net/test-result/${testResultId}`
        );

        const result = response.data.testResult;
        setScores({
          stress: result.stressScore.value,
          anxiety: result.anxietyScore.value,
          depression: result.depressionScore.value,
        });
      } catch (error) {
        console.error("Error fetching test results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (testResultId) {
      fetchTestResult();
    }
  }, [testResultId]);

  const getCategoryFromScore = (score: number, type: EvaluationType): string => {
    if (type === 'stress') {
      if (score <= 14) return 'Normal';
      if (score <= 18) return 'Mild';
      if (score <= 25) return 'Moderate';
      if (score <= 33) return 'Severe';
      return 'Extremely Severe';
    }
    if (type === 'anxiety') {
      if (score <= 7) return 'Normal';
      if (score <= 9) return 'Mild';
      if (score <= 14) return 'Moderate';
      if (score <= 19) return 'Severe';
      return 'Extremely Severe';
    }
    if (type === 'depression') {
      if (score <= 9) return 'Normal';
      if (score <= 13) return 'Mild';
      if (score <= 20) return 'Moderate';
      if (score <= 27) return 'Severe';
      return 'Extremely Severe';
    }
    return 'Normal';
  };
  
  const getColorForCategory = (category: string) => {
    switch (category) {
      case "Normal":
        return "green";
      case "Mild":
        return "#FFD700";

      case "Moderate":
        return "orange";
      case "Severe":
        return "red";
      case "Extremely Severe":
        return "purple";
      default:
        return "gray";
    }
  };
  const getEvaluation = (score: number, type: EvaluationType): string => {
    if (type === 'stress') {
      if (score <= 14) return 'You show no signs of stress disorder (Normal).';
      if (score <= 18) return 'You have mild stress symptoms.';
      if (score <= 25) return 'You experience moderate stress levels.';
      if (score <= 33) return 'You experience severe stress. Seeking professional help is recommended.';
      return 'You experience extremely severe stress. Immediate support is advisable.';
    }
    if (type === 'anxiety') {
      if (score <= 7) return 'You show no signs of anxiety disorder (Normal).';
      if (score <= 9) return 'You have mild anxiety symptoms.';
      if (score <= 14) return 'You experience moderate anxiety.';
      if (score <= 19) return 'You experience severe anxiety. Consider professional support.';
      return 'You experience extremely severe anxiety. Seeking professional help is strongly recommended.';
    }
    if (type === 'depression') {
      if (score <= 9) return 'You show no signs of depression (Normal).';
      if (score <= 13) return 'You have mild depression symptoms.';
      if (score <= 20) return 'You experience moderate depression.';
      if (score <= 27) return 'You experience severe depression. Seeking support is advisable.';
      return 'You experience extremely severe depression. Immediate support is strongly recommended.';
    }
    return '';
  };
  return (
    <>
      <Student_Header />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>MENTAL HEALTH TEST RESULT</Text>
          
          <View style={styles.resultBox}>
            <Text style={styles.sectionTitle}>Stress Score:</Text>
            <Text style={[
              styles.score,
              { color: getColorForCategory(getCategoryFromScore(scores.stress, 'stress')) }
            ]}>
              {scores.stress}
            </Text>
            <Text style={styles.description}>{getEvaluation(scores.stress, 'stress')}</Text>
          </View>
  
          <View style={styles.resultBox}>
            <Text style={styles.sectionTitle}>Anxiety Score:</Text>
            <Text style={[
              styles.score,
              { color: getColorForCategory(getCategoryFromScore(scores.anxiety, 'anxiety')) }
            ]}>
              {scores.anxiety}
            </Text>
            <Text style={styles.description}>{getEvaluation(scores.anxiety, 'anxiety')}</Text>
          </View>
  
          <View style={styles.resultBox}>
            <Text style={styles.sectionTitle}>Depression Score:</Text>
            <Text style={[
              styles.score,
              { color: getColorForCategory(getCategoryFromScore(scores.depression, 'depression')) }
            ]}>
              {scores.depression}
            </Text>
            <Text style={styles.description}>{getEvaluation(scores.depression, 'depression')}</Text>
          </View>
  
          <TouchableOpacity 
            style={styles.unlockButton} 
            onPress={() => router.push("/user/Services")}
          >
            <Ionicons name="lock-open" size={24} color="white" />
            <Text style={styles.unlockText}>Unlock Full Treatment Course</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    padding: 20,
    alignItems: 'center',
    marginTop: 90,
    marginBottom: 50,
    gap: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B21A8',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultBox: {
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#6B21A8',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'Black',
  },
  score: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6B21A8',
    marginVertical: 5,
  },
  description: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
  },
  unlockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B799D0',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    marginTop: 5,
    marginBottom:50
  },
  unlockText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
