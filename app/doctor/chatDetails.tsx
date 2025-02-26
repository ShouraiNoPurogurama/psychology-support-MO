import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Footer } from '../../component/doctorFooter';

export default function ChatScreen() {
    const { id, name, avatar } = useLocalSearchParams();

    const [messages, setMessages] = useState([
        { id: '1', text: 'Hello Doctor, I have a question.', sender: 'patient' },
        { id: '2', text: 'Sure, how can I help you?', sender: 'doctor' }
    ]);

    const [newMessage, setNewMessage] = useState('');
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    const sendMessage = () => {
        if (newMessage.trim()) {
            setMessages([{ id: Date.now().toString(), text: newMessage, sender: 'doctor' }, ...messages]);
            setNewMessage('');
        }
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} // Adjust this value as needed
        >
            <View style={styles.header}>
{/*                 <Image source={{ uri: avatar }} style={styles.avatar} /> */}
                <Text style={styles.headerTitle}>{name}</Text>
            </View>

            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.messageBubble, item.sender === 'doctor' ? styles.sent : styles.received]}>
                        <Text style={styles.messageText}>{item.text}</Text>
                    </View>
                )}
                inverted
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }} 
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    value={newMessage}
                    onChangeText={setNewMessage}
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
            {!isKeyboardVisible && <Footer />}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#AF93D2',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    messageBubble: {
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        maxWidth: '80%',
        alignSelf: 'flex-start',
    },
    sent: {
        backgroundColor: '#AF93D2',
        alignSelf: 'flex-end',
    },
    received: {
        backgroundColor: '#E5E5E5',
    },
    messageText: {
        fontSize: 16,
        color: '#fff',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        marginBottom: 60, 
    },
    input: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    sendButton: {
        backgroundColor: '#AF93D2',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

