import { useState, useEffect } from "react";
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
    { type: 'bot', text: "🤖 Hi! I'm your Florida Service AI Assistant. I can connect you with verified contractors across all 67 Florida counties. What service do you need help with today?", time: new Date().toLocaleTimeString() }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    customService: "",
    description: "",
    urgency: "normal"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAwayMode, setIsAwayMode] = useState(false);
  const { toast } = useToast();

  // Check if service is in away mode
  useEffect(() => {
    checkAwayStatus();
  }, []);

  const checkAwayStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_away')
        .eq('role', 'owner')
        .single();

      if (!error && data) {
        setIsAwayMode(data.is_away);
      }
    } catch (error) {
      console.error('Error checking away status:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: 'user',
      text: inputMessage,
      time: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Add to conversation history
    const newHistory = [...conversationHistory, { role: 'user', content: inputMessage }];
    setConversationHistory(newHistory);

    try {
      // Call OpenAI edge function
      const { data, error } = await supabase.functions.invoke('openai-chat', {
        body: {
          message: inputMessage,
          conversationHistory: newHistory
        }
      });

      if (error) throw error;

      const botResponse = data.response || "I apologize, I'm having trouble connecting right now. Please try again or use the contact form below.";
      
      setMessages(prev => [...prev, {
        type: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString()
      }]);

      // Update conversation history with AI response
      setConversationHistory([...newHistory, { role: 'assistant', content: botResponse }]);

    } catch (error) {
      console.error('Error calling OpenAI:', error);
      
      // Fallback to basic responses if OpenAI fails
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
      } else if (input.includes('emergency') || input.includes('urgent') || input.includes('asap') || input.includes('help')) {
        botResponse = isAwayMode ? "🚨 I understand this is urgent! The team is currently away, but I'm here to help collect your information and ensure you get priority response when they return. Please fill out the form below with your emergency details." : aiResponses.emergency;
      }

      setMessages(prev => [...prev, {
        type: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsTyping(false);
      setInputMessage("");
    }
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
      const serviceNeeded = contactForm.service === "Other" ? contactForm.customService : contactForm.service;
      const messageData = {
        full_name: contactForm.name,
        phone: contactForm.phone,
        email: contactForm.email,
        service_needed: serviceNeeded,
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
        text: `🎯 Perfect! I've received your ${serviceNeeded} request and forwarded it to our top contractors in your area. Expect calls within 30 minutes with competitive quotes!`,
        time: new Date().toLocaleTimeString()
      }]);

      // Reset form
      setContactForm({
        name: "",
        email: "",
        phone: "",
        service: "",
        customService: "",
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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const chatElement = document.getElementById('live-chat-container');
      if (chatElement && !chatElement.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      
      {/* Chat Container */}
      <div 
        id="live-chat-container"
        className="fixed bottom-4 right-4 z-50 w-[420px] max-h-[700px]"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="glass-card shadow-luxury border-primary/30 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-primary/15 to-accent/15 rounded-t-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 animate-pulse"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-tech">AI Assistant</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {isAwayMode ? "Away - Leave Message with AI" : "Florida's Smartest Contractor Network"}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="hover:bg-white/20 w-8 h-8 p-0 rounded-full z-20"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
        
        <CardContent className="p-0">
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full grid-cols-3 m-3 mb-0">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                AI Chat
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Quick Form
              </TabsTrigger>
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Manual Entry
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="p-4 m-0">
              {/* Chat Messages */}
              <div className="h-80 overflow-y-auto space-y-3 mb-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-lg p-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start gap-2 max-w-[85%]`}>
                      {message.type === 'bot' && (
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center mt-1 flex-shrink-0">
                          <Bot className="h-3 w-3 text-white" />
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-xl border-2 ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white border-blue-600 rounded-br-md shadow-sm'
                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-600 rounded-bl-md shadow-sm'
                        }`}
                      >
                        <p className="text-sm leading-relaxed font-medium">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1 font-normal">{message.time}</p>
                      </div>
                      {message.type === 'user' && (
                        <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-600 border-2 border-slate-400 dark:border-slate-500 flex items-center justify-center mt-1 flex-shrink-0">
                          <User className="h-3 w-3 text-slate-700 dark:text-slate-300" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-3 w-3 text-white" />
                      </div>
                      <div className="bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 p-3 rounded-xl rounded-bl-md shadow-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
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
                  placeholder="Tell me what service you need help with..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 border-2 border-slate-300 dark:border-slate-600 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
                <Button 
                  onClick={handleSendMessage} 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-600"
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
                      onChange={(e) => setContactForm({...contactForm, service: e.target.value, customService: ""})}
                      className="flex h-10 w-full rounded-md border border-primary/20 bg-card/50 backdrop-blur-sm px-3 py-2 text-sm"
                    >
                      <option value="">Select service</option>
                      <option value="Roofing">🏠 Roofing</option>
                      <option value="AC/HVAC">❄️ AC/HVAC</option>
                      <option value="Plumbing">🔧 Plumbing</option>
                      <option value="Electrical">⚡ Electrical</option>
                      <option value="Head Lice Removal">🦟 Head Lice Removal</option>
                      <option value="Pool Service">🏊 Pool Service</option>
                      <option value="Landscaping">🌿 Landscaping</option>
                      <option value="Other">Other (Custom)</option>
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

                {/* Custom Service Input */}
                {contactForm.service === "Other" && (
                  <div className="space-y-2">
                    <Label htmlFor="customService" className="text-sm font-semibold">What service do you need? *</Label>
                    <Input
                      id="customService"
                      required
                      value={contactForm.customService}
                      onChange={(e) => setContactForm({...contactForm, customService: e.target.value})}
                      placeholder="Please describe the service you need..."
                      className="glass-card border-primary/20"
                    />
                  </div>
                )}

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

            <TabsContent value="manual" className="p-4 m-0">
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="font-bold text-foreground mb-2">📞 Manual Lead Entry</h3>
                  <p className="text-xs text-muted-foreground">
                    Use this when taking calls directly from customers
                  </p>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="manual-name" className="text-sm font-semibold text-foreground">Customer Name *</Label>
                      <Input
                        id="manual-name"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                        placeholder="Customer's full name"
                        className="border-2 border-border focus:border-primary bg-background text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="manual-phone" className="text-sm font-semibold text-foreground">Phone Number *</Label>
                      <Input
                        id="manual-phone"
                        type="tel"
                        required
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                        placeholder="Customer's phone"
                        className="border-2 border-border focus:border-primary bg-background text-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="manual-email" className="text-sm font-semibold text-foreground">Email Address</Label>
                    <Input
                      id="manual-email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      placeholder="Customer's email (optional)"
                      className="border-2 border-border focus:border-primary bg-background text-foreground"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="manual-service" className="text-sm font-semibold text-foreground">Service Needed *</Label>
                      <select
                        id="manual-service"
                        required
                        value={contactForm.service}
                        onChange={(e) => setContactForm({...contactForm, service: e.target.value, customService: ""})}
                        className="flex h-10 w-full rounded-md border-2 border-border focus:border-primary bg-background text-foreground px-3 py-2 text-sm"
                      >
                        <option value="">What do they need?</option>
                        <option value="Roofing">🏠 Roofing</option>
                        <option value="AC/HVAC">❄️ AC/HVAC</option>
                        <option value="Plumbing">🔧 Plumbing</option>
                        <option value="Electrical">⚡ Electrical</option>
                        <option value="Head Lice Removal">🦟 Head Lice Removal</option>
                        <option value="Pool Service">🏊 Pool Service</option>
                        <option value="Landscaping">🌿 Landscaping</option>
                        <option value="Hurricane Prep">🌪️ Hurricane Prep</option>
                        <option value="General Contracting">🔨 General Contracting</option>
                      <option value="Other">❓ Other (Custom Service)</option>
                      <option value="Custom Service">🛠️ Custom Service (Describe Below)</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="manual-urgency" className="text-sm font-semibold text-foreground">How Urgent? *</Label>
                      <select
                        id="manual-urgency"
                        required
                        value={contactForm.urgency}
                        onChange={(e) => setContactForm({...contactForm, urgency: e.target.value})}
                        className="flex h-10 w-full rounded-md border-2 border-border focus:border-primary bg-background text-foreground px-3 py-2 text-sm"
                      >
                        <option value="normal">📅 Normal (1-2 weeks)</option>
                        <option value="urgent">⚡ Urgent (this week)</option>
                        <option value="emergency">🚨 Emergency (today)</option>
                      </select>
                    </div>
                  </div>

                  {/* Custom Service Input for Manual Entry */}
                  {(contactForm.service === "Other" || contactForm.service === "Custom Service") && (
                    <div className="space-y-2">
                      <Label htmlFor="manual-customService" className="text-sm font-semibold text-foreground">What service do they need? *</Label>
                      <Input
                        id="manual-customService"
                        required
                        value={contactForm.customService}
                        onChange={(e) => setContactForm({...contactForm, customService: e.target.value})}
                        placeholder="Describe any service needed - roofing, plumbing, electrical, head lice treatment, etc..."
                        className="border-2 border-border focus:border-primary bg-background text-foreground"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="manual-description" className="text-sm font-semibold text-foreground">Details & Notes</Label>
                    <Textarea
                      id="manual-description"
                      value={contactForm.description}
                      onChange={(e) => setContactForm({...contactForm, description: e.target.value})}
                      placeholder="Project details, location, budget, timeline, special requirements, head lice service details, etc..."
                      className="min-h-[100px] border-2 border-border focus:border-primary bg-background text-foreground"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold border-2 border-destructive"
                  >
                    {isSubmitting ? "📤 Creating Lead..." : "📞 Create Lead & Send to Contractors"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Lead will be distributed to contractors immediately
                  </p>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        </Card>
      </div>
    </>
  );
}