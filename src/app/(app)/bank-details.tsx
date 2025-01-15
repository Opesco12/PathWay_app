import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { AddCircle, Bank } from "iconsax-react-native";
import { Formik } from "formik";
import * as Yup from "yup";

import AppHeader from "@/src/components/AppHeader";
import Screen from "@/src/components/Screen";
import StyledText from "@/src/components/StyledText";
import { Colors } from "@/src/constants/Colors";
import ContentBox from "@/src/components/ContentBox";
import AppModal from "@/src/components/AppModal";
import AppTextField from "@/src/components/AppTextField";
import AppButton from "@/src/components/AppButton";
import AppPicker from "@/src/components/AppPicker";

import { createClientBank, getBanks, getclientbankaccounts } from "@/src/api";
import { showMessage } from "react-native-flash-message";
import Loader from "@/src/components/Loader";
import { router } from "expo-router";

const BankDetails = () => {
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [clientbanks, setClientbanks] = useState([]);
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const clientbanks = await getclientbankaccounts();
      setClientbanks(clientbanks);

      const banklist = await getBanks();
      setBanks(
        banklist.map((item) => ({
          label: item.bankName,
          value: item.companyId,
        }))
      );

      setLoading(false);
    };

    fetchData();
  }, []);

  const validationSchema = Yup.object().shape({
    accountNumber: Yup.number()
      .typeError("Account number must be a number")
      .test(
        "len",
        "Account number must be exactly 10 digits",
        (val) => val && String(val).length === 10
      )
      .required("Account number is required"),

    accountName: Yup.string()
      .required("Account name is required")
      .min(3, "Account name must be at least 3 characters")
      .max(100, "Account name can be at most 100 characters"),
  });

  if (loading) return <Loader />;

  return (
    <Screen>
      <AppHeader />
      <StyledText
        type="heading"
        variant="semibold"
        style={{ marginVertical: 25 }}
      >
        Bank Details
      </StyledText>

      {clientbanks?.length > 0 &&
        clientbanks.map((bank, index) => (
          <BankInfo
            bank={bank}
            key={index}
          />
        ))}

      {clientbanks?.length < 1 && (
        <ContentBox
          customStyles={{
            borderColor: Colors.lightBg,
            borderRadius: 6,
            height: 150,
            justifyContent: "center",
            marginVertical: 10,
            alignItems: "center",
          }}
          onPress={() => setIsModalVisible(true)}
        >
          <AddCircle
            color={Colors.light}
            size={20}
          />
          <StyledText
            color={Colors.light}
            type="body"
            variant="regular"
          >
            Add Bank Details
          </StyledText>
        </ContentBox>
      )}

      <AppModal
        isModalVisible={isModalVisible}
        setIsModalVisible={!isSubmitting && setIsModalVisible}
      >
        <StyledText
          type="heading"
          variant="medium"
          style={{ marginVertical: 15 }}
        >
          Bank Details
        </StyledText>
        <Formik
          initialValues={{
            accountName: "",
            accountNumber: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            setIsSubmitting(true);
            const { accountName, accountNumber } = values;
            const selected = banks.find((item) => item.value === selectedBank);
            if (selectedBank) {
              const requestData = {
                beneficiaryCompanyId: selected.value,
                beneficiaryAccountNo: accountNumber,
                currencyCode: "NGN",
                beneficiaryName: accountName,
                countryCode: "NGA",
              };
              const response = await createClientBank(requestData);
              if (response) {
                if (response?.message === "success") {
                  setIsModalVisible(false);
                  showMessage({
                    message: "Bank details have been added succesfully",
                    type: "success",
                  });

                  router.back();
                }
              }

              setIsSubmitting(false);
            } else {
              showMessage({
                message: "Please select a bank",
                type: "warning",
              });
              setIsSubmitting(false);
            }

            setIsSubmitting(false);
          }}
        >
          {({ handleChange, handleSubmit }) => (
            <>
              <AppPicker
                label={"Bank"}
                placeholder={"Select Bank"}
                options={banks}
                onValueChange={(value) => setSelectedBank(value)}
                value={selectedBank}
              />
              <View style={{ marginTop: 20, marginBottom: 40, gap: 10 }}>
                <AppTextField
                  name={"accountNumber"}
                  label={"Account Number"}
                  onChangeText={handleChange("accountNumber")}
                  keyboardType="numeric"
                />
                <AppTextField
                  name={"accountName"}
                  label={"Account Name"}
                  onChangeText={handleChange("accountName")}
                />
                <AppButton
                  onPress={handleSubmit}
                  customStyles={{ marginVertical: 20 }}
                >
                  {isSubmitting === true ? (
                    <ActivityIndicator size={"small"} />
                  ) : (
                    "Submit"
                  )}
                </AppButton>
              </View>
            </>
          )}
        </Formik>
      </AppModal>
    </Screen>
  );
};

export default BankDetails;

const BankInfo = ({ bank }) => {
  return (
    <ContentBox
      customStyles={{
        backgroundColor: Colors.primary,
        borderWidth: 0,
        borderRadius: 6,
        height: 150,
        marginVertical: 10,
        justifyContent: "center",
        gap: 5,
      }}
    >
      <StyledText
        color={Colors.white}
        variant="medium"
      >
        {bank?.bankName}
      </StyledText>
      <StyledText color={Colors.white}>{bank?.beneficiaryAccountNo}</StyledText>
      <StyledText color={Colors.white}>{bank?.beneficiaryName}</StyledText>
      <Bank
        color={Colors.white}
        size={25}
        style={{ position: "absolute", right: 20 }}
      />
    </ContentBox>
  );
};
