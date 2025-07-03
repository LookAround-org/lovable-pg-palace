
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, Users, Phone, AlertTriangle, CheckCircle, Lock, Camera } from 'lucide-react';

const SafetyInformation = () => {
  const safetyFeatures = [
    {
      icon: Shield,
      title: "Verified Properties",
      description: "All properties undergo thorough verification including document checks and physical inspections."
    },
    {
      icon: Eye,
      title: "Background Checks",
      description: "Host verification with identity and background checks for your peace of mind."
    },
    {
      icon: Camera,
      title: "Security Systems",
      description: "CCTV surveillance and security measures in common areas of verified properties."
    },
    {
      icon: Lock,
      title: "Secure Transactions",
      description: "All payments and personal information are protected with bank-level security."
    },
    {
      icon: Users,
      title: "Community Support",
      description: "24/7 support team and community guidelines to ensure a safe environment."
    },
    {
      icon: Phone,
      title: "Emergency Assistance",
      description: "Quick access to emergency contacts and local authorities when needed."
    }
  ];

  const safetyTips = [
    {
      category: "Before Moving In",
      tips: [
        "Always visit the property in person before making any commitments",
        "Verify the property owner's identity and legal documents",
        "Check the neighborhood safety and transportation options",
        "Read and understand the rental agreement thoroughly",
        "Ensure the property has proper safety equipment (fire extinguisher, first aid kit)"
      ]
    },
    {
      category: "During Your Stay",
      tips: [
        "Keep important documents and valuables in a secure place",
        "Be aware of emergency exits and evacuation procedures",
        "Maintain good relationships with fellow residents",
        "Report any safety concerns to the property owner immediately",
        "Keep emergency contact numbers readily accessible"
      ]
    },
    {
      category: "Personal Safety",
      tips: [
        "Share your location with trusted friends or family members",
        "Avoid sharing personal information with strangers",
        "Trust your instincts if something feels unsafe",
        "Keep your room locked even when you're inside the property",
        "Be cautious when using shared spaces during late hours"
      ]
    },
    {
      category: "Online Safety",
      tips: [
        "Never share your login credentials with anyone",
        "Be cautious of phishing emails or suspicious links",
        "Use secure payment methods only",
        "Report fake profiles or suspicious behavior",
        "Keep your personal information private on public platforms"
      ]
    }
  ];

  const emergencyContacts = [
    { service: "Police", number: "100" },
    { service: "Fire Department", number: "101" },
    { service: "Medical Emergency", number: "108" },
    { service: "Women's Helpline", number: "1091" },
    { service: "FindMyPG Support", number: "+91 98765 43210" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-cool relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fadeInUp">
            Your Safety is Our Priority
          </h1>
          <p className="text-xl text-white/90 mb-8 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            Learn about our safety measures and guidelines for a secure PG experience
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Safety Features */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-charcoal mb-4">
              Our Safety Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We've implemented comprehensive safety measures to ensure your security and peace of mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {safetyFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 animate-fadeInUp"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="w-12 h-12 bg-gradient-cool-light rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-charcoal mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Tips */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-charcoal mb-4">
              Safety Guidelines
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Follow these essential safety tips to ensure a secure and comfortable stay
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {safetyTips.map((section, index) => (
              <div
                key={index}
                className="gradient-border p-6 rounded-xl animate-fadeInUp"
                style={{animationDelay: `${index * 0.2}s`}}
              >
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <h3 className="text-xl font-semibold text-charcoal">
                    {section.category}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {section.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start">
                      <div className="w-2 h-2 bg-gradient-cool rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-charcoal mb-4">
              Emergency Contacts
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Keep these important numbers handy for any emergency situation
            </p>
          </div>

          <div className="bg-gradient-cool-light rounded-2xl p-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {emergencyContacts.map((contact, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center"
                >
                  <h4 className="font-semibold text-charcoal mb-2">
                    {contact.service}
                  </h4>
                  <p className="text-2xl font-bold text-gradient-cool">
                    {contact.number}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reporting Issues */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
          <div className="flex items-start">
            <AlertTriangle className="h-8 w-8 text-red-500 mr-4 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-red-800 mb-3">
                Report Safety Concerns
              </h3>
              <p className="text-red-700 mb-4">
                If you encounter any safety issues or concerns, please report them immediately. 
                Your safety is our top priority, and we take all reports seriously.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Badge className="bg-red-100 text-red-800 px-4 py-2">
                  24/7 Support: +91 98765 43210
                </Badge>
                <Badge className="bg-red-100 text-red-800 px-4 py-2">
                  Email: safety@findmypg.com
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyInformation;
