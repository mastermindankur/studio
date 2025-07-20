
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User, SendHorizontal, Loader2, X, MessageSquare } from "lucide-react";
import { willAssistantAction } from "@/app/actions/chat"; 
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { useAIChatStore } from "@/hooks/use-ai-chat-store";


interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
}

export function FloatingAIAssistant() {
    const { isOpen, toggleChat, closeChat } = useAIChatStore();

    const initialBotMessage: Message = {
      id: "initial-message",
      text: "I can answer your questions about Will creation in India and guide you through the process. For complex legal advice, please consult a professional.",
      sender: "ai",
    };

    const [messages, setMessages] = useState<Message[]>([initialBotMessage]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
        }
    }, [messages, isOpen]);

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
        <div className="fixed bottom-4 left-4 z-50">
        {isOpen && (
            <Card className="w-[calc(100vw-2rem)] max-w-sm flex flex-col shadow-2xl rounded-lg animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage src="https://placehold.co/40x40.png" alt="AI Assistant" data-ai-hint="robot chat" />
                    <AvatarFallback><Bot /></AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <p className="text-sm font-semibold">AI Will Assistant</p>
                    <p className="text-xs text-muted-foreground">Online</p>
                </div>
                </div>
                <Button variant="ghost" size="icon" onClick={closeChat}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close chat</span>
                </Button>
            </CardHeader>
            <CardContent className="flex-grow p-0 overflow-hidden flex">
                <ScrollArea className="h-full w-full p-4" ref={scrollAreaRef}>
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
            </CardContent>
            <CardFooter className="p-4 border-t">
                <form onSubmit={handleSubmit} className="w-full flex items-center gap-3">
                <Input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-grow bg-background focus:ring-primary text-base"
                    aria-label="Type your question"
                    disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()} aria-label="Send message">
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <SendHorizontal className="h-5 w-5" />}
                </Button>
                </form>
            </CardFooter>
            </Card>
        )}
        <Button
            id="ai-chat-trigger"
            onClick={toggleChat}
            size="lg"
            className="h-16 w-16 rounded-full shadow-lg"
            aria-label="Toggle AI Assistant Chat"
        >
            {isOpen ? <X className="h-8 w-8" /> : <MessageSquare className="h-8 w-8" />}
        </Button>
        </div>
    );
}
