"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Search,
  Send,
  Paperclip,
  MoreVertical,
  CheckCheck,
  Calendar as CalendarIcon,
  Phone,
  ChevronLeft,
} from "lucide-react";

// --- DATI FINTI (MOCK) ---
const initialChats = [
  {
    id: "1",
    name: "Copernico Centrale",
    avatar: "https://github.com/shadcn.png",
    status: "Online ora",
    bookingContext: "Gio 22 Ottobre • Flex Desk Centrale",
    dateContext: "Prenotazione confermata",
    lastTime: "10:42",
    messages: [
      {
        id: "m1",
        text: "Buongiorno Andrea! Abbiamo ricevuto la tua prenotazione per la Flex Desk di domani.",
        sender: "them",
        time: "10:30",
      },
      {
        id: "m2",
        text: "Ricordati di portare un documento d'identità per registrarti in reception. C'è altro in cui posso aiutarti?",
        sender: "them",
        time: "10:31",
      },
      {
        id: "m3",
        text: "Ciao! Perfetto, grazie per la conferma. Volevo solo sapere se è possibile accedere alla stampante durante la giornata.",
        sender: "me",
        time: "10:40",
      },
      {
        id: "m4",
        text: "Certamente! Perfetto, vi aspettiamo domani per il check-in alle 09:00.",
        sender: "them",
        time: "10:42",
      },
    ],
  },
  {
    id: "2",
    name: "Marco R. (Host)",
    avatar: "https://i.pravatar.cc/150?img=32",
    status: "Offline",
    bookingContext: "Ven 16 Ottobre • Sala Meeting Galileo",
    dateContext: "Viaggio concluso",
    lastTime: "Ieri",
    messages: [
      {
        id: "m1",
        text: "Ciao Andrea, spero che lo spazio sia stato di tuo gradimento!",
        sender: "them",
        time: "18:00",
      },
      {
        id: "m2",
        text: "Assolutamente sì, tornerò sicuramente. Ho lasciato le chiavi sul tavolo.",
        sender: "me",
        time: "18:05",
      },
      {
        id: "m3",
        text: "Perfetto, nessun problema. La password del WiFi l'ho già resettata.",
        sender: "them",
        time: "18:10",
      },
    ],
  },
  {
    id: "3",
    name: "Assistenza CoWork",
    avatar: "", // Senza avatar per usare il fallback
    status: "Online",
    bookingContext: "Supporto Tecnico",
    dateContext: "Ticket #4492",
    lastTime: "12 Ott",
    messages: [
      {
        id: "m1",
        text: "Ciao, come possiamo aiutarti oggi?",
        sender: "them",
        time: "09:00",
      },
      {
        id: "m2",
        text: "Il tuo rimborso per la cancellazione è stato elaborato. Lo vedrai sul conto entro 3 giorni lavorativi.",
        sender: "them",
        time: "09:05",
      },
    ],
  },
];

export default function MessagesPage() {
  // Stati dell'applicazione
  const [chats, setChats] = useState(initialChats);
  const [activeChatId, setActiveChatId] = useState(initialChats[0].id);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false); // Gestisce la vista su smartphone
  const [inputText, setInputText] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Trova la chat attiva in base all'ID
  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

  // Auto-scroll in basso quando si apre una chat o arriva un nuovo messaggio
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat.messages, isMobileChatOpen, activeChatId]);

  // Funzione per inviare un messaggio
  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault(); // Previene il ricaricamento della pagina se si usa <form>
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }), // Ora attuale (es. "14:30")
    };

    // Aggiorna lo stato aggiungendo il messaggio alla chat corretta
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastTime: newMessage.time,
          };
        }
        return chat;
      }),
    );

    setInputText(""); // Svuota l'input
  };

  return (
    <main className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-secondary/5 pb-10">
      {/* HEADER DELLA PAGINA */}
      <div className="container max-w-6xl mx-auto px-4 md:px-6 pt-8 md:pt-10 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/profile"
            className="inline-flex items-center h-10 w-10 justify-center rounded-full bg-background border border-border/50 text-muted-foreground hover:text-accent hover:border-accent/30 transition-colors shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Posta in arrivo
          </h1>
        </div>
      </div>

      {/* CONTENITORE PRINCIPALE MESSAGGI */}
      <div className="container max-w-6xl mx-auto px-4 md:px-6 flex-1 flex flex-col">
        <div className="flex-1 bg-background rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-border/10 border border-border/50 overflow-hidden flex flex-col md:flex-row min-h-[600px] h-[75vh]">
          {/* =========================================
              COLONNA SINISTRA: LISTA INBOX
              ========================================= */}
          {/* Su mobile, se isMobileChatOpen è true, nascondiamo questa colonna. Su desktop (md:) è sempre visibile. */}
          <div
            className={cn(
              "w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-border/50 flex flex-col bg-background/50",
              isMobileChatOpen ? "hidden md:flex" : "flex",
            )}
          >
            {/* Ricerca */}
            <div className="p-6 border-b border-border/50">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cerca nei messaggi..."
                  className="pl-11 h-12 rounded-xl bg-secondary/10 border-none focus-visible:ring-accent/20 font-medium"
                />
              </div>
            </div>

            {/* Lista Conversazioni generate dal MOCK */}
            <div className="flex-1 overflow-y-auto">
              {chats.map((chat) => {
                const isActive = chat.id === activeChatId;
                const lastMessage = chat.messages[chat.messages.length - 1];

                return (
                  <div
                    key={chat.id}
                    onClick={() => {
                      setActiveChatId(chat.id);
                      setIsMobileChatOpen(true); // Su mobile apre la chat
                    }}
                    className={cn(
                      "flex items-start gap-4 p-5 cursor-pointer border-l-4 transition-colors",
                      isActive
                        ? "border-accent bg-accent/5"
                        : "border-transparent hover:bg-secondary/5",
                    )}
                  >
                    <Avatar className="h-12 w-12 border border-background shadow-sm">
                      {chat.avatar ? (
                        <AvatarImage src={chat.avatar} />
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          CoW
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-sm truncate">
                          {chat.name}
                        </h4>
                        <span
                          className={cn(
                            "text-[10px] font-bold",
                            isActive ? "text-accent" : "text-muted-foreground",
                          )}
                        >
                          {chat.lastTime}
                        </span>
                      </div>
                      <p
                        className={cn(
                          "text-sm truncate",
                          isActive
                            ? "font-bold text-foreground"
                            : "font-medium text-muted-foreground",
                        )}
                      >
                        {lastMessage?.sender === "me" ? "Tu: " : ""}
                        {lastMessage?.text}
                      </p>
                      <p className="text-[11px] font-medium text-muted-foreground mt-1">
                        {chat.dateContext}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =========================================
              COLONNA DESTRA: CHAT ATTIVA
              ========================================= */}
          {/* Su mobile, se isMobileChatOpen è false, nascondiamo questa colonna. Su desktop (md:) è sempre visibile. */}
          <div
            className={cn(
              "flex-1 flex flex-col bg-background/30",
              !isMobileChatOpen ? "hidden md:flex" : "flex",
            )}
          >
            {/* Chat Header */}
            <div className="h-20 px-4 md:px-6 border-b border-border/50 bg-background/80 backdrop-blur-sm flex items-center justify-between z-10 shrink-0">
              <div className="flex items-center gap-3 md:gap-4">
                {/* Bottone Indietro SOLO SU MOBILE */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-10 w-10 text-muted-foreground rounded-full hover:bg-secondary/10"
                  onClick={() => setIsMobileChatOpen(false)}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                <Avatar className="h-10 w-10 border border-border/50 shadow-sm">
                  {activeChat.avatar ? (
                    <AvatarImage src={activeChat.avatar} />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      CoW
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h3 className="font-bold text-base leading-tight truncate max-w-[150px] sm:max-w-xs">
                    {activeChat.name}
                  </h3>
                  {activeChat.status.includes("Online") ? (
                    <span className="text-xs font-medium text-green-500 flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      {activeChat.status}
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-muted-foreground">
                      Offline
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 md:gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground rounded-full hover:bg-secondary/10 hover:text-foreground"
                >
                  <Phone className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground rounded-full hover:bg-secondary/10 hover:text-foreground"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Contesto Prenotazione Sticky */}
            <div className="px-4 md:px-6 py-3 bg-accent/5 border-b border-accent/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-background p-2 rounded-lg border border-border/50 shadow-sm hidden sm:block">
                  <CalendarIcon className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">
                    {activeChat.dateContext}
                  </p>
                  <p className="text-[10px] font-medium text-muted-foreground">
                    {activeChat.bookingContext}
                  </p>
                </div>
              </div>
              <Link href="/profile/bookings">
                <Button
                  variant="link"
                  className="text-xs font-bold text-accent p-0 h-auto"
                >
                  Dettagli
                </Button>
              </Link>
            </div>

            {/* Area Messaggi (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-6">
              <div className="flex items-center justify-center my-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-secondary/10 px-3 py-1 rounded-full">
                  Oggi
                </span>
              </div>

              {/* Mappiamo i messaggi della chat attiva */}
              {activeChat.messages.map((msg, idx) => {
                const isMe = msg.sender === "me";

                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex items-end gap-3",
                      isMe ? "justify-end" : "justify-start",
                    )}
                  >
                    {!isMe && (
                      <Avatar className="h-8 w-8 mb-1 border border-border/50 shrink-0">
                        {activeChat.avatar ? (
                          <AvatarImage src={activeChat.avatar} />
                        ) : (
                          <AvatarFallback>CoW</AvatarFallback>
                        )}
                      </Avatar>
                    )}

                    <div
                      className={cn(
                        "flex flex-col gap-1 max-w-[85%] md:max-w-[75%]",
                        isMe && "items-end",
                      )}
                    >
                      <div
                        className={cn(
                          "px-5 py-3 text-sm font-medium shadow-sm",
                          isMe
                            ? "bg-accent text-accent-foreground rounded-2xl rounded-br-sm shadow-accent/20"
                            : "bg-secondary/10 border border-border/50 text-foreground rounded-2xl rounded-bl-sm",
                        )}
                      >
                        {msg.text}
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-bold text-muted-foreground flex items-center gap-1",
                          isMe ? "mr-1" : "ml-1",
                        )}
                      >
                        {isMe && msg.time}
                        {isMe && <CheckCheck className="h-3 w-3 text-accent" />}
                        {!isMe && msg.time}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Elemento invisibile per fare scroll verso il basso */}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Area */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 md:p-4 bg-background border-t border-border/50 flex items-end gap-2 md:gap-3 shrink-0"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 h-10 w-10 md:h-12 md:w-12 rounded-full hover:bg-secondary/10 text-muted-foreground"
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <div className="flex-1 bg-secondary/10 rounded-[1.5rem] border border-border/50 flex items-center px-2 py-1 focus-within:ring-2 focus-within:ring-accent/20 focus-within:border-accent transition-all">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Scrivi un messaggio..."
                  className="border-none shadow-none bg-transparent focus-visible:ring-0 px-3 h-10 font-medium"
                />
              </div>
              <Button
                type="submit"
                disabled={!inputText.trim()}
                className="shrink-0 h-10 w-10 md:h-12 md:w-12 rounded-full shadow-lg shadow-primary/20 hover:scale-[1.05] transition-transform p-0 flex items-center justify-center disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send className="h-4 w-4 md:h-5 md:w-5 md:ml-1" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
