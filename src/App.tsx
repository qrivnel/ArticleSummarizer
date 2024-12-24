import { useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Box,
  Grid,
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
import firestore from "../firebase";

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
  const [message, setMessage] = useState<string>("");
  const [selectedChat, setSelectedChat] = useState<any>();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getChats = async () => {
    setChats([])
    const data = await firestore.collection("chats").get();
    const chatData = data.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setChats(chatData);
  };
  useEffect(() => {
    getChats();
  }, []);

  const handleChange = (event: any) => {
    setMessage(event.target.value);
  };

  const selectChat = (chat: any) => {
    setSelectedChat(chat);
  };

  const getSummary = async () => {
    if (message)
      return await axios.post("http://127.0.0.1:5000/summarize", {
        article: message.trim(),
      });
  };

  const sendMessage = async () => {
    setLoading(true);
    setSelectedChat({ article: message });
    setMessage("");
    try {
      const res: any = await getSummary();
      const { title, summary } = res.data;
      setSelectedChat((prev: any) => ({
        ...prev,
        title: title,
        summary: summary,
      }));
      if (res.data.summary) {
        await firestore
          .collection("chats")
          .add({
            title: title,
            summary: summary,
            article: message,
          })
          .then((_res: any) => {
            getChats()
          });
      }
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, width: "100vw", height: "100vh", padding: 2 }}>
        <Grid container spacing={2} sx={{ height: "100%" }}>
          {/* Chat Input and Messages Section */}
          <Grid item xs={12} md={8} sx={{ height: "100%" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
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

              {/* Message Display */}
              <List sx={{ overflowY: "auto", flexGrow: 1, padding: 2 }}>
                {!selectedChat ? (
                  <ListItem>
                    <Paper
                      sx={{
                        padding: 1,
                        backgroundColor: "#333",
                        color: "white",
                      }}
                    >
                      Özetini çıkarmak istediğiniz makaleyi gönderebilirsiniz.
                    </Paper>
                  </ListItem>
                ) : (
                  <>
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
                        {loading ? <CircularProgress /> : selectedChat.summary}
                      </Paper>
                    </ListItem>
                  </>
                )}
              </List>

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
          </Grid>

          {/* Chat List Section */}
          <Grid item xs={12} md={4} sx={{ height: "100%" }}>
            <Box
              sx={{
                width: "80%",
                height: "90%",
                backgroundColor: "background.default",
                borderRadius: 1,
                boxShadow: 3,
                overflowY: "auto",
                padding: 2,
              }}
            >
              <Typography variant="h5" color="white">
                  Geçmiş
                </Typography>
              {chats != undefined
                ? chats.map((chat: any, index: number) => (
                    <ChatRow key={index} chat={chat} selectChat={selectChat} />
                  ))
                : null}
            </Box>
          </Grid>
        </Grid>
        <Box mt={2} sx={{ textAlign: "center", p: 2 }}>
          <Divider />
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            © 2024 Makale Özetleyici
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
