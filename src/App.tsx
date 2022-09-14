import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CssBaseline,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FunctionComponent } from "preact";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "preact/hooks";
import { MessageType, UiMessageType } from "./shared";

const sendUiMessage = (message: UiMessageType) => {
  parent.postMessage(message, "*");
};

const App: FunctionComponent = () => {
  const [accessToken, setAccessToken] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const onMessage = (event: MessageEvent<MessageType>) => {
      switch (event.data.type) {
        case "send-info":
          setAccessToken(event.data.accessToken);
          if (event.data.accessToken) {
            setShowAdvanced(true);
          }
          break;
      }
    };
    window.addEventListener("message", onMessage);
    sendUiMessage({ type: "get-info" });
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const onSaveKeys = () => {
    sendUiMessage({
      type: "set-keys",
      accessToken: accessToken,
    });
  };

  const onClearKeys = () => {
    setAccessToken("");
    sendUiMessage({
      type: "set-keys",
      accessToken: "",
    });
  };

  const onAccordionChange = (_: any, expanded: boolean) => {
    setShowAdvanced(expanded);
  };
  return (
    <Box>
      <CssBaseline />
      <Accordion expanded={showAdvanced} onChange={onAccordionChange}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1d-content"
          id="panel1d-header"
        >
          <Typography>Advanced Configuration</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Use your own Access Token:</Typography>
          <div>
            <TextField
              label="Access Token"
              value={accessToken}
              onChange={(e) => {
                const value = e.currentTarget.value;
                setAccessToken(value);
              }}
            />
          </div>
          <Stack spacing={2} direction="row">
            <Button variant="contained" onClick={onSaveKeys}>
              Save
            </Button>
            <Button variant="contained" onClick={onClearKeys} color="error">
              Clear
            </Button>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default App;
