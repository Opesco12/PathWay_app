import React, { createContext, useContext, useState, ReactNode } from "react";

interface ChatContextProps {
  isModalVisible: boolean;
  toggleModal: () => void;
  closeModal: () => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible((prev) => !prev);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <ChatContext.Provider value={{ isModalVisible, toggleModal, closeModal }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
