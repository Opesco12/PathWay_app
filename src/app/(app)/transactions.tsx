import { StyleSheet, View } from "react-native";

import Screen from "@/src/components/Screen";
import AppHeader from "@/src/components/AppHeader";
import StyledText from "@/src/components/StyledText";
import { Colors } from "@/src/constants/Colors";
import { useEffect, useState } from "react";
import TransactionItem from "@/src/components/TransactionItem";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getTransactions } from "@/src/api";
import Loader from "@/src/components/Loader";
import AppMonthPicker from "@/src/components/AppMonthPicker";

const Transactions = () => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [startdate, setStartdate] = useState(null);
  const [enddate, setEnddate] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    const date = new Date().toISOString();
    const enddate = date.split("T")[0];
    var newdate = enddate.split("-", 2);
    const startdate = newdate.join("-") + "-01";

    console.log("Startdate: ", startdate);
    console.log("Enddate: ", enddate);

    setStartdate(startdate);
    setEnddate(enddate);

    const transactions = await fetchTransactions(startdate, enddate);
    setTransactions(transactions);
    setLoading(false);
  };

  const fetchTransactions = async (startdate, enddate) => {
    const transactions = await getTransactions(startdate, enddate);

    return transactions;
  };

  function formatDateToMonthYear(dateString) {
    const monthAbbreviations = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Check if dateString is undefined or null
    if (dateString !== null) {
      // Parse the input date string
      const parts = dateString.split("-");
      if (parts.length !== 3) {
        throw new Error(
          'Invalid date format. Please use "YYYY-MM-DD" format, e.g., "2024-12-31"'
        );
      }

      const [year, month, day] = parts.map(Number);

      // Check if the date is valid
      if (
        isNaN(year) ||
        isNaN(month) ||
        isNaN(day) ||
        month < 1 ||
        month > 12
      ) {
        throw new Error(
          'Invalid date components. Please use "YYYY-MM-DD" format with valid date values'
        );
      }

      // Get the month abbreviation (subtract 1 from month because array is 0-indexed)
      const monthAbbr = monthAbbreviations[month - 1];

      // Return the formatted string
      return `${monthAbbr} - ${year}`;
    }
  }
  function monthToDateRange(monthYearStr) {
    const [month, year] = monthYearStr.split(" ");

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthIndex = months.findIndex(
      (m) => m.toLowerCase() === month.toLowerCase()
    );

    if (monthIndex === -1 || isNaN(parseInt(year))) {
      throw new Error(
        'Invalid date format. Please use "Month YYYY" format, e.g., "December 2024"'
      );
    }

    const yearNum = parseInt(year);

    const startDate = new Date(yearNum, monthIndex, 1);

    const endDate = new Date(yearNum, monthIndex + 1, 0);

    const formatDate = (date) => {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    };

    return {
      start: formatDate(startDate),
      end: formatDate(endDate),
    };
  }
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <Screen>
        <AppHeader />
        <StyledText
          type="heading"
          variant="semibold"
          style={{ marginVertical: 25 }}
        >
          Transactions
        </StyledText>
        {loading ? (
          <Loader />
        ) : (
          <>
            <View
              style={{
                marginBottom: 15,
                flexDirection: "row",
                gap: 10,
                alignItems: "baseline",
              }}
            >
              <StyledText variant="medium">
                {formatDateToMonthYear(startdate)}
              </StyledText>
              <MaterialCommunityIcons
                name="chevron-down"
                size={20}
                onPress={() => setIsModalVisible(true)}
              />
            </View>

            {transactions?.length > 0 ? (
              transactions.map((transaction, index) => (
                <TransactionItem
                  key={index}
                  transaction={transaction}
                />
              ))
            ) : (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <StyledText color={Colors.light}>
                  Your transactions will appear here
                </StyledText>
              </View>
            )}
          </>
        )}
      </Screen>
      <AppMonthPicker
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelectMonthYear={async (month, year) => {
          setLoading(true);
          const { start, end } = monthToDateRange(`${month} ${year}`);
          setStartdate(start);
          setEnddate(end);
          try {
            const transactions = await fetchTransactions(start, end);
            setTransactions(transactions);
          } finally {
            setLoading(false);
          }
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({});

export default Transactions;
