import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, MessageCircle, Phone, MapPin, Clock, DollarSign } from "lucide-react";

interface LiveChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const floridaBusinesses = [
  {
    service: "Roofing",
    businesses: [
      "ABC Roofing (Miami) - 305-555-0123",
      "Sunshine Roofing (Tampa) - 813-555-0124", 
      "Elite Roofing (Orlando) - 407-555-0125"
    ],
    leadValue: "$150-300",
    urgentValue: "$400+"
  },
  {
    service: "AC/HVAC", 
    businesses: [
      "Cool Breeze HVAC (Jacksonville) - 904-555-0126",
      "Florida Air Pro (Fort Lauderdale) - 954-555-0127",
      "Tropical HVAC (Naples) - 239-555-0128"
    ],
    leadValue: "$100-250",
    urgentValue: "$350+"
  },
  {
    service: "Pool Service",
    businesses: [
      "Crystal Pool Services (Miami Beach) - 305-555-0129",
      "Aqua Pro (St. Petersburg) - 727-555-0130",
      "Pool Paradise (West Palm Beach) - 561-555-0131"
    ],
    leadValue: "$75-150",
    urgentValue: "$200+"
  },
  {
    service: "Landscaping",
    businesses: [
      "Green Gardens FL (Gainesville) - 352-555-0132",
      "Tropical Landscapes (Key West) - 305-555-0133",
      "Paradise Lawns (Sarasota) - 941-555-0134"
    ],
    leadValue: "$50-125",
    urgentValue: "$175+"
  }
];

const chatResponses = {
  greeting: "Hi! Thanks for visiting Florida Service Leads. I'm here to help you get connected with the best local contractors. What type of service do you need?",
  
  roofing: "Great choice! Roofing is one of our most popular services. We work with licensed, insured contractors across Florida. What's your timeline - is this urgent or can you wait a few days for quotes?",
  
  emergency: "I understand this is urgent! For emergency services, I can connect you with contractors who offer 24/7 response. They typically respond within 2-4 hours. What's your location?",
  
  timeline: "Perfect! I can get you connected with 2-3 pre-screened contractors in your area. They'll contact you within 24 hours with free estimates. Just fill out the form above and you'll hear from them soon!",
  
  pricing: "Our service is completely free for homeowners! The contractors pay us a small fee to connect with quality leads like you. You'll get competitive quotes and can choose the best option for your project."
};

export function LiveChat({ isOpen, onClose }: LiveChatProps) {
  const [messages, setMessages] = useState([
    { type: 'bot', text: chatResponses.greeting, time: new Date().toLocaleTimeString() }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: 'user',
      text: inputMessage,
      time: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simple bot response logic
    setTimeout(() => {
      let botResponse = "Thanks for your message! I'll connect you with the right contractors for your needs. Please fill out our form above for the fastest service.";
      
      const input = inputMessage.toLowerCase();
      if (input.includes('roof') || input.includes('leak')) {
        botResponse = chatResponses.roofing;
      } else if (input.includes('emergency') || input.includes('urgent') || input.includes('asap')) {
        botResponse = chatResponses.emergency;
      } else if (input.includes('cost') || input.includes('price') || input.includes('free')) {
        botResponse = chatResponses.pricing;
      } else if (input.includes('when') || input.includes('timeline')) {
        botResponse = chatResponses.timeline;
      }

      setMessages(prev => [...prev, {
        type: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString()
      }]);
    }, 1000);

    setInputMessage("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[600px]">
      <Card className="glass-card shadow-2xl border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Live Chat Support</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-4">
          {/* Chat Messages */}
          <div className="h-64 overflow-y-auto space-y-3 mb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/50 text-foreground'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">{message.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="sm">
              Send
            </Button>
          </div>

          {/* Quick Business Directory */}
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-semibold text-primary">🏢 Florida Business Directory</h4>
            <div className="text-xs space-y-2 max-h-32 overflow-y-auto">
              {floridaBusinesses.map((category, index) => (
                <div key={index} className="p-2 bg-secondary/30 rounded">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{category.service}</span>
                    <span className="text-primary">{category.leadValue}</span>
                  </div>
                  <div className="space-y-1">
                    {category.businesses.slice(0, 2).map((business, bIndex) => (
                      <div key={bIndex} className="text-muted-foreground">
                        {business}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-3 p-2 bg-accent/10 rounded-lg text-xs">
            <div className="flex items-center gap-2 mb-1">
              <Phone className="h-3 w-3" />
              <span>Direct: (954) 555-LEADS</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>Available: 8 AM - 10 PM EST</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}