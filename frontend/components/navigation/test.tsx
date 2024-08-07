useEffect(() => {
    socket.on("connect", () => {
        console.log("connect");
    });

    const handleReceiveMessage = async (newMessage: IMessage) => {
        const timeStamp = new Date().toISOString();
        console.log("timeStamp::::::", timeStamp);
        const messageWithTime = { ...newMessage, timeStamp };
        setMessageArr(prevMessages => [...prevMessages, messageWithTime]);
    };

    const handleTyping = (typingUserId: string) => {
        if (typingUserId !== senderId) {
            setTypingMessage("Đang soạn tin...");

            // Xóa timeout cũ nếu có
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            // Tạo timeout mới và lưu vào ref
            typingTimeoutRef.current = setTimeout(() => {
                setTypingMessage("");
            }, 10000);
        }
    };

    const handleStopTyping = (typingUserId: string) => {
        if (typingUserId !== senderId) {
            setTypingMessage("");
            // Xóa timeout khi có thông báo stopTyping
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = null;
            }
        }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    // Ngắt socket
    return () => {
        socket.off("receiveMessage", handleReceiveMessage);
        socket.off("typing", handleTyping);
        socket.off("stopTyping", handleStopTyping);
        // Xóa timeout khi component unmount
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
    };
}, [senderId]);