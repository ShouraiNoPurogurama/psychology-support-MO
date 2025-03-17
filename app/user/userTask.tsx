import React, { useEffect, useState, useRef  } from "react";
import { View, Text, TouchableOpacity, FlatList, ScrollView, ActivityIndicator } from "react-native";
import { Student_Header } from "../../component/Student_Header";
import { Footer } from "../../component/Footer";

type Task = {
  id: string;
  text: string;
  time: string;
  completed: boolean;
  date: string;
};

interface ScheduleItem {
  sessions: { id: string; purpose: string; startDate: string }[];
}
const activitiesByDay: Record<string, { id: number; text: string; time: string }[]> = {
  "2025-03-14": [
    { id: 1, text: "Thiền 10 phút", time: "08:00 AM" },
    { id: 2, text: "Đi bộ nhẹ nhàng 15 phút", time: "09:00 AM" },
    { id: 3, text: "Ghi lại 3 điều biết ơn trong ngày", time: "07:00 PM" },
    { id: 4, text: "Nghe nhạc thư giãn 20 phút", time: "08:00 PM" },
    { id: 5, text: "Đọc sách phát triển bản thân 30 phút", time: "09:00 PM" },
    { id: 6, text: "Thực hành 5 phút hít thở sâu", time: "10:00 PM" },
    { id: 7, text: "Trò chuyện với một người bạn", time: "10:30 PM" }
  ],
  "2025-03-15": [
    { id: 8, text: "Thiền 15 phút", time: "08:00 AM" },
    { id: 9, text: "Vận động nhẹ nhàng 20 phút", time: "09:00 AM" },
    { id: 10, text: "Ghi lại cảm xúc trong ngày", time: "07:00 PM" },
    { id: 11, text: "Nghe podcast về tâm lý tích cực", time: "08:00 PM" },
    { id: 12, text: "Tìm hiểu một chủ đề mới 15 phút", time: "09:00 PM" },
    { id: 13, text: "Thực hành 5 phút hít thở sâu", time: "10:00 PM" },
    { id: 14, text: "Gọi điện cho người thân", time: "10:30 PM" }
  ],
  "2025-03-16": [
    { id: 15, text: "Thiền 10 phút", time: "08:00 AM" },
    { id: 16, text: "Đi bộ ngoài trời 20 phút", time: "09:00 AM" },
    { id: 17, text: "Ghi lại một điều tích cực trong ngày", time: "07:00 PM" },
    { id: 18, text: "Nghe một bài hát yêu thích", time: "08:00 PM" },
    { id: 19, text: "Thử vẽ hoặc tô màu thư giãn", time: "09:00 PM" },
    { id: 20, text: "Tập yoga hoặc giãn cơ 15 phút", time: "10:00 PM" },
    { id: 21, text: "Dành thời gian với gia đình", time: "10:30 PM" }
  ],
  "2025-03-17": [
    { id: 22, text: "Thiền buổi sáng 10 phút", time: "08:00 AM" },
    { id: 23, text: "Đi bộ 15 phút ngoài trời", time: "09:00 AM" },
    { id: 24, text: "Viết ra mục tiêu ngày mai", time: "07:00 PM" },
    { id: 25, text: "Podcast truyền cảm hứng 20 phút", time: "08:00 PM" },
    { id: 26, text: "Chơi hoặc nghe nhạc yêu thích", time: "09:00 PM" },
    { id: 27, text: "Thực hành 5 phút hít thở sâu", time: "10:00 PM" },
    { id: 28, text: "Tắm nước ấm hoặc xông hơi", time: "10:30 PM" }
  ],
  "2025-03-18": [
    { id: 29, text: "Thiền buổi tối 15 phút", time: "08:00 AM" },
    { id: 30, text: "Tập thể dục nhẹ 20 phút", time: "09:00 AM" },
    { id: 31, text: "Ghi lại khoảnh khắc đáng nhớ", time: "07:00 PM" },
    { id: 32, text: "Nghe nhạc không lời 30 phút", time: "08:00 PM" },
    { id: 33, text: "Vẽ hoặc sáng tạo nghệ thuật", time: "09:00 PM" },
    { id: 34, text: "Thực hành hít thở thư giãn", time: "10:00 PM" },
    { id: 35, text: "Trò chuyện với bạn bè", time: "10:30 PM" }
  ],
  "2025-03-19": [
    { id: 36, text: "Thiền 10 phút", time: "08:00 AM" },
    { id: 37, text: "Đi bộ ngoài trời 20 phút", time: "09:00 AM" },
    { id: 38, text: "Viết về cảm xúc hiện tại", time: "07:00 PM" },
    { id: 39, text: "Nghe podcast nâng cao tư duy", time: "08:00 PM" },
    { id: 40, text: "Yoga hoặc giãn cơ 15 phút", time: "09:00 PM" },
    { id: 41, text: "Thực hành 5 phút hít thở sâu", time: "10:00 PM" },
    { id: 42, text: "Tắm nước ấm hoặc đọc sách", time: "10:30 PM" }
  ],
  "2025-03-20": [
    { id: 43, text: "Thiền thư giãn 15 phút", time: "08:00 AM" },
    { id: 44, text: "Tập yoga 20 phút", time: "09:00 AM" },
    { id: 45, text: "Ghi lại 3 điều tích cực trong tuần", time: "07:00 PM" },
    { id: 46, text: "Nghe nhạc giúp thư giãn", time: "08:00 PM" },
    { id: 47, text: "Thử vẽ một điều vui vẻ", time: "09:00 PM" },
    { id: 48, text: "Thực hành hít thở sâu", time: "10:00 PM" },
    { id: 49, text: "Dành thời gian làm điều mình thích", time: "10:30 PM" }
  ]
};

