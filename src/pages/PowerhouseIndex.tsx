import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Star, Phone, Mail, MapPin, Shield, Clock, Award, Zap, Globe, Brain, MessageCircle, ArrowRight, Users, TrendingUp, DollarSign } from "lucide-react";
import { LiveChat } from "@/components/LiveChat";
import { supabase } from "@/integrations/supabase/client";
import detailedNeonBrain from "@/assets/detailed-neon-brain.jpg";
import floridaPalmCorner from "@/assets/florida-palm-corner.jpg";
import floridaOakCorner from "@/assets/florida-oak-corner.jpg";
import floridaRoofer from "@/assets/florida-roofer-action.jpg";
import floridaHvac from "@/assets/florida-hvac-expert.jpg";
import floridaPlumber from "@/assets/florida-plumber-work.jpg";

const PowerhouseIndex = () => {
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
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const calculateLeadValue = () => {
        const emergencyMultiplier = formData.urgency === 'Emergency' ? 1.8 : 1;
        const serviceValues: { [key: string]: number } = {
          'Roofing': 450,
          'AC/HVAC': 350,
          'Plumbing': 300,
          'Electrical': 400,
          'Pool Service': 250,
          'Landscaping': 280,
          'Home Remodeling': 600,
          'Cleaning Services': 180,
          'Windows/Doors': 350,
          'Solar': 750,
          'Hurricane Prep': 500
        };
        
        const baseValue = serviceValues[formData.serviceType] || 250;
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

      // Save to both Supabase and Google Sheets
      const [supabaseResult, googleSheetsResult] = await Promise.allSettled([
        supabase.from('leads').insert(leadData).select().single(),
        fetch("https://script.google.com/macros/s/YOUR_GOOGLE_SCRIPT_ID/exec", {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadData)
        })
      ]);

      if (supabaseResult.status === 'rejected' || 
          (supabaseResult.status === 'fulfilled' && supabaseResult.value.error)) {
        console.error("Supabase error:", supabaseResult);
        throw new Error("Database save failed");
      }

      setIsSubmitted(true);
      toast({
        title: "🔥 Premium Lead Captured!",
        description: `High-value ${formData.serviceType} lead worth $${leadValue} secured. Contractors will contact you within hours!`,
      });
    } catch (error) {
      console.error("Error capturing lead:", error);
      toast({
        title: "Error",
        description: "Failed to capture lead. Please try again.",
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="absolute top-0 left-0 w-64 h-64 opacity-20">
          <img src={floridaPalmCorner} alt="" className="w-full h-full object-cover" />
        </div>
        
        <Card className="max-w-lg w-full text-center glass-card-strong luxury-enter relative z-10">
          <CardContent className="pt-8">
            <div className="glow-pulse rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center neural-glow">
              <CheckCircle className="h-16 w-16 text-green-400" />
            </div>
            <h2 className="text-4xl font-bold mb-4 luxury-text">Lead Secured!</h2>
            <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
              🎯 Premium {formData.serviceType} lead captured and matched with Florida's elite contractors. 
              Expect contact within 30-60 minutes.
            </p>
            <div className="glass-card p-6 rounded-xl mb-6">
              <p className="text-primary font-semibold text-lg mb-2">⚡ Powerhouse Advantage:</p>
              <p className="text-sm leading-relaxed">
                Your lead is now in our AI-powered system, instantly matching you with 2-3 pre-screened, 
                licensed contractors in your area. No waiting, no guesswork.
              </p>
            </div>
            <Button 
              onClick={() => setIsSubmitted(false)} 
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 font-semibold py-3"
            >
              Submit Another Request
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-hero"></div>
      <div className="absolute top-0 left-0 w-72 h-96 opacity-15 z-0">
        <img src={floridaPalmCorner} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute bottom-0 right-0 w-64 h-80 opacity-10 z-0">
        <img src={floridaOakCorner} alt="" className="w-full h-full object-cover" />
      </div>

      {/* Header */}
      <header className="relative bg-gradient-to-r from-card/60 to-card/40 backdrop-blur-xl border-b border-border/50 shadow-deep z-20">
        <div className="absolute inset-0 bg-gradient-neon"></div>
        <div className="relative container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center brain-glow">
                <span className="text-2xl font-bold text-white tech-text">N</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold tech-text luxury-text">Neuronix</h1>
                <p className="text-sm text-muted-foreground">Powerhouse Florida Service Leads</p>
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

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Hero Section */}
          <div className="space-y-10 luxury-enter">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 glass-card border neon-border rounded-full px-6 py-3 text-sm font-medium backdrop-blur-sm glass-shimmer">
                <Brain className="h-5 w-5 text-primary neural-pulse" />
                <span className="tech-text">AI-Powered Contractor Matching</span>
              </div>
              
              <div className="relative">
                <div className="absolute -top-4 -right-4 w-40 h-40 opacity-80 z-0">
                  <img 
                    src={detailedNeonBrain} 
                    alt="Detailed Neon Brain" 
                    className="w-full h-full object-contain brain-glow float-animation" 
                  />
                </div>
                <h2 className="text-6xl lg:text-8xl font-bold leading-tight relative z-10">
                  <span className="block luxury-text tech-text">Florida's</span>
                  <span className="block luxury-text tech-text">Fastest Path</span>
                  <span className="block text-foreground mt-2">to Trusted</span>
                  <span className="block luxury-text tech-text">Contractors</span>
                </h2>
              </div>
              
              <p className="text-2xl text-muted-foreground leading-relaxed">
                <span className="text-primary font-semibold">No Gimmicks, Just Results.</span>
                <br />
                When your property needs help, we connect you to the right pro—in hours, not days.
              </p>
            </div>

            {/* Problem Section */}
            <Card className="glass-card-strong neon-border">
              <CardHeader>
                <CardTitle className="text-2xl luxury-text">Frustrated With Contractor Headaches?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We know the feeling. Unreturned calls, surprise costs, shoddy work—it shouldn't be this hard. 
                  At <span className="text-primary font-semibold">Powerhouse</span>, we've eliminated the guesswork 
                  so you never get burned again.
                </p>
              </CardContent>
            </Card>

            {/* Solution Section */}
            <Card className="glass-card-strong">
              <CardHeader>
                <CardTitle className="text-2xl luxury-text">One Connection. Endless Confidence.</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  From hurricane emergencies to luxury remodels, our network of vetted Florida pros delivers 
                  reliability and craftsmanship. We guarantee a real connection to the perfect contractor 
                  for your job—or we help you until you're satisfied.
                </p>
                
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: "🏠", name: "Roofing", color: "text-red-400" },
                    { icon: "❄️", name: "HVAC", color: "text-blue-400" },
                    { icon: "🔧", name: "Plumbing", color: "text-cyan-400" },
                    { icon: "⚡", name: "Electrical", color: "text-yellow-400" },
                    { icon: "🏊", name: "Pool", color: "text-teal-400" },
                    { icon: "🌿", name: "Landscape", color: "text-green-400" }
                  ].map((service, index) => (
                    <div 
                      key={index} 
                      className="glass-card p-4 text-center hover:scale-105 transition-all duration-300 cursor-pointer group"
                    >
                      <div className={`text-2xl mb-2 group-hover:scale-110 transition-transform ${service.color}`}>
                        {service.icon}
                      </div>
                      <div className="text-sm font-semibold">{service.name}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card className="glass-card-strong">
              <CardHeader>
                <CardTitle className="text-2xl luxury-text">How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { 
                      step: "1", 
                      title: "Tell Us What You Need", 
                      desc: "Fill out the simple form in under 2 minutes.",
                      icon: "📝"
                    },
                    { 
                      step: "2", 
                      title: "We Connect You Fast", 
                      desc: "Get matched with licensed, insured pros instantly.",
                      icon: "⚡"
                    },
                    { 
                      step: "3", 
                      title: "Free Estimate, No Pressure", 
                      desc: "Know your costs upfront. Zero obligation.",
                      icon: "💎"
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white tech-text glow-pulse">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-1">{item.title}</h4>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trust Signals */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Shield, text: "Licensed & Insured", desc: "All contractors verified", color: "text-green-400" },
                { icon: Zap, text: "30-Min Response", desc: "Emergency ready", color: "text-yellow-400" },
                { icon: Star, text: "5-Star Rated", desc: "Premium quality", color: "text-orange-400" }
              ].map((item, index) => (
                <Card key={index} className="glass-card text-center p-4 hover:scale-105 transition-all duration-300">
                  <item.icon className={`h-8 w-8 mx-auto mb-2 ${item.color}`} />
                  <div className="text-sm font-semibold">{item.text}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </Card>
              ))}
            </div>
          </div>

          {/* Premium Lead Form */}
          <Card className="sticky top-8 glass-card-strong shadow-luxury luxury-enter border-2 neon-border">
            <CardHeader className="text-center bg-gradient-neon rounded-t-lg relative overflow-hidden">
              <div className="absolute inset-0 glass-shimmer"></div>
              <CardTitle className="text-3xl font-bold tech-text luxury-text relative z-10">
                Get Your Free Estimate
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground relative z-10">
                Connect with Florida's elite contractors instantly
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
                      className="h-12 glass-card neon-border focus:border-primary"
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
                      className="h-12 glass-card neon-border focus:border-primary"
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
                    className="h-12 glass-card neon-border focus:border-primary"
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
                    className="h-12 glass-card neon-border focus:border-primary"
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
                    className="flex h-12 w-full rounded-md border glass-card neon-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select premium service</option>
                    <option value="Roofing">🏠 Roofing (Emergency/Planned)</option>
                    <option value="AC/HVAC">❄️ AC/HVAC (24/7 Service)</option>
                    <option value="Plumbing">🔧 Plumbing (Emergency Ready)</option>
                    <option value="Electrical">⚡ Electrical (Licensed)</option>
                    <option value="Pool Service">🏊 Pool Service/Repair</option>
                    <option value="Landscaping">🌿 Landscaping/Design</option>
                    <option value="Home Remodeling">🏗️ Luxury Remodeling</option>
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
                      className="flex h-12 w-full rounded-md border glass-card neon-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                      className="flex h-12 w-full rounded-md border glass-card neon-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                    className="min-h-[100px] glass-card neon-border focus:border-primary"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-16 text-lg font-bold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-luxury transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 tech-text"
                >
                  {isSubmitting ? "🔄 Securing Connection..." : "Get Premium Florida Contractors Now! 🚀"}
                </Button>

                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                  By submitting, you agree to be contacted by up to 3 pre-screened, licensed Florida contractors. 
                  No spam—only quality connections from verified professionals.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Section */}
        <Card className="mt-20 glass-card-strong neon-border">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl luxury-text tech-text">Transparent Pricing. No Surprises.</CardTitle>
            <CardDescription className="text-xl">Save 20-40% over traditional contractor searches. All estimates are free and no-obligation.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { service: "Roofing Repairs", range: "$2,500 - $15,000", timeline: "1-3 days", popular: true },
                { service: "AC/HVAC Service", range: "$150 - $8,000", timeline: "Same day", urgent: true },
                { service: "Plumbing Emergency", range: "$200 - $5,000", timeline: "2-4 hours", urgent: true },
                { service: "Electrical Work", range: "$300 - $3,000", timeline: "1-2 days", popular: false },
                { service: "Pool Service", range: "$100 - $2,500", timeline: "Same day", popular: false },
                { service: "Home Remodeling", range: "$5,000 - $75,000", timeline: "2-12 weeks", premium: true }
              ].map((item, index) => (
                <Card key={index} className={`glass-card p-6 text-center hover:scale-105 transition-all duration-300 ${item.urgent ? 'border-red-500/50' : item.premium ? 'border-yellow-500/50' : item.popular ? 'border-primary/50' : ''}`}>
                  <h4 className="text-lg font-semibold mb-2">{item.service}</h4>
                  <p className="text-2xl font-bold luxury-text mb-2">{item.range}</p>
                  <p className="text-sm text-muted-foreground">{item.timeline}</p>
                  {item.urgent && <div className="mt-2 text-xs text-red-400 font-semibold">EMERGENCY</div>}
                  {item.premium && <div className="mt-2 text-xs text-yellow-400 font-semibold">PREMIUM</div>}
                  {item.popular && <div className="mt-2 text-xs text-primary font-semibold">POPULAR</div>}
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Worker Images Section */}
        <div className="mt-20 space-y-12">
          <div className="text-center space-y-4">
            <h3 className="text-5xl font-bold luxury-text tech-text">Florida's Elite Contractors</h3>
            <p className="text-2xl text-muted-foreground">Real professionals, real results, real expertise you can trust</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <Card className="glass-card-strong group hover:shadow-luxury transition-all duration-500 hover:scale-[1.02] overflow-hidden neon-border">
              <div className="relative">
                <img 
                  src={floridaRoofer} 
                  alt="Professional Florida roofer" 
                  className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full neural-pulse"></div>
                    <span className="text-sm font-semibold tech-text">EMERGENCY READY</span>
                  </div>
                  <h4 className="text-2xl font-bold tech-text">🏠 Roofing Experts</h4>
                  <p className="text-sm text-gray-200">Hurricane damage specialists</p>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Response Time:</span>
                    <span className="font-semibold text-green-400 tech-text">30-60 minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Lead Value:</span>
                    <span className="font-semibold luxury-text tech-text">$400-800</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">4.9/5 Rating (1,200+ jobs)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card-strong group hover:shadow-luxury transition-all duration-500 hover:scale-[1.02] overflow-hidden neon-border">
              <div className="relative">
                <img 
                  src={floridaHvac} 
                  alt="Professional HVAC technician" 
                  className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-blue-400 rounded-full neural-pulse"></div>
                    <span className="text-sm font-semibold tech-text">24/7 SERVICE</span>
                  </div>
                  <h4 className="text-2xl font-bold tech-text">❄️ HVAC Masters</h4>
                  <p className="text-sm text-gray-200">Florida heat specialists</p>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Response Time:</span>
                    <span className="font-semibold text-blue-400 tech-text">1-2 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Lead Value:</span>
                    <span className="font-semibold luxury-text tech-text">$300-600</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">4.8/5 Rating (1,500+ jobs)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card-strong group hover:shadow-luxury transition-all duration-500 hover:scale-[1.02] overflow-hidden neon-border">
              <div className="relative">
                <img 
                  src={floridaPlumber} 
                  alt="Professional plumber" 
                  className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-cyan-400 rounded-full neural-pulse"></div>
                    <span className="text-sm font-semibold tech-text">WATER EMERGENCY</span>
                  </div>
                  <h4 className="text-2xl font-bold tech-text">🔧 Plumbing Pros</h4>
                  <p className="text-sm text-gray-200">Water damage prevention</p>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Response Time:</span>
                    <span className="font-semibold text-cyan-400 tech-text">45-90 minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Lead Value:</span>
                    <span className="font-semibold luxury-text tech-text">$250-500</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">4.9/5 Rating (1,100+ jobs)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Final CTA */}
        <Card className="mt-20 glass-card-strong neon-border text-center p-12">
          <CardContent>
            <h3 className="text-5xl font-bold luxury-text tech-text mb-6">
              Florida's Fastest Path to Trusted Contractors
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Stop wasting time with unreliable contractors. Get connected with Florida's elite professionals 
              in minutes, not days. Premium quality, guaranteed results.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-xl font-bold py-6 px-12 tech-text"
              onClick={() => document.getElementById('serviceType')?.focus()}
            >
              Get Your Free Estimate Now <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="mt-20 bg-card/20 backdrop-blur-xl border-t border-border/50 relative z-20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center brain-glow">
                <span className="text-2xl font-bold text-white tech-text">N</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold tech-text luxury-text">Neuronix</h3>
                <p className="text-sm text-muted-foreground">Powerhouse Florida Service Leads</p>
              </div>
            </div>
            
            <div className="flex justify-center items-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>(941) 253-8936</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>cleanasawhistle1000@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Serving All Florida Counties</span>
              </div>
            </div>
            
            <div className="pt-6 border-t border-border/30">
              <p className="text-sm text-muted-foreground">
                <span className="text-primary font-semibold">Proudly new, never failed a match yet</span>—and we'll go to any length to keep it that way.
              </p>
              <p className="text-xs text-muted-foreground/70 mt-2">
                © 2024 Neuronix. Licensed contractors only. All estimates free and no-obligation.
              </p>
            </div>
          </div>
        </div>
      </footer>

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

export default PowerhouseIndex;