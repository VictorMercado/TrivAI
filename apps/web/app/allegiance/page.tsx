import { Chat } from "@ui/chat";

export default function AllegiancePage() {
  return (
    // pull messages from the database and load them into the chat, send a prop to chat that messages are already loaded
    <main>
      <Chat URL={process.env.WS_URL} />
    </main>
  );
}