const data = Object.keys(activitiesByDay).map((date) => ({
  date,
  activities: activitiesByDay[date]
}));
//fix cung


const API_URL =
  "https://psychologysupportscheduling-g0efgxc5bwhbhjgc.southeastasia-01.azurewebsites.net/schedules?PageIndex=1&PageSize=10&SortBy=startDate&SortOrder=asc&PatientId=8b483db4-46be-448f-bd63-3f41aaac6e6a";

// Hàm lấy thứ trong tuần từ ngày (yyyy-mm-dd)
const getWeekday = (dateStr: string) => {
  const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  const date = new Date(dateStr);
  return days[date.getDay()];
};


export default function UserTask() {
  const scrollViewRef = useRef<ScrollView | null>(null);
  const itemRefs = useRef<{ [key: string]: React.RefObject<typeof TouchableOpacity> }>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dayNow, setDayNow] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();

      if (!data || !data.schedules || !Array.isArray(data.schedules.data)) {
        console.error("Dữ liệu không hợp lệ:", data);
        setTasks([]);
        setAvailableDates([]);
        return;
      }

      const schedule: ScheduleItem[] = data.schedules.data;

      // Lọc danh sách ngày duy nhất
      const uniqueDates: string[] = [
        ...new Set(
          schedule
            .flatMap((s) => s.sessions.map((session) => session.startDate.split("T")[0]))
            .filter(Boolean)
        ),
      ];

      // Lấy tất cả các nhiệm vụ từ các session
      const allTasks: Task[] = schedule.flatMap((s) =>
        s.sessions.map((session) => ({
          id: session.id,
          text: session.purpose,
          time: new Date(session.startDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          completed: false,
          date: session.startDate.split("T")[0],
        }))
      );

      setAvailableDates(uniqueDates);

      // Chọn ngày mặc định là hôm nay (nếu có trong danh sách)
      const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD theo múi giờ địa phương
      setSelectedDate(uniqueDates.includes(today) ? today : uniqueDates[0] || null);
      setDayNow(uniqueDates.includes(today) ? today : uniqueDates[0] || null);

      setTasks(allTasks);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);
  useEffect(() => {
    if (dayNow && itemRefs.current[dayNow]?.current && scrollViewRef.current) {
      itemRefs.current[dayNow]?.current?.measureLayout(
        scrollViewRef.current,
        (x) => {
          scrollViewRef.current?.scrollTo({ x: x - 125, animated: true });
        },
        () => console.log("Không thể đo layout của phần tử")
      );
    }
  }, [dayNow, availableDates]);
  return (
    <>
      <Student_Header />
      <ScrollView style={{ flex: 1, backgroundColor: "white", padding: 20, marginTop: 70, marginBottom: 50 }}>
        <Text style={{ fontSize: 22, fontWeight: "bold", textAlign: "center", marginTop:20 }}>Lịch hoạt động</Text>

        {/* Hiển thị danh sách ngày từ API */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: "row", marginVertical: 10 }} ref={scrollViewRef}
        >
           {availableDates.map((date) => {
            // Tạo ref cho mỗi TouchableOpacity
            if (!itemRefs.current[date]) {
              itemRefs.current[date] = React.createRef<TouchableOpacity>();
            }

            return (
              <TouchableOpacity
                ref={itemRefs.current[date]}
                key={date}
                onPress={() => setSelectedDate(date)}
                style={{
                  padding: 15,
                  marginRight: 10,
                  backgroundColor: selectedDate === date ? "#6a5acd" : "#f0f0f0",
                  borderRadius: 10,
                  borderColor: dayNow === date ? "#6a5acd" : "#f0f0f0",
                  borderWidth: 2,
                  alignItems: "center",
                  minWidth: 100,
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "bold", color: selectedDate === date ? "white" : "black" }}>
                  {getWeekday(date)}
                </Text>
                <Text style={{ fontSize: 16, color: selectedDate === date ? "white" : "black" }}>{date}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Danh sách nhiệm vụ của ngày đã chọn */}
        {loading ? (
          <ActivityIndicator size="large" color="#6a5acd" style={{ marginTop: 20 }} />
        ) : (
          // <FlatList
          //   data={tasks.filter((task) => task.date === selectedDate)}
          //   keyExtractor={(item) => item.id}
          //   scrollEnabled={false}
          //   renderItem={({ item }) => (
          //     <View
          //       style={{
          //         padding: 15,
          //         marginBottom: 10,
          //         backgroundColor: "white",
          //         borderRadius: 10,
          //         shadowColor: "#000",
          //         shadowOffset: { width: 0, height: 2 },
          //         shadowOpacity: 0.1,
          //         shadowRadius: 4,
          //         elevation: 3,
          //       }}
          //     >
          //       {/* <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.text}</Text>
          //       <Text style={{ fontSize: 14, color: "gray" }}>{item.time}</Text> */}
          //       <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.text}</Text>
          //       <Text style={{ fontSize: 14, color: "gray" }}>{item.time}</Text>
          //     </View>
          //   )}
          // /> 
          <FlatList
            data={data.filter((item) => item.date === selectedDate)} // Chỉ lấy ngày đã chọn
            keyExtractor={(item) => item.date}
            scrollEnabled={false}
            
            renderItem={({ item }) => (
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5 }}>
                  {item.date} {/* Hiển thị ngày */}
                </Text>
                {item.activities.map((activity) => (
                  <View
                    key={activity.id}
                    style={{
                      padding: 15,
                      marginBottom: 10,
                      backgroundColor: "white",
                      borderRadius: 10,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                      {activity.text}
                    </Text>
                    <Text style={{ fontSize: 14, color: "gray" }}>{activity.time}</Text>
                  </View>
                ))}
              </View>
            )}
          />

        )}
      </ScrollView>
      <Footer />
    </>
  );
}
