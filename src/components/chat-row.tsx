import { Typography } from '@mui/material';
import React from 'react';

interface IChat {
    title: string,
    article: string,
    summary: string
}

interface IChatRowProps {
    chat: IChat;
    selectChat: any
}

const ChatRow: React.FC<IChatRowProps> = ({ chat, selectChat }) => {
    return (
        <div onClick={()=>selectChat(chat)}
            style={{
                height: "auto",
                margin: "32px 0",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "16px",
                borderRadius: "8px",
                backgroundColor: "#333",
                cursor: "pointer"
            }}
        >
            {/* Başlık */}
            <Typography
                variant="subtitle1"
                sx={{
                    fontWeight: "bold",
                    color: "white",
                    marginBottom: "8px"
                }}
            >
                {chat.title}
            </Typography>
            
            {/* Article İçeriği */}
            <Typography
                variant="body2"
                sx={{
                    color: "white",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    width: "100%",
                }}
            >
                {chat.article}
            </Typography>
        </div>
    );
};

export default ChatRow;
