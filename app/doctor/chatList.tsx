import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Footer } from "../../component/doctorFooter";
import { router } from "expo-router";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";

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
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => router.push("/doctor/doctorHome")}
            style={styles.backButton}
          >
            <FontAwesome name="arrow-left" size={20} color="#888" />
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
                  pathname: "/doctor/chatDetails",
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
    padding: 5,
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#AF93D2",
    marginLeft: 10,
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
