import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Phone, MapPin, Clock, Star, Shield, Zap, Award, CheckCircle, Home, User, Settings, Brain, BrainCircuit } from "lucide-react";
import { LiveChat } from "@/components/LiveChat";
import { useAuth } from "@/hooks/useAuth";
import aiBrainHero from "@/assets/ai-brain-hero.jpg";
import brainIcon from "@/assets/brain-icon.jpg";
import detailedNeonBrain from "@/assets/detailed-neon-brain.jpg";
import floridaHVACExpertImg from "@/assets/florida-hvac-expert.jpg";
import floridaPlumberWorkImg from "@/assets/florida-plumber-work.jpg";
import floridaRooferActionImg from "@/assets/florida-roofer-action.jpg";
import floridaOakCornerImg from "@/assets/florida-oak-corner.jpg";
import floridaPalmCornerImg from "@/assets/florida-palm-corner.jpg";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user, profile } = useAuth();

  const services = [
    { name: "🏠 Roofing", description: "Emergency repairs & full replacement", price: "Get estimates when available", icon: "🏠", urgent: true },
    { name: "❄️ AC/HVAC", description: "24/7 cooling system experts", price: "Free estimates when available", icon: "❄️", popular: true },
    { name: "🔧 Plumbing", description: "Emergency & scheduled service", price: "Quick response available", icon: "🔧", popular: true },
    { name: "⚡ Electrical", description: "Licensed & insured electricians", price: "Safety first approach", icon: "⚡", urgent: false },
    { name: "🦟 Head Lice Removal", description: "Professional lice treatment & nurse services", price: "Same-day service available", icon: "🦟", popular: true },
    { name: "🏊 Pool Service", description: "Maintenance & equipment repair", price: "Seasonal packages available", icon: "🏊", popular: false },
    { name: "🌿 Landscaping", description: "Design & maintenance", price: "Custom quotes available", icon: "🌿", popular: false },
    { name: "🎨 Interior Design", description: "Kitchen & bathroom remodeling", price: "Design consultation", icon: "🎨", popular: false },
    { name: "🧽 House Cleaning", description: "Regular & deep cleaning services", price: "Weekly packages", icon: "🧽", popular: false },
    { name: "🌪️ Hurricane Prep", description: "Storm shutters & board-up services", price: "Emergency response", icon: "🌪️", urgent: true },
    { name: "🏗️ General Contracting", description: "Home additions & renovations", price: "Project estimates", icon: "🏗️", popular: false },
    { name: "🛠️ Custom Services", description: "Any service you need - just describe it!", price: "Personalized quotes", icon: "🛠️", popular: true },
  ];

  const trustSignals = [
    { icon: Shield, text: "Licensed & Insured", desc: "All contractors verified" },
    { icon: Clock, text: "24/7 Emergency", desc: "Hurricane response ready" }, 
    { icon: Award, text: "5-Star Rated", desc: "Premium quality guaranteed" },
    { icon: Zap, text: "Instant Connect", desc: "Response within hours" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      {/* Hero Section with Navigation */}
      <div className="relative bg-gradient-to-br from-primary/20 via-background to-accent/20 min-h-[80vh] flex flex-col overflow-hidden">
        {/* Decorative brain and palm images */}
        <img 
          src={aiBrainHero} 
          alt="AI Brain Hero" 
          className="absolute top-0 right-0 w-64 h-64 object-cover opacity-30 rounded-bl-3xl brain-glow float-animation"
        />
        <img 
          src={floridaPalmCornerImg} 
          alt="Florida palms" 
          className="absolute top-0 left-0 w-48 h-48 object-cover opacity-40 rounded-br-3xl glow-pulse"
        />
        <img 
          src={detailedNeonBrain} 
          alt="Neon Brain" 
          className="absolute bottom-20 left-10 w-32 h-32 object-cover opacity-20 rounded-full neural-pulse lightning-flicker"
        />

        {/* Navigation */}
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              FloridaServiceConnect
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#services" className="text-muted-foreground hover:text-primary transition-colors font-medium">Services</a>
            <a href="#about" className="text-muted-foreground hover:text-primary transition-colors font-medium">About</a>
            <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors font-medium">Contact</a>
            {user ? (
              <div className="flex items-center gap-3">
                {(profile?.role === 'owner' || profile?.role === 'manager') && (
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm" className="flex items-center gap-2 glass-card border-primary/30">
                      <Settings className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                )}
                <span className="text-muted-foreground">Welcome, {profile?.full_name || user.email}</span>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="flex items-center gap-2 glass-card border-primary/30">
                  <User className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </nav>

        {/* Hero Content */}
        <div className="flex-1 container mx-auto px-6 flex items-center relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-full px-6 py-3 text-sm font-medium text-primary backdrop-blur-sm mb-8">
              <BrainCircuit className="h-5 w-5" />
              <span className="font-tech">AI-Powered Contractor Matching</span>
            </div>
            
            <div className="relative mb-8">
              <img 
                src={brainIcon} 
                alt="AI Brain" 
                className="absolute top-0 right-0 w-24 h-24 opacity-40 brain-glow neural-pulse" 
              />
              <h1 className="text-6xl md:text-8xl font-bold leading-tight relative z-10">
                <span className="font-tech bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent animate-none">
                  FloridaServiceConnect
                </span>
                <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mt-2 animate-none">
                  🧠⚡
                </span>
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl mb-8 text-muted-foreground leading-relaxed max-w-4xl mx-auto">
              Our AI instantly matches you with Florida's elite contractors. From emergency hurricane repairs 
              to luxury renovations - intelligent connections, guaranteed results across all 67 counties.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Button
                onClick={() => setIsChatOpen(true)}
                size="lg"
                className="bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 text-lg px-8 py-6 rounded-xl shadow-luxury glass-card border border-white/20"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Start AI Chat 🧠
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="glass-card border-primary/30 text-primary hover:bg-primary/10 text-lg px-8 py-6 rounded-xl backdrop-blur-sm"
              >
                <Phone className="mr-2 h-5 w-5" />
                Call: (941) 253-8936
              </Button>
            </div>

            {/* Enhanced Stats with Glass Effect */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="glass-card p-8 text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">67</div>
                <div className="text-muted-foreground font-medium">Florida Counties</div>
                <div className="text-xs text-muted-foreground/70 mt-1">Statewide Coverage</div>
              </div>
              <div className="glass-card p-8 text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">24/7</div>
                <div className="text-muted-foreground font-medium">Emergency Service</div>
                <div className="text-xs text-muted-foreground/70 mt-1">Hurricane Ready</div>
              </div>
              <div className="glass-card p-8 text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI</div>
                <div className="text-muted-foreground font-medium">Smart Matching</div>
                <div className="text-xs text-muted-foreground/70 mt-1">Instant Connection</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Services Section with Glassmorphism */}
      <section id="services" className="py-20 container mx-auto px-6 relative overflow-hidden">
        {/* Background brain imagery */}
        <img 
          src={detailedNeonBrain} 
          alt="Background brain" 
          className="absolute top-10 right-10 w-48 h-48 opacity-10 brain-glow float-animation lightning-flicker"
        />
        
        <div className="text-center mb-16 relative z-10">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-full px-6 py-3 text-sm font-medium text-primary backdrop-blur-sm mb-6">
            <Brain className="h-5 w-5" />
            <span>AI-Powered Service Matching</span>
          </div>
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Professional Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From emergency repairs to planned renovations, our AI network connects you with Florida's elite contractors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="glass-card p-6 rounded-xl border border-primary/20 hover:shadow-luxury transition-all duration-300 hover:scale-105 group">
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <div className="flex gap-2">
                  {service.urgent && <Badge variant="destructive" className="text-xs">URGENT</Badge>}
                  {service.popular && <Badge variant="secondary" className="text-xs">POPULAR</Badge>}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
              <p className="text-muted-foreground mb-4">{service.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary">{service.price}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsChatOpen(true)}
                  className="hover:bg-primary hover:text-white"
                >
                  Get Quote
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustSignals.map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6 glass-card rounded-xl">
                <item.icon className="h-12 w-12 text-primary mb-4" />
                <h4 className="font-semibold mb-2">{item.text}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Contractors */}
      <section id="about" className="py-20 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Meet Florida's Elite Contractors</h2>
          <p className="text-xl text-muted-foreground">
            Real professionals, real results, real expertise you can trust
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              img: floridaRooferActionImg, 
              title: "🏠 Roofing Experts", 
              desc: "Hurricane damage specialists",
              response: "30-60 minutes",
              rating: "4.9/5 (850+ jobs)"
            },
            { 
              img: floridaHVACExpertImg, 
              title: "❄️ HVAC Masters", 
              desc: "Florida heat specialists",
              response: "1-2 hours", 
              rating: "4.8/5 (1,200+ jobs)"
            },
            { 
              img: floridaPlumberWorkImg, 
              title: "🔧 Plumbing Pros", 
              desc: "Water damage prevention",
              response: "45-90 minutes",
              rating: "4.9/5 (950+ jobs)"
            }
          ].map((contractor, index) => (
            <div key={index} className="glass-card rounded-xl overflow-hidden hover:shadow-luxury transition-all duration-300 hover:scale-105 group">
              <div className="relative">
                <img 
                  src={contractor.img} 
                  alt={contractor.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="text-xl font-bold">{contractor.title}</h4>
                  <p className="text-sm text-gray-200">{contractor.desc}</p>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Response Time:</span>
                  <span className="font-semibold text-primary">{contractor.response}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold">{contractor.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Connect?</h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Get started with Florida's premier contractor network. Fast, reliable, professional service across all 67 counties.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setIsChatOpen(true)}
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg px-8 py-6 rounded-xl shadow-luxury"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Start AI Chat
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-xl border-primary text-primary hover:bg-primary hover:text-white"
            >
              <MapPin className="mr-2 h-5 w-5" />
              Find Local Contractors
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>(941) 253-8936</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✉️</span>
              <span>cleanasawhistle1000@gmail.com</span>
            </div>
          </div>
        </div>
      </section>

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