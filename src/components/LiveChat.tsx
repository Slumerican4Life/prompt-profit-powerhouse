import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { X, MessageCircle, Phone, MapPin, Clock, DollarSign, Bot, User, Send, Zap, Star, Shield } from "lucide-react";

interface LiveChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const aiResponses = {
  greeting: "🤖 Hi! I'm your Florida Service AI Assistant. I can instantly connect you with verified contractors across all 67 Florida counties. What service do you need help with today?",
  
  roofing: "🏠 Roofing emergency or planned repair? I work with 150+ licensed roofers across Florida. Emergency repairs typically get responses in 30-60 minutes. What's your situation?",
  
  hvac: "❄️ AC issues in Florida heat are serious! I can connect you with certified HVAC techs who offer 24/7 emergency service. Most respond within 1-2 hours. What's happening with your system?",
  
  plumbing: "🔧 Plumbing problems can't wait! I work with master plumbers throughout Florida who offer emergency service. Water damage prevention is critical. Describe your issue?",
  
  electrical: "⚡ Electrical issues require licensed professionals immediately. I connect you with Master Electricians across Florida. Safety first - what's the problem?",
  
  pool: "🏊 Pool problems during Florida season? I work with certified pool technicians statewide. Equipment repair, cleaning, or chemical issues? Tell me more.",
  
  hurricane: "🌪️ Hurricane preparation is crucial in Florida! I connect you with certified storm contractors who can board up, install shutters, or handle emergency repairs. What do you need?",
  
  emergency: "🚨 I understand this is URGENT! I'm immediately connecting you with emergency service providers in your area. They typically respond within 30-90 minutes. What's your exact location and emergency?",
  
  timeline: "⏰ Perfect! I can match you with 2-4 contractors based on your timeline and project scope. They'll contact you with detailed estimates within 4-6 hours. Much faster than traditional methods!",
  
  pricing: "💰 Great question! Our service is 100% FREE for Florida homeowners. Contractors pay us only when they successfully connect with quality leads like you. You get competitive pricing and quality work!",
  
  location: "📍 I serve all Florida counties! From Miami-Dade to Escambia, Jacksonville to Key West. Where in Florida are you located? This helps me match you with the closest, highest-rated contractors.",
  
  default: "I'm here to help connect you with Florida's best contractors! Ask me about roofing, AC/HVAC, plumbing, electrical, pools, landscaping, or emergency services. What can I help you find?"
};

const quickActions = [
  { label: "🚨 Emergency Repair", value: "emergency", urgent: true },
  { label: "🏠 Roofing", value: "roofing", popular: true },
  { label: "❄️ AC/HVAC", value: "hvac", popular: true },
  { label: "🔧 Plumbing", value: "plumbing", popular: true },
  { label: "⚡ Electrical", value: "electrical", popular: false },
  { label: "🏊 Pool Service", value: "pool", popular: false },
  { label: "🌪️ Hurricane Prep", value: "hurricane", urgent: true }
];

