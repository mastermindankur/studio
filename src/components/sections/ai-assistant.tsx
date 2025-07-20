
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User, SendHorizontal, Loader2 } from "lucide-react";
import { willAssistantAction } from "@/app/actions/chat"; 
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
}

const initialBotMessage: Message = {
    id: "initial-message",
    text: "I can answer your questions about Will creation in India and guide you through the process. For complex legal advice, please consult a professional.",
    sender: "ai",
};

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([initialBotMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const aiResponse = await willAssistantAction({ query: input }); 
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.response,
        sender: "ai",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Will Assistant Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error. Please try again later.",
        sender: "ai",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="ai-assistant" className="py-16 md:py-24 bg-primary/5">
      <div className="container max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-headline text-3xl sm:text-4xl font-bold text-primary mb-4">AI Will Assistant for India</h2>
        </div>
        <div className="bg-card shadow-2xl rounded-lg overflow-hidden max-w-4xl mx-auto">
          <ScrollArea className="h-[400px] md:h-[500px] w-full p-4 sm:p-6" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-3 animate-fade-in",
                    message.sender === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.sender === "ai" && (
                    <Avatar className="h-8 w-8 border border-primary/50">
                      <AvatarImage asChild src="https://placehold.co/40x40.png" alt="AI Assistant Avatar">
                        <Image src="https://placehold.co/40x40.png" alt="AI Assistant Avatar" width={40} height={40} data-ai-hint="robot chat" />
                      </AvatarImage>
                      <AvatarFallback><Bot className="h-4 w-4 text-primary" /></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-xl px-4 py-3 shadow-md",
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                  </div>
                  {message.sender === "user" && (
                    <Avatar className="h-8 w-8 border border-accent/50">
                       <AvatarImage asChild src="https://placehold.co/40x40.png" alt="User Avatar">
                         <Image src="https://placehold.co/40x40.png" alt="User Avatar" width={40} height={40} data-ai-hint="person icon" />
                       </AvatarImage>
                      <AvatarFallback><User className="h-4 w-4 text-accent" /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3 justify-start">
                   <Avatar className="h-8 w-8 border border-primary/50">
                      <AvatarImage asChild src="https://placehold.co/40x40.png" alt="AI Assistant Avatar">
                        <Image src="https://placehold.co/40x40.png" alt="AI Assistant Avatar" width={40} height={40} data-ai-hint="robot chat" />
                      </AvatarImage>
                     <AvatarFallback><Bot className="h-4 w-4 text-primary" /></AvatarFallback>
                   </Avatar>
                  <div className="max-w-[70%] rounded-xl px-4 py-3 shadow-md bg-muted text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <form
            onSubmit={handleSubmit}
            className="p-4 border-t border-border bg-muted/50 flex items-center gap-3"
          >
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Will creation in India..."
              className="flex-grow bg-background focus:ring-primary text-base"
              aria-label="Type your question about Will creation"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()} aria-label="Send message">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <SendHorizontal className="h-5 w-5" />}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
