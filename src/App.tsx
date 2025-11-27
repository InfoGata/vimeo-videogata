import { useEffect, useState } from "preact/hooks";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./components/ui/accordion";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { MessageType, UiMessageType } from "./shared";

const sendUiMessage = (message: UiMessageType) => {
  parent.postMessage(message, "*");
};

const App = () => {
  const [accessToken, setAccessToken] = useState("");
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  useEffect(() => {
    const onMessage = (event: MessageEvent<MessageType>) => {
      switch (event.data.type) {
        case "send-info":
          setAccessToken(event.data.accessToken);
          if (event.data.accessToken) {
            setOpenItem("item-1");
          }
          break;
        default:
          const _exhaustive: never = event.data.type;
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

  return (
    <div className="flex flex-col gap-2 mx-4">
      <Accordion
        type="single"
        collapsible
        value={openItem}
        onValueChange={setOpenItem}
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>Advanced Configuration</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2 space-y-2 p-1">
              <p className="text-sm">Use your own Access Token:</p>
              <Input
                placeholder="Access Token"
                value={accessToken}
                onChange={(e: any) => {
                  setAccessToken((e.target as HTMLInputElement).value);
                }}
              />
              <div className="flex gap-2">
                <Button onClick={onSaveKeys}>Save</Button>
                <Button variant="destructive" onClick={onClearKeys}>
                  Clear
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default App;
