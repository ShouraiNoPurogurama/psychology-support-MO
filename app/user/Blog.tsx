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
        content: "Mình đã học cách kiểm soát hơi thở khi lo lắng. Hít vào thật sâu, giữ trong 4 giây và thở ra từ từ. Điều này giúp mình bình tĩnh hơn trong những lúc căng thẳng! 🌬️",
        image: "https://images.pexels.com/photos/3757374/pexels-photo-3757374.jpeg",
        likes: 21,
        comments: 5,
      },
      {
        id: 11,
        user: "minhtuan",
        avatar: "https://i.pravatar.cc/150?img=8",
        content: "Âm nhạc có thể chữa lành tâm hồn! Khi căng thẳng, mình thường nghe nhạc nhẹ hoặc tiếng mưa rơi, cảm giác thật thư giãn. Mọi người có bài nhạc nào yêu thích không? 🎶",
        image: "https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg",
        likes: 28,
        comments: 12,
      },
      {
        id: 12,
        user: "nguyenvana",
        avatar: "https://i.pravatar.cc/150?img=1",
        content: "Hôm nay mình thử dành một ngày không mạng xã hội và thật sự thấy tâm trí thoải mái hơn. Dành thời gian cho bản thân là điều rất cần thiết! 📵",
        image: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg",
        likes: 33,
        comments: 14,
      },
      {
        id: 13,
        user: "trangngoc",
        avatar: "https://i.pravatar.cc/150?img=9",
        content: "Việc nuôi thú cưng giúp mình cảm thấy bớt căng thẳng hơn. Chỉ cần chơi với chúng một chút cũng đủ làm mình vui cả ngày! 🐶🐱",
        image: "https://images.pexels.com/photos/4587953/pexels-photo-4587953.jpeg",
        likes: 37,
        comments: 16,
      },
      {
        id: 14,
        user: "hoangminh",
        avatar: "https://i.pravatar.cc/150?img=5",
        content: "Một cuốn sách hay có thể thay đổi tâm trạng của mình. Gần đây mình đọc một cuốn về tư duy tích cực và cảm thấy tinh thần cải thiện rõ rệt! 📚✨",
        image: "https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg",
        likes: 29,
        comments: 13,
      },
      {
        id: 15,
        user: "phamvanh",
        avatar: "https://i.pravatar.cc/150?img=3",
        content: "Tự viết thư cho chính mình trong tương lai là một cách hay để động viên bản thân. Mình viết về những điều mình mong muốn và những điều mình đã cố gắng. Rất ý nghĩa! 💌",
        image: "https://images.pexels.com/photos/5473957/pexels-photo-5473957.jpeg",
        likes: 26,
        comments: 8,
      },
      {
        id: 16,
        user: "tranthib",
        avatar: "https://i.pravatar.cc/150?img=2",
        content: "Có lúc mình cảm thấy quá tải với công việc, nhưng mình đã thử chia nhỏ công việc và đặt mục tiêu nhỏ hơn. Dần dần mọi thứ cũng dễ thở hơn rất nhiều! 🎯",
        image: "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg",
        likes: 31,
        comments: 10,
      },
      {
        id: 17,
        user: "lananh",
        avatar: "https://i.pravatar.cc/150?img=6",
        content: "Cười nhiều hơn mỗi ngày giúp mình cảm thấy vui vẻ hơn. Hãy thử xem một bộ phim hài hoặc nói chuyện với một người bạn vui tính nhé! 😂💖",
        image: "https://images.pexels.com/photos/4065071/pexels-photo-4065071.jpeg",
        likes: 35,
        comments: 15,
      },
      {
        id: 18,
        user: "duonghoa",
        avatar: "https://i.pravatar.cc/150?img=7",
        content: "Mình nhận ra rằng đôi khi mình cần học cách buông bỏ những điều không thể kiểm soát. Tập trung vào những gì mình có thể làm tốt hơn là lo lắng quá nhiều! ☀️",
        image: "https://images.pexels.com/photos/302904/pexels-photo-302904.jpeg",
        likes: 38,
        comments: 17,
      },
      {
        id: 19,
        user: "minhtuan",
        avatar: "https://i.pravatar.cc/150?img=8",
        content: "Hãy thử gửi một tin nhắn động viên đến ai đó hôm nay. Một câu nói tích cực có thể làm nên điều kỳ diệu cho tâm trạng của họ (và cả bạn nữa)! 💌😊",
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

