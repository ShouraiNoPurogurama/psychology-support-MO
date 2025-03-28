import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView } from "react-native";
import { HubConnectionBuilder, HttpTransportType, HubConnection } from "@microsoft/signalr";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = () => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  interface Message {
    id: string;
    content: string;
    // Add other fields as needed
  }
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [messageInput, setMessageInput] = useState("");
  interface User {
    id: string;
    fullName: string;
    // Add other fields as needed
  }

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const initializeConnection = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }
      const newConnection = new HubConnectionBuilder()
        .withUrl("https://psychologysupport-chathub.azurewebsites.net/chatHub", {
          accessTokenFactory: () => token,
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect()
        .build();

      setConnection(newConnection);
    };

    initializeConnection();
  }, []);

  useEffect(() => {
    if (!connection) return;
    
    const startConnection = async () => {
      try {
        await connection.start();
        console.log("Connected to ChatHub");
      } catch (err) {
        console.error("Connection failed: ", err);
      }
    };

    startConnection();
  }, [connection]);

  useEffect(() => {
    if (!connection) return;

    connection.on("Users", (users) => {
      setUsers(users);
    });

    connection.on("ReceiveNewMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      connection.off("Users");
      connection.off("ReceiveNewMessage");
    };
  }, [connection]);

  const sendMessage = async () => {
    if (!connection || !selectedUser || !messageInput.trim()) return;

    try {
      await connection.invoke("SendMessage", {
        receiverId: selectedUser.id,
        content: messageInput,
      });
      setMessageInput("");
    } catch (err) {
      console.error("Failed to send message: ", err);
    }
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedUser(item)}>
            <Text style={{ padding: 10, backgroundColor: "#ddd", marginVertical: 5 }}>
              {item.fullName}
            </Text>
          </TouchableOpacity>
        )}
      />

      {selectedUser && (
        <View style={{ flex: 1 }}>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Text style={{ padding: 10, backgroundColor: "#eee", marginVertical: 5 }}>{item.content}</Text>
            )}
          />

          <TextInput
            value={messageInput}
            onChangeText={setMessageInput}
            placeholder="Type a message..."
            style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
          />
          <TouchableOpacity onPress={sendMessage} style={{ backgroundColor: "blue", padding: 10 }}>
            <Text style={{ color: "white" }}>Send</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};


