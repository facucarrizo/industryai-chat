"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import type { Message } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, Send, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { handleMessage } from "@/ai/flows/handle-message";
import { chatConfig } from "@/lib/config";
import { LeadForm } from "./lead-form";

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      content: "Hello! How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleFormSuccess = (message: string) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: 'bot', content: message }
    ]);
    setShowLeadForm(false);
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await handleMessage({
        message: input,
        // These would come from your CMS or config in a real app
        sheetId: '1p4s_C9YVqJbE8T3eY4uH36LldBe2mJ3L8i-MtfW6eHg',
        sheetTab: 'FAQs',
        systemPrompt: chatConfig.systemPrompt,
      });

      if (response.isLead) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "bot",
            content: "It looks like you're interested in our services! Please provide your information below, and one of our agents will contact you shortly.",
          },
        ]);
        setShowLeadForm(true);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "bot",
            content: response.reply,
          },
        ]);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content: "I'm sorry, I seem to be having some trouble. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[60vh]">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-3 animate-in fade-in-50",
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage />
                <AvatarFallback className={message.role === 'bot' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}>
                  {message.role === "bot" ? <Bot size={20}/> : <User size={20}/>}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "rounded-lg p-3 text-sm max-w-sm",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot size={20}/>
                </AvatarFallback>
              </Avatar>
              <div className="rounded-lg p-3 bg-secondary">
                <Skeleton className="h-4 w-10 bg-muted" />
              </div>
            </div>
          )}
          {showLeadForm && <LeadForm onSuccess={handleFormSuccess} />}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading || showLeadForm}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim() || showLeadForm} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