export function LiveChat({ isOpen, onClose }: LiveChatProps) {
  const [messages, setMessages] = useState([
    { type: 'bot', text: aiResponses.greeting, time: new Date().toLocaleTimeString() }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    description: "",
    urgency: "normal"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: 'user',
      text: inputMessage,
      time: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Enhanced AI response logic
    setTimeout(() => {
      let botResponse = aiResponses.default;
      const input = inputMessage.toLowerCase();
      
      if (input.includes('roof') || input.includes('leak') || input.includes('shingle')) {
        botResponse = aiResponses.roofing;
      } else if (input.includes('ac') || input.includes('hvac') || input.includes('cooling') || input.includes('air condition')) {
        botResponse = aiResponses.hvac;
      } else if (input.includes('plumb') || input.includes('water') || input.includes('drain') || input.includes('pipe')) {
        botResponse = aiResponses.plumbing;
      } else if (input.includes('electric') || input.includes('wire') || input.includes('outlet') || input.includes('power')) {
        botResponse = aiResponses.electrical;
      } else if (input.includes('pool') || input.includes('spa') || input.includes('chlorine')) {
        botResponse = aiResponses.pool;
      } else if (input.includes('hurricane') || input.includes('storm') || input.includes('shutter')) {
        botResponse = aiResponses.hurricane;
      } else if (input.includes('emergency') || input.includes('urgent') || input.includes('asap') || input.includes('help')) {
        botResponse = aiResponses.emergency;
      } else if (input.includes('cost') || input.includes('price') || input.includes('free') || input.includes('money')) {
        botResponse = aiResponses.pricing;
      } else if (input.includes('when') || input.includes('timeline') || input.includes('how long')) {
        botResponse = aiResponses.timeline;
      } else if (input.includes('where') || input.includes('location') || input.includes('area')) {
        botResponse = aiResponses.location;
      }

      setIsTyping(false);
      setMessages(prev => [...prev, {
        type: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString()
      }]);
    }, 1500);

    setInputMessage("");
  };

  const handleQuickAction = (action: string) => {
    setInputMessage(`I need help with ${action}`);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save contact message to Supabase
      const messageData = {
        full_name: contactForm.name,
        phone: contactForm.phone,
        email: contactForm.email,
        service_needed: contactForm.service,
        project_description: contactForm.description,
        urgency_level: contactForm.urgency,
        timeline: contactForm.urgency === 'emergency' ? 'Emergency' : '1-week',
        lead_value: contactForm.urgency === 'emergency' ? 400 : 200
      };

      const { error } = await supabase
        .from('leads')
        .insert(messageData);

      if (error) throw error;

      toast({
        title: "✅ Message Sent!",
        description: "We'll contact you within 30 minutes with contractor matches!",
      });

      // Add confirmation message to chat
      setMessages(prev => [...prev, {
        type: 'bot',
        text: `🎯 Perfect! I've received your ${contactForm.service} request and forwarded it to our top contractors in your area. Expect calls within 30 minutes with competitive quotes!`,
        time: new Date().toLocaleTimeString()
      }]);

      // Reset form
      setContactForm({
        name: "",
        email: "",
        phone: "",
        service: "",
        description: "",
        urgency: "normal"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[420px] max-h-[700px]">
      <Card className="glass-card shadow-luxury border-primary/30 backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-primary/15 to-accent/15 rounded-t-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 animate-pulse"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-tech">AI Assistant</CardTitle>
              <p className="text-xs text-muted-foreground">Florida's Smartest Contractor Network</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-white/20">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full grid-cols-2 m-3 mb-0">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                AI Chat
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Quick Form
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="p-4 m-0">
              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {quickActions.map((action) => (
                  <Button
                    key={action.value}
                    variant="outline"
                    size="sm"
                    className={`text-xs ${action.urgent ? 'border-red-500/50 hover:bg-red-500/10' : action.popular ? 'border-primary/50 hover:bg-primary/10' : ''}`}
                    onClick={() => handleQuickAction(action.value)}
                  >
                    {action.label}
                    {action.urgent && <Badge variant="destructive" className="ml-1 text-xs">URGENT</Badge>}
                    {action.popular && <Badge variant="secondary" className="ml-1 text-xs">POPULAR</Badge>}
                  </Button>
                ))}
              </div>

              {/* Chat Messages */}
              <div className="h-64 overflow-y-auto space-y-3 mb-4 bg-secondary/10 rounded-lg p-3">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start gap-2 max-w-[85%]`}>
                      {message.type === 'bot' && (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mt-1">
                          <Bot className="h-3 w-3 text-white" />
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-xl ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-primary to-accent text-white rounded-br-md'
                            : 'bg-white/80 text-foreground border border-border/50 rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">{message.time}</p>
                      </div>
                      {message.type === 'user' && (
                        <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center mt-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Bot className="h-3 w-3 text-white" />
                      </div>
                      <div className="bg-white/80 p-3 rounded-xl rounded-bl-md border border-border/50">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about any Florida service..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 glass-card border-primary/20"
                />
                <Button 
                  onClick={handleSendMessage} 
                  size="sm" 
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Trust Signals */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-muted-foreground">Licensed</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-xs text-muted-foreground">Fast Response</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-xs text-muted-foreground">5-Star Rated</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="p-4 m-0">
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold">Name *</Label>
                    <Input
                      id="name"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      placeholder="Your name"
                      className="glass-card border-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                      placeholder="(954) 123-4567"
                      className="glass-card border-primary/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    placeholder="your@email.com"
                    className="glass-card border-primary/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="service" className="text-sm font-semibold">Service *</Label>
                    <select
                      id="service"
                      required
                      value={contactForm.service}
                      onChange={(e) => setContactForm({...contactForm, service: e.target.value})}
                      className="flex h-10 w-full rounded-md border border-primary/20 bg-card/50 backdrop-blur-sm px-3 py-2 text-sm"
                    >
                      <option value="">Select service</option>
                      <option value="Roofing">🏠 Roofing</option>
                      <option value="AC/HVAC">❄️ AC/HVAC</option>
                      <option value="Plumbing">🔧 Plumbing</option>
                      <option value="Electrical">⚡ Electrical</option>
                      <option value="Pool Service">🏊 Pool Service</option>
                      <option value="Landscaping">🌿 Landscaping</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="urgency" className="text-sm font-semibold">Urgency *</Label>
                    <select
                      id="urgency"
                      required
                      value={contactForm.urgency}
                      onChange={(e) => setContactForm({...contactForm, urgency: e.target.value})}
                      className="flex h-10 w-full rounded-md border border-primary/20 bg-card/50 backdrop-blur-sm px-3 py-2 text-sm"
                    >
                      <option value="normal">📅 Normal</option>
                      <option value="urgent">⚡ Urgent</option>
                      <option value="emergency">🚨 Emergency</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold">Project Description</Label>
                  <Textarea
                    id="description"
                    value={contactForm.description}
                    onChange={(e) => setContactForm({...contactForm, description: e.target.value})}
                    placeholder="Describe what you need help with..."
                    className="min-h-[80px] glass-card border-primary/20"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 font-semibold"
                >
                  {isSubmitting ? "🔄 Sending..." : "Get Instant Contractor Matches! ⚡"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  We'll connect you with 2-3 licensed contractors within 30 minutes
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}