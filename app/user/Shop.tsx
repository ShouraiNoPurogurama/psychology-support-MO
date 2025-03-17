import React from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Student_Header } from "../../component/Student_Header";
import { Footer } from "../../component/Footer";

const products = [
  {
    id: 1,
    name: "Tinh dầu oải hương",
    price: 150000,
    description: "Giúp thư giãn, giảm căng thẳng và cải thiện giấc ngủ.",
    rating: 4.8,
    purchases: 320,
    image: "https://fujispacenter.vn/wp-content/uploads/2024/07/thumb-14.jpg",
  },
  {
    id: 2,
    name: "Nến thơm vani",
    price: 120000,
    description: "Mang đến hương thơm dịu nhẹ, tạo không gian ấm áp.",
    rating: 4.7,
    purchases: 210,
    image: "https://product.hstatic.net/200000485529/product/nen-thom-vanilla_44441940e88b45e7b8a67afe1fc636df_master.jpg",
  },
  {
    id: 3,
    name: "Tinh dầu bạc hà",
    price: 130000,
    description: "Giúp thông mũi, giảm đau đầu và tăng sự tỉnh táo.",
    rating: 4.6,
    purchases: 150,
    image: "https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/https://cms-prod.s3-sgn09.fptcloud.com/giai_dap_tinh_dau_bac_ha_co_nhung_cong_dung_gi_1_acb07379cc.jpg",
  },
  {
    id: 4,
    name: "Nến thơm hoa nhài",
    price: 140000,
    description: "Tạo cảm giác dễ chịu, giảm căng thẳng và lo âu.",
    rating: 4.9,
    purchases: 180,
    image: "https://thegioihoahong.com/wp-content/uploads/2022/06/nen-thom-hoa-nhai-2.jpg",
  },
  {
    id: 5,
    name: "Tinh dầu cam ngọt",
    price: 160000,
    description: "Mùi hương tươi mát, giúp cải thiện tâm trạng.",
    rating: 4.8,
    purchases: 260,
    image: "https://file.hstatic.net/200000055530/file/tinh-dau-cam-ngot_1_276a4363028b41c2a542cb8eb1dec1bc_grande.png",
  },
];

export default function Shop() {
  return (
    <>
    <Student_Header/>
        <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>🛍️ Cửa hàng tinh dầu & nến thơm</Text>

      {products.map((item) => (
        <View key={item.id} style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>{item.price.toLocaleString()} VNĐ</Text>
          <Text style={styles.description}>{item.description}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.rating}>
              <Ionicons name="star" size={16} color="#FFD700" /> {item.rating}
            </Text>
            <Text style={styles.purchases}>{item.purchases} lượt mua</Text>
          </View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Thêm vào giỏ</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
    <Footer/>
    </>

  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 110,
    paddingHorizontal: 15,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#6B21A8",
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E63946",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  rating: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFD700",
  },
  purchases: {
    fontSize: 14,
    color: "#888",
  },
  button: {
    backgroundColor: "#6B21A8",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
