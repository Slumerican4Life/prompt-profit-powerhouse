import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Star, Phone, Mail, MapPin, DollarSign, TrendingUp, Users } from "lucide-react";

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
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store lead data (in real app, send to backend/database)
    console.log("New Lead Generated:", formData);
    
    setIsSubmitted(true);
    toast({
      title: "Lead Captured Successfully!",
      description: `High-value ${formData.serviceType || 'service'} lead ready for sale - $75-400 value`,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Lead Captured!</h2>
            <p className="text-muted-foreground mb-4">
              High-value {formData.serviceType} lead worth $75-400 ready for sale to local contractors.
            </p>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-green-800 font-semibold">Business Model:</p>
              <p className="text-green-700 text-sm mt-1">
                Sell this lead to 3-5 local contractors at $75-150 each = $225-750 profit per lead!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">🌴 Florida Service Leads</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span>(954) 555-LEADS</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>info@floridaserviceleads.com</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                Need Home Services in Florida?
                <span className="text-primary block">Get Free Quotes Today! 🏖️</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Connect with licensed, insured local contractors across Florida. From Miami to Tampa, Orlando to Jacksonville - we've got you covered!
              </p>
            </div>

            {/* Service Types Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2 bg-white p-3 rounded-lg border">
                <span>🏠</span> <span>Roofing</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-3 rounded-lg border">
                <span>❄️</span> <span>AC/HVAC</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-3 rounded-lg border">
                <span>🔧</span> <span>Plumbing</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-3 rounded-lg border">
                <span>⚡</span> <span>Electrical</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-3 rounded-lg border">
                <span>🏊</span> <span>Pool Service</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-3 rounded-lg border">
                <span>🌿</span> <span>Landscaping</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-3 rounded-lg border">
                <span>🏗️</span> <span>Remodeling</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-3 rounded-lg border">
                <span>🧹</span> <span>Cleaning</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-3 rounded-lg border">
                <span>🪟</span> <span>Windows</span>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Free Estimates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Florida Contractors</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Hurricane Repairs</span>
              </div>
            </div>

            {/* Social Proof */}
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div>
                  <p className="font-semibold">4.9/5 Rating</p>
                  <p className="text-sm text-muted-foreground">Based on 8,500+ Florida reviews</p>
                </div>
              </div>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">45,000+</p>
                <p className="text-sm text-muted-foreground">Florida Customers</p>
              </Card>
              <Card className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">99%</p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </Card>
              <Card className="p-4 text-center">
                <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">$8K+</p>
                <p className="text-sm text-muted-foreground">Avg. Savings</p>
              </Card>
            </div>
          </div>

          {/* Lead Form */}
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Get Your Free Florida Service Quotes</CardTitle>
              <CardDescription className="text-center">
                Fill out this form and get contacted by up to 3 pre-screened local contractors within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Smith"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(954) 123-4567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Florida Property Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Ocean Blvd, Miami, FL 33101"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceType">Service Needed *</Label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    required
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Select service type</option>
                    <option value="Roofing">🏠 Roofing (Repair/Replace)</option>
                    <option value="AC/HVAC">❄️ AC/HVAC (Repair/Install)</option>
                    <option value="Plumbing">🔧 Plumbing</option>
                    <option value="Electrical">⚡ Electrical</option>
                    <option value="Pool Service">🏊 Pool Service/Repair</option>
                    <option value="Landscaping">🌿 Landscaping/Tree Service</option>
                    <option value="Home Remodeling">🏗️ Home Remodeling</option>
                    <option value="Cleaning Services">🧹 Cleaning Services</option>
                    <option value="Windows/Doors">🪟 Windows/Doors</option>
                    <option value="Painting">🎨 Painting</option>
                    <option value="Flooring">🏠 Flooring</option>
                    <option value="Pest Control">🐛 Pest Control</option>
                    <option value="Solar">☀️ Solar Installation</option>
                    <option value="Hurricane Prep">🌪️ Hurricane Preparation</option>
                    <option value="Other">Other Service</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="urgency">Timeline *</Label>
                  <select
                    id="urgency"
                    name="urgency"
                    required
                    value={formData.urgency}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">When do you need this done?</option>
                    <option value="Emergency">🚨 Emergency (ASAP)</option>
                    <option value="1-week">⚡ Within 1 week</option>
                    <option value="1-month">📅 Within 1 month</option>
                    <option value="3-months">🗓️ Within 3 months</option>
                    <option value="planning">💭 Just planning/research</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Estimated Budget</Label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Select budget range</option>
                    <option value="Under $1,000">Under $1,000</option>
                    <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                    <option value="$5,000 - $15,000">$5,000 - $15,000</option>
                    <option value="$15,000 - $50,000">$15,000 - $50,000</option>
                    <option value="Over $50,000">Over $50,000</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Describe Your Service Needs</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Tell us about your project, any damage, specific requirements, preferred timing, etc..."
                    className="min-h-[80px]"
                  />
                </div>

                <Button type="submit" className="w-full text-lg py-6">
                  Get My Free Florida Quotes Now! 🌴
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By submitting this form, you agree to be contacted by up to 3 pre-screened local contractors. No spam, just quality quotes from Florida professionals.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Business Model Info (For You) */}
        <Card className="mt-12 bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">💰 Your Florida Lead Revenue Model</CardTitle>
          </CardHeader>
          <CardContent className="text-green-700">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <h4 className="font-semibold mb-2">1. Collect Multi-Service Leads</h4>
                <p className="text-sm">Capture high-intent leads across 15+ Florida service categories with full contact & project details.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">2. Sell to Multiple Contractors</h4>
                <p className="text-sm">Sell each lead to 3-5 contractors per service type. AC leads: $100-200, Roofing: $75-150, Pool: $50-100.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">3. Target High-Value Services</h4>
                <p className="text-sm">Focus on hurricane damage, AC repair, roofing, pools, and remodeling - Florida's highest paying niches.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">4. Scale Across Florida</h4>
                <p className="text-sm">Start with your city, then expand to all major FL markets: Miami, Tampa, Orlando, Jacksonville, Fort Lauderdale.</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-green-100 rounded-lg">
              <p className="text-green-800 font-semibold">💡 Florida Advantage:</p>
              <p className="text-green-700 text-sm">Year-round construction season + hurricane damage + 67 counties = massive lead demand. Target emergency services for premium pricing!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
