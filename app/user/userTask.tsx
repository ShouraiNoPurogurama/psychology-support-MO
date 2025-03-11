import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";
import { Student_Header } from "../../component/Student_Header";
import { Footer } from "../../component/Footer";

const tasksData: Record<string, { id: string; text: string; time: string; completed: boolean }[]> = {
  "2025-03-10": [
    { id: "1", text: "Meditate – 5-10 minutes", time: "08:00 AM", completed: false },
    { id: "2", text: "Listen to Music – Play calming tunes", time: "10:00 AM", completed: true },
  ],
  "2025-03-11": [
    { id: "3", text: "Limit Screen Time", time: "03:00 PM", completed: false },
    { id: "4", text: "Sleep Well – Get 7-9 hours", time: "10:00 PM", completed: true },
  ],
  "2025-03-12": [
    { id: "5", text: "Go for a walk – 30 minutes", time: "07:00 AM", completed: false },
    { id: "6", text: "Read a book – 20 minutes", time: "09:00 PM", completed: false },
  ],
  "2025-03-13": [
    { id: "7", text: "Practice mindfulness", time: "06:30 AM", completed: false },
    { id: "8", text: "Hydrate – Drink 8 glasses of water", time: "11:00 AM", completed: true },
  ],
  "2025-03-14": [
    { id: "9", text: "Stretching exercises – 15 minutes", time: "07:30 AM", completed: false },
    { id: "10", text: "Plan the day", time: "08:00 AM", completed: false },
  ],
  "2025-03-15": [
    { id: "11", text: "Exercise – 30 minutes workout", time: "07:00 AM", completed: false },
    { id: "12", text: "Read a book – 20 minutes", time: "09:00 PM", completed: false },
  ],
  "2025-03-20": [
    { id: "7", text: "Drink water – Stay hydrated", time: "08:00 AM", completed: true },
  ],
};


export default function UserTask() {
  const [selectedDate, setSelectedDate] = useState("2025-03-12");
  const [tasks, setTasks] = useState(tasksData[selectedDate] || []);


  
  const toggleTask = (id:string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <>
    <Student_Header/>
    <ScrollView style={{ flex: 1, backgroundColor: "white", padding: 20, marginTop:70, marginBottom:50 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", textAlign: "center" }}>
        Today's Tasks
      </Text>
      
      <Calendar
        onDayPress={(day:any) => {
          setSelectedDate(day.dateString);
          setTasks(tasksData[day.dateString] || []);
        }}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: "#6a5acd" },
        }}
      />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleTask(item.id)}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#ddd",
            }}
          >
            <View>
              <Text style={{ fontSize: 16, textDecorationLine: item.completed ? "line-through" : "none" }}>
                {item.text}
              </Text>
              <Text style={{ fontSize: 14, color: "gray" }}>{item.time}</Text>
            </View>
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: "#6a5acd",
                backgroundColor: item.completed ? "#6a5acd" : "white",
              }}
            />
          </TouchableOpacity>
        )}
      />
    </ScrollView>
    <Footer/>
    
    </>

    
  );
}