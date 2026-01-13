// pages/Landing.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaChartLine, 
  FaPiggyBank, 
  FaWallet, 
  FaShieldAlt, 
  FaArrowRight,
  FaCheck,
  FaRocket
} from "react-icons/fa";

function Landing() {
  const [scrollY, setScrollY] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <FaChartLine className="text-4xl" />,
      title: "Smart Analytics",
      description: "Get detailed insights into your spending patterns with AI-powered analytics"
    },
    {
      icon: <FaPiggyBank className="text-4xl" />,
      title: "Savings Goals",
      description: "Set and track your savings goals with intelligent recommendations"
    },
    {
      icon: <FaWallet className="text-4xl" />,
      title: "Budget Management",
      description: "Create custom budgets and get alerts when you're approaching limits"
    },
    {
      icon: <FaShieldAlt className="text-4xl" />,
      title: "Secure & Private",
      description: "Bank-level security with end-to-end encryption for your data"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Users" },
    { number: "$2M+", label: "Money Saved" },
    { number: "4.9★", label: "User Rating" },
    { number: "99.9%", label: "Uptime" }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      features: [
        "Basic expense tracking",
        "Up to 100 transactions/month",
        "Simple reports",
        "Mobile app access"
      ]
    },
    {
      name: "Pro",
      price: "$9.99",
      popular: true,
      features: [
        "Unlimited transactions",
        "Advanced analytics",
        "Bill reminders",
        "Export reports",
        "Priority support",
        "Custom categories"
      ]
    },
    {
      name: "Business",
      price: "$29.99",
      features: [
        "Everything in Pro",
        "Multi-user accounts",
        "Team collaboration",
        "API access",
        "Dedicated support",
        "Custom integrations"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">FT</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Finance Tracker</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
            <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
            <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors">Login</Link>
            <Link 
              to="/signup" 
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          <div 
            className="absolute top-20 right-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
            style={{ animationDelay: "0s" }}
          ></div>
          <div 
            className="absolute top-40 left-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
            style={{ animationDelay: "2s" }}
          ></div>
          <div 
            className="absolute bottom-20 left-1/2 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 bg-blue-100 rounded-full text-blue-600 font-semibold text-sm">
                🎉 Now with AI-powered insights
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Take Control of Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Financial Future
                </span>
              </h1>
              <p className="text-xl text-gray-600">
                Track expenses, set budgets, and achieve your savings goals with our intelligent finance management platform.
              </p>
              <div className="flex gap-4">
                <Link 
                  to="/signup"
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
                >
                  Start Free Trial <FaArrowRight />
                </Link>
                <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition-colors">
                  Watch Demo
                </button>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FaCheck className="text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheck className="text-green-500" />
                  <span>14-day free trial</span>
                </div>
              </div>
            </div>

            {/* Animated Finance Dashboard Preview */}
            <div className="relative">
              <div 
                className="bg-white rounded-2xl shadow-2xl p-8 transform transition-transform"
                style={{ transform: `translateY(${scrollY * -0.1}px)` }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-800">Monthly Overview</h3>
                  <div className="text-sm text-gray-500">January 2026</div>
                </div>
                
                {/* Animated Chart */}
                <div className="space-y-4">
                  {[
                    { label: "Income", value: 75, color: "bg-green-500" },
                    { label: "Expenses", value: 45, color: "bg-red-500" },
                    { label: "Savings", value: 30, color: "bg-blue-500" }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.label}</span>
                        <span className="font-semibold">{item.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                          style={{ 
                            width: `${item.value}%`,
                            animation: `slideIn 1s ease-out ${index * 0.2}s forwards`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Floating cards */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg text-white animate-float">
                    <div className="text-sm opacity-90">Total Balance</div>
                    <div className="text-2xl font-bold mt-1">$12,580</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-lg text-white animate-float" style={{ animationDelay: "0.5s" }}>
                    <div className="text-sm opacity-90">This Month</div>
                    <div className="text-2xl font-bold mt-1">+$1,230</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Your Money
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features to help you take control of your finances
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`p-6 rounded-xl transition-all duration-300 cursor-pointer ${
                  activeFeature === index 
                    ? "bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg scale-105" 
                    : "bg-gray-50 hover:shadow-md"
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={`inline-flex p-4 rounded-lg mb-4 ${
                  activeFeature === index 
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white" 
                    : "bg-white text-blue-600"
                }`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that's right for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index}
                className={`relative rounded-2xl p-8 ${
                  plan.popular 
                    ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-2xl scale-105" 
                    : "bg-white shadow-lg"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-yellow-400 text-gray-900 text-sm font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? "" : "text-gray-900"}`}>
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className={plan.popular ? "text-blue-100" : "text-gray-500"}>/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <FaCheck className={`mt-1 ${plan.popular ? "text-green-300" : "text-green-500"}`} />
                      <span className={plan.popular ? "text-blue-50" : "text-gray-600"}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className={`block w-full py-3 rounded-lg font-semibold text-center transition-all ${
                    plan.popular 
                      ? "bg-white text-blue-600 hover:shadow-xl" 
                      : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-xl"
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <FaRocket className="text-6xl mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Financial Life?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who are already in control of their finances
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all"
          >
            Start Your Free Trial <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">FT</span>
                </div>
                <span className="text-xl font-bold">Finance Tracker</span>
              </div>
              <p className="text-gray-400">
                Your trusted partner in financial success.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2026 Finance Tracker. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes slideIn {
          from { width: 0%; }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default Landing;
