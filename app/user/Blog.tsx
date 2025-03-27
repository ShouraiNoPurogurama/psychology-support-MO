import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Student_Header } from "../../component/Student_Header";
import { Footer } from "../../component/Footer";

const blogPosts = [
    {
        id: 10,
        user: "duonghoa",
        avatar: "https://i.pravatar.cc/150?img=7",
        content: "I’ve learned how to control my breathing when anxious. Take a deep breath, hold it for 4 seconds, and exhale slowly. This helps me stay calm during stressful moments! 🌬️",
        image: "https://images.pexels.com/photos/3757374/pexels-photo-3757374.jpeg",
        likes: 21,
        comments: 5,
    },
    {
        id: 11,
        user: "minhtuan",
        avatar: "https://i.pravatar.cc/150?img=8",
        content: "Music can heal the soul! When stressed, I often listen to soft music or the sound of rain falling—it feels so relaxing. Do you all have any favorite songs? 🎶",
        image: "https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg",
        likes: 28,
        comments: 12,
    },
    {
        id: 12,
        user: "nguyenvana",
        avatar: "https://i.pravatar.cc/150?img=1",
        content: "Today I tried spending a day without social media, and I really felt my mind become more at ease. Taking time for yourself is so necessary! 📵",
        image: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg",
        likes: 33,
        comments: 14,
    },
    {
        id: 13,
        user: "trangngoc",
        avatar: "https://i.pravatar.cc/150?img=9",
        content: "Raising pets helps me feel less stressed. Just playing with them a little is enough to make me happy all day! 🐶🐱",
        image: "https://images.pexels.com/photos/4587953/pexels-photo-4587953.jpeg",
        likes: 37,
        comments: 16,
    },
    {
        id: 14,
        user: "hoangminh",
        avatar: "https://i.pravatar.cc/150?img=5",
        content: "A good book can change my mood. Recently, I read a book about positive thinking, and I’ve noticed a clear improvement in my spirit! 📚✨",
        image: "https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg",
        likes: 29,
        comments: 13,
    },
    {
        id: 15,
        user: "phamvanh",
        avatar: "https://i.pravatar.cc/150?img=3",
        content: "Writing a letter to my future self is a great way to motivate myself. I wrote about the things I hope for and the efforts I’ve made. It’s very meaningful! 💌",
        image: "https://images.pexels.com/photos/5473957/pexels-photo-5473957.jpeg",
        likes: 26,
        comments: 8,
    },
    {
        id: 16,
        user: "tranthib",
        avatar: "https://i.pravatar.cc/150?img=2",
        content: "Sometimes I feel overwhelmed with work, but I’ve tried breaking it into smaller tasks and setting smaller goals. Gradually, things feel much more manageable! 🎯",
        image: "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg",
        likes: 31,
        comments: 10,
    },
    {
        id: 17,
        user: "lananh",
        avatar: "https://i.pravatar.cc/150?img=6",
        content: "Laughing more each day helps me feel happier. Try watching a comedy movie or chatting with a funny friend! 😂💖",
        image: "https://images.pexels.com/photos/4065071/pexels-photo-4065071.jpeg",
        likes: 35,
        comments: 15,
    },
    {
        id: 18,
        user: "duonghoa",
        avatar: "https://i.pravatar.cc/150?img=7",
        content: "I’ve realized that sometimes I need to learn to let go of things I can’t control. Focusing on what I can do better is better than worrying too much! ☀️",
        image: "https://images.pexels.com/photos/302904/pexels-photo-302904.jpeg",
        likes: 38,
        comments: 17,
    },
    {
        id: 19,
        user: "minhtuan",
        avatar: "https://i.pravatar.cc/150?img=8",
        content: "Try sending an encouraging message to someone today. A positive word can work wonders for their mood (and yours too)! 💌😊",
        image: "https://images.pexels.com/photos/302904/pexels-photo-302904.jpeg",
        likes: 42,
        comments: 20,
    }
];
export default function Blog() {
    const [posts, setPosts] = useState(blogPosts);

    const handleLike = (id: number) => {
        setPosts(posts.map(post =>
            post.id === id ? { ...post, likes: post.likes + 1 } : post
        ));
    };

    return (
        <>
        <Student_Header/>
            <ScrollView style={styles.container}>
                {posts.map((post) => (
                    <View key={post.id} style={styles.postCard}>
                        <Text style={styles.author}>{post.user}</Text>
                        <Image source={{ uri: post.image }} style={styles.image} />
                        <Text style={styles.content}>{post.content}</Text>

                        <View style={styles.actions}>
                            <TouchableOpacity onPress={() => handleLike(post.id)} style={styles.actionButton}>
                                <Ionicons name="heart" size={20} color="red" />
                                <Text>{post.likes}</Text>
                            </TouchableOpacity>

                            <View style={styles.actionButton}>
                                <Ionicons name="chatbubble-outline" size={20} color="gray" />
                                <Text>{post.comments}</Text>
                            </View>

                            <TouchableOpacity style={styles.actionButton}>
                                <Ionicons name="repeat-outline" size={20} color="blue" />
                                <Text>Repost</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionButton}>
                                <Ionicons name="send-outline" size={20} color="green" />
                                <Text>Send</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
                <Footer/>
        </>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F8F8",
        paddingHorizontal: 20,
        paddingVertical: 80,
    },
    postCard: {
        backgroundColor: "#FFF",
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    author: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 5,
    },
    image: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    content: {
        fontSize: 14,
        color: "#333",
        marginBottom: 10,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
});

