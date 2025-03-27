import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Footer } from "../../../component/doctorFooter";
import { router } from "expo-router";
import React, { useState } from "react";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { DoctorHeader } from "../../../component/doctorHeader";

const chatData = [
  {
    id: "1",
    name: "Minh Trung",
    message: "Hi, Doctor. I have some questions for you .....",
    date: "14 Jan",
    avatar: "https://via.placeholder.com/50",
  },
  {
    id: "2",
    name: "Nguyen An",
    message: "Can we reschedule our appointment?",
    date: "12 Jan",
    avatar: "https://via.placeholder.com/50",
  },
];

export default function ChatList() {
  const [search, setSearch] = useState("");

  const filteredChats = chatData.filter((chat) =>
    chat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <DoctorHeader />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <View style={styles.backButtonContent}>
              <FontAwesome5 name="arrow-left" size={22} color="#6A8CAF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.header}>Chat</Text>
          <FontAwesome
            name="comment"
            size={20}
            color="#AF93D2"
            style={styles.messageIcon}
          />
        </View>

        <TextInput
          style={styles.searchBar}
          placeholder="Search here.."
          value={search}
          onChangeText={setSearch}
        />

        <FlatList
          data={filteredChats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chatItem}
              onPress={() =>
                router.push({
                  pathname: "/doctors/other/chatDetails",
                  params: {
                    id: item.id,
                    name: item.name,
                    avatar: item.avatar,
                    message: item.message,
                  },
                })
              }
            >
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.chatContent}>
                <Text style={styles.chatName}>{item.name}</Text>
                <Text style={styles.chatMessage}>{item.message}</Text>
              </View>
              <Text style={styles.chatDate}>{item.date}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: [{ translateY: -22 }],
    zIndex: 10,
  },
  backButtonContent: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#AF93D2",
    marginLeft: 50,
  },
  searchBar: {
    backgroundColor: "#F2F2F2",
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  chatContent: {
    flex: 1,
  },
  chatName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  chatMessage: {
    color: "#666",
  },
  chatDate: {
    color: "#999",
  },
  messageIcon: {
    marginLeft: 8,
  },
});
