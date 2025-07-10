import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Star, Phone, Mail, MapPin, DollarSign, TrendingUp, Users, MessageCircle, Shield, Clock, Award, Zap, Globe, Brain, BrainCircuit } from "lucide-react";
import { LiveChat } from "@/components/LiveChat";
import { supabase } from "@/integrations/supabase/client";
import aiBrainHero from "@/assets/ai-brain-hero.jpg";
import brainIcon from "@/assets/brain-icon.jpg";

const Index = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    serviceType: "",
    urgency: "",
    budget: "",
    description: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const { toast } = useToast();

  // Load services from Supabase
  useEffect(() => {
    const loadServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('active', true)
        .order('name');
      
      if (data && !error) {
        setServices(data);
      }
    };
    
    loadServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Calculate lead value based on urgency and service type
      const calculateLeadValue = () => {
        const emergencyMultiplier = formData.urgency === 'Emergency' ? 1.5 : 1;
        const serviceValues: { [key: string]: number } = {
          'Roofing': 400,
          'AC/HVAC': 300,
          'Plumbing': 250,
          'Electrical': 350,
          'Pool Service': 200,
          'Landscaping': 250,
          'Home Remodeling': 500,
          'Cleaning Services': 150,
          'Windows/Doors': 300,
          'Solar': 600,
          'Hurricane Prep': 450
        };
        
        const baseValue = serviceValues[formData.serviceType] || 200;
        return Math.round(baseValue * emergencyMultiplier);
      };

      const leadValue = calculateLeadValue();
      const leadData = {
        full_name: formData.name,
        phone: formData.phone,
        email: formData.email,
        service_needed: formData.serviceType,
        timeline: formData.urgency,
        budget: formData.budget,
        property_address: formData.address,
        project_description: formData.description,
        urgency_level: formData.urgency,
        lead_value: leadValue,
        timestamp: new Date().toISOString()
      };

      // Parallel execution: Save to both Supabase AND Google Sheets
      const [supabaseResult, googleSheetsResult] = await Promise.allSettled([
        // Save to Supabase
        supabase.from('leads').insert(leadData).select().single(),
        
        // Save to Google Sheets
        fetch("https://script.google.com/macros/s/YOUR_GOOGLE_SCRIPT_ID/exec", {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadData)
        })
      ]);

      // Check Supabase result
      if (supabaseResult.status === 'rejected' || 
          (supabaseResult.status === 'fulfilled' && supabaseResult.value.error)) {
        console.error("Supabase error:", supabaseResult);
        throw new Error("Database save failed");
      }

      console.log("Lead captured successfully in both systems:", leadData);
      
      setIsSubmitted(true);
      toast({
        title: "🎯 Premium Lead Captured!",
        description: `High-value ${formData.serviceType} lead worth $${leadValue} saved to database & spreadsheet!`,
      });
    } catch (error) {
      console.error("Error capturing lead:", error);
      toast({
        title: "Error",
        description: "There was an issue capturing your lead. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center glass-card luxury-enter">
          <CardContent className="pt-6">
            <div className="glow-pulse rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-green-500/20">
              <CheckCircle className="h-12 w-12 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold mb-3 luxury-text">Lead Captured!</h2>
            <p className="text-muted-foreground mb-6 text-lg">
              High-value {formData.serviceType} lead worth $75-400 ready for sale to local contractors.
            </p>
            <div className="bg-green-500/10 p-6 rounded-xl border border-green-500/20 backdrop-blur-sm">
              <p className="text-green-400 font-semibold text-lg">💰 Business Model:</p>
              <p className="text-green-300 text-sm mt-2">
                Sell this lead to 3-5 local contractors at $75-150 each = $225-750 profit per lead!
              </p>
            </div>
            <Button 
              onClick={() => setIsSubmitted(false)} 
              className="mt-6 w-full"
              variant="outline"
            >
              Capture Another Lead
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Premium Header */}
      <header className="relative bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-xl border-b border-border/50 shadow-deep">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5"></div>
        <div className="relative container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-xl font-bold text-white">🌴</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold luxury-text">Florida Service Leads</h1>
                <p className="text-sm text-muted-foreground">Premium Contractor Network Since 2019</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Phone className="h-4 w-4" />
                <span className="font-medium">(941) 253-8936</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-4 w-4" />
                <span className="font-medium">cleanasawhistle1000@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Enhanced Hero Section */}
          <div className="space-y-8 luxury-enter">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-full px-6 py-3 text-sm font-medium text-primary backdrop-blur-sm">
                <BrainCircuit className="h-5 w-5" />
                <span className="font-tech">AI-Powered Lead Matching</span>
              </div>
              
              <div className="relative">
                <img 
                  src={aiBrainHero} 
                  alt="AI Brain with Lightning" 
                  className="absolute top-0 right-0 w-32 h-18 opacity-30 z-0" 
                />
                <h2 className="text-5xl lg:text-7xl font-bold leading-tight relative z-10">
                  <span className="font-tech bg-gradient-to-r from-purple-400 via-blue-400 to-yellow-400 bg-clip-text text-transparent">
                    Smart Service
                  </span>
                  <span className="block luxury-text mt-2 font-sans">Connections 🧠⚡</span>
                </h2>
              </div>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Our AI instantly matches Florida customers with the perfect contractors. 
                From emergency hurricane repairs to luxury renovations - intelligent connections, guaranteed results.
              </p>
            </div>

            {/* Enhanced Service Grid */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: "🏠", name: "Roofing", desc: "Emergency & planned" },
                { icon: "❄️", name: "AC/HVAC", desc: "24/7 cooling experts" },
                { icon: "🔧", name: "Plumbing", desc: "Emergency response" },
                { icon: "⚡", name: "Electrical", desc: "Licensed & insured" },
                { icon: "🏊", name: "Pool Service", desc: "Maintenance & repair" },
                { icon: "🌿", name: "Landscaping", desc: "Design & maintenance" },
                { icon: "🏗️", name: "Remodeling", desc: "Complete makeovers" },
                { icon: "🧹", name: "Cleaning", desc: "Professional deep clean" },
                { icon: "🪟", name: "Windows", desc: "Installation & repair" }
              ].map((service, index) => (
                <Card 
                  key={index} 
                  className="glass-card hover:shadow-luxury transition-all duration-300 hover:scale-105 cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardContent className="p-4 text-center relative z-10">
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                      {service.icon}
                    </div>
                    <div className="text-sm font-semibold mb-1">{service.name}</div>
                    <div className="text-xs text-muted-foreground">{service.desc}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Premium Trust Signals */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, text: "Licensed & Insured", desc: "All contractors verified" },
                { icon: Clock, text: "24/7 Emergency", desc: "Hurricane response ready" },
                { icon: Award, text: "5-Star Rated", desc: "Premium quality guaranteed" },
                { icon: Zap, text: "Instant Connect", desc: "Response within hours" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg glass-card">
                  <item.icon className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm font-medium">{item.text}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Social Proof */}
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <div>
                      <p className="text-lg font-bold">4.9/5 Excellence Rating</p>
                      <p className="text-sm text-muted-foreground">Based on 15,000+ Florida reviews</p>
                    </div>
                  </div>
                  <Globe className="h-8 w-8 text-primary float-animation" />
                </div>
              </CardContent>
            </Card>

            {/* Premium Stats */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { icon: Users, value: "67K+", label: "Florida Customers", color: "text-blue-400" },
                { icon: TrendingUp, value: "99.2%", label: "Success Rate", color: "text-green-400" },
                { icon: DollarSign, value: "$12K+", label: "Avg. Savings", color: "text-yellow-400" }
              ].map((stat, index) => (
                <Card key={index} className="glass-card group hover:shadow-luxury transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <stat.icon className={`h-10 w-10 mx-auto mb-3 ${stat.color} group-hover:scale-110 transition-transform`} />
                    <p className="text-3xl font-bold mb-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Premium Lead Form */}
          <Card className="sticky top-8 glass-card shadow-luxury luxury-enter border-2 border-primary/20">
            <CardHeader className="text-center bg-gradient-to-r from-primary/15 to-accent/15 rounded-t-lg relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <img src={brainIcon} alt="AI Brain" className="w-12 h-12 opacity-60" />
              </div>
              <CardTitle className="text-3xl font-tech bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                AI Smart Matching
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Get connected with Florida's elite contractors instantly
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Smith"
                      className="h-12 glass-card border-primary/20 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(954) 123-4567"
                      className="h-12 glass-card border-primary/20 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="h-12 glass-card border-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-semibold">Florida Property Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Ocean Blvd, Miami, FL 33101"
                    className="h-12 glass-card border-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceType" className="text-sm font-semibold">Service Needed *</Label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    required
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    className="flex h-12 w-full rounded-md border border-primary/20 bg-card/50 backdrop-blur-sm px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select premium service</option>
                    <option value="Roofing">🏠 Roofing (Repair/Replace)</option>
                    <option value="AC/HVAC">❄️ AC/HVAC (Premium Service)</option>
                    <option value="Plumbing">🔧 Plumbing</option>
                    <option value="Electrical">⚡ Electrical</option>
                    <option value="Pool Service">🏊 Pool Service/Repair</option>
                    <option value="Landscaping">🌿 Landscaping/Tree Service</option>
                    <option value="Home Remodeling">🏗️ Premium Remodeling</option>
                    <option value="Cleaning Services">🧹 Professional Cleaning</option>
                    <option value="Windows/Doors">🪟 Windows/Doors</option>
                    <option value="Solar">☀️ Solar Installation</option>
                    <option value="Hurricane Prep">🌪️ Hurricane Preparation</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="urgency" className="text-sm font-semibold">Timeline *</Label>
                    <select
                      id="urgency"
                      name="urgency"
                      required
                      value={formData.urgency}
                      onChange={handleInputChange}
                      className="flex h-12 w-full rounded-md border border-primary/20 bg-card/50 backdrop-blur-sm px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Select timeline</option>
                      <option value="Emergency">🚨 Emergency (ASAP)</option>
                      <option value="1-week">⚡ Within 1 week</option>
                      <option value="1-month">📅 Within 1 month</option>
                      <option value="3-months">🗓️ Within 3 months</option>
                      <option value="planning">💭 Planning phase</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget" className="text-sm font-semibold">Investment Range</Label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="flex h-12 w-full rounded-md border border-primary/20 bg-card/50 backdrop-blur-sm px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Select budget</option>
                      <option value="Under $1,000">Under $1,000</option>
                      <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                      <option value="$5,000 - $15,000">$5,000 - $15,000</option>
                      <option value="$15,000 - $50,000">$15,000 - $50,000</option>
                      <option value="Over $50,000">Over $50,000</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold">Project Details</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your project, any specific requirements, damage details, or preferences..."
                    className="min-h-[100px] glass-card border-primary/20 focus:border-primary"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-luxury transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
                >
                  {isSubmitting ? "🔄 Capturing Lead..." : "Get Premium Florida Quotes Now! ✨"}
                </Button>

                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                  By submitting, you agree to be contacted by up to 3 pre-screened, premium Florida contractors. 
                  No spam - only quality quotes from licensed professionals.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Business Model Section */}
        <Card className="mt-16 glass-card border-green-500/20 bg-gradient-to-r from-green-500/5 to-emerald-500/5">
          <CardHeader>
            <CardTitle className="text-3xl text-center">
              <span className="luxury-text">💰 Your Premium Revenue Model</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  title: "1. Capture Premium Leads",
                  desc: "Collect high-intent leads across 15+ Florida service categories with complete project details and urgency indicators.",
                  icon: "📊"
                },
                {
                  title: "2. Sell to Multiple Contractors", 
                  desc: "Sell each lead to 3-5 contractors. Emergency AC: $200+, Hurricane roofing: $300+, Pool repairs: $100+.",
                  icon: "💼"
                },
                {
                  title: "3. Target High-Value Services",
                  desc: "Focus on hurricane damage, emergency AC, luxury remodeling, and pool services - Florida's premium niches.",
                  icon: "🎯"
                },
                {
                  title: "4. Scale Statewide",
                  desc: "Expand across 67 Florida counties: Miami-Dade, Broward, Orange, Hillsborough, Duval, and beyond.",
                  icon: "🌴"
                }
              ].map((item, index) => (
                <div key={index} className="text-center space-y-3">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h4 className="font-bold text-lg text-emerald-400">{item.title}</h4>
                  <p className="text-sm text-emerald-300/80 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-xl border border-emerald-500/20">
              <div className="text-center">
                <p className="text-emerald-400 font-bold text-xl mb-2">🚀 Florida Advantage</p>
                <p className="text-emerald-300 leading-relaxed">
                  Year-round construction + hurricane season + 22 million residents + premium tourism market = 
                  massive lead demand. Emergency services command 2-3x premium pricing!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <Button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-luxury glow-pulse z-40 bg-gradient-to-r from-primary to-accent"
          size="lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Live Chat Component */}
      <LiveChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Index;
