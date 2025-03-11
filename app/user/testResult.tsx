import { router } from "expo-router";

import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Footer } from '../../component/Footer';
import { Student_Header } from "../../component/Student_Header";
import { Ionicons } from '@expo/vector-icons';
import React from "react";


type EvaluationType = 'stress' | 'anxiety' | 'depression';

export default function testResult() {
  const results = {
    stress: 11,
    anxiety: 15,
    depression: 18,
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
            <Text style={styles.score}>{results.stress}</Text>
            <Text style={styles.description}>{getEvaluation(results.stress, 'stress')}</Text>
          </View>
          <View style={styles.resultBox}>
            <Text style={styles.sectionTitle}>Anxiety Score:</Text>
            <Text style={styles.score}>{results.anxiety}</Text>
            <Text style={styles.description}>{getEvaluation(results.anxiety, 'anxiety')}</Text>
          </View>
          <View style={styles.resultBox}>
            <Text style={styles.sectionTitle}>Depression Score:</Text>
            <Text style={styles.score}>{results.depression}</Text>
            <Text style={styles.description}>{getEvaluation(results.depression, 'depression')}</Text>
          </View>
          <TouchableOpacity style={styles.unlockButton} onPress={() => router.push("/user/Services")}>
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
    marginTop: 70,
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
    backgroundColor: '#E9D5FF',
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
    color: '#6B21A8',
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
    marginTop: 20,
  },
  unlockText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
