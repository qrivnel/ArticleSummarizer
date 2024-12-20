import { useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";
import ChatRow from "./components/chat-row";
import axios from "axios";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2",
    },
    background: {
      default: "#121212",
      paper: "#1c1c1c",
    },
  },
});

function App() {
  const [message, setMessage] = useState<string>();
  const [selectedChat, setSelectedChat] = useState<any>();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setChats([])
  }, [])
  

  const handleChange = (event: any) => {
    setMessage(event.target.value);
  };

  const selectChat = (chat: any) => {
    setSelectedChat(chat);
  };

  const getSummary = async () => {
    if(message)
      return await axios.post("http://127.0.0.1:5000/summarize", {article: message.trim()})
  }

  const sendMessage = async () => {
    setLoading(true);
    setSelectedChat({article: message})
    setMessage("")
    try {
      const res: any = await getSummary()
      const {title, summary} = res.data
      setSelectedChat((prev: any) => ({
        ...prev,
        title: title,
        summary: summary
      }))
    } catch (error) {
      console.error(error)
    }
  
    setLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{display: "flex", flexDirection: "row", width: "100vw", height: "100vh", alignItems: "center"}}>
        <Container
          maxWidth="sm"
          sx={{ paddingTop: 2, display: "flex", flexDirection: "column", width: "50%", height: "100%" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100%",
              backgroundColor: "background.default",
              borderRadius: 1,
              boxShadow: 3,
            }}
          >
            <Box
              sx={{
                padding: 2,
                borderBottom: 1,
                borderColor: "divider",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Typography variant="h5" color="white">
                Makale Özetleyici
              </Typography>
            </Box>
  
            {/* Sohbet Mesajları */}
            {!selectedChat ? (
              <List sx={{ overflowY: "auto", flexGrow: 1, padding: 2 }}>
                <ListItem>
                  <Paper
                    sx={{ padding: 1, backgroundColor: "#333", color: "white" }}
                  >
                    Özetini çıkarmak istediğiniz makaleyi gönderebilirsiniz.
                  </Paper>
                </ListItem>
              </List>
            ) : (
              <List sx={{ overflowY: "auto", flexGrow: 1, padding: 2 }}>
                <ListItem sx={{ justifyContent: "end" }}>
                  <Paper
                    sx={{
                      padding: 1,
                      backgroundColor: "primary.main",
                      color: "white",
                      width: "70%",
                    }}
                  >
                    {selectedChat.article}
                  </Paper>
                </ListItem>
                <ListItem>
                  <Paper
                    sx={{
                      padding: 1,
                      backgroundColor: "#333",
                      color: "white",
                      width: "70%",
                    }}
                  >
                    {loading ?  <CircularProgress /> : selectedChat.summary}
                  </Paper>
                </ListItem>
              </List>
            )}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: 2,
                borderTop: 1,
                borderColor: "divider",
              }}
            >
              {!selectedChat?.summary ? (
                <>
                  <TextField
                    label="Mesajınızı yazın"
                    variant="outlined"
                    value={message}
                    onChange={handleChange}
                    multiline
                    minRows={1}
                    maxRows={5}
                    fullWidth
                    sx={{
                      "& .MuiInputBase-root": {
                        minHeight: "40px",
                      },
                    }}
                  />
                  <Button
                    disabled={loading}
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 2 }}
                    onClick={sendMessage}
                  >
                    {loading ? "Gönderiliyor.." : "Gönder"}
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 2 }}
                  onClick={() => setSelectedChat(null)}
                >
                  Tamam
                </Button>
              )}
            </Box>
          </Box>
          <Box mt={2} sx={{ textAlign: "center", p: 2 }}>
            <Divider />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              © 2024 Makale Özetleyici
            </Typography>
          </Box>
        </Container>
        <Box
          sx={{
            display: "flex",
            width: "30%",
            height: "70%",
            paddingX: "16px",
            backgroundColor: "background.default",
            borderRadius: "8px",
            overflow: "scroll",
          }}
        >
          {chats != undefined
            ? chats.map((chat: any, index: number) => (
                <ChatRow key={index} chat={chat} selectChat={selectChat} />
              ))
            : null}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
