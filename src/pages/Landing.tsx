// pages/Landing.tsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  FaChartLine, 
  FaPiggyBank, 
  FaWallet, 
  FaShieldAlt, 
  FaArrowRight,
  FaCheck,
  FaRocket,
  FaCoins,
  FaCreditCard,
  FaChartPie,
  FaBell,
  FaTrophy,
  FaUsers,
  FaCheckCircle,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaStar
} from "react-icons/fa";

function Landing() {
  const [scrollY, setScrollY] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);
  const [coinPosition, setCoinPosition] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const [savingsGoal, setSavingsGoal] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  // Scroll tracking and parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Intersection Observer for scroll animations
      const elements = document.querySelectorAll('[data-animate]');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight * 0.8;
        if (isInView && !el.classList.contains('animated')) {
          el.classList.add('animated');
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mouse tracking for magnetic effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Typewriter effect for hero text
  useEffect(() => {
    const texts = ["Money Game", "Finances", "Future", "Wealth"];
    const currentText = texts[textIndex];
    
    if (displayText.length < currentText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(currentText.slice(0, displayText.length + 1));
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setDisplayText("");
        setTextIndex((prev) => (prev + 1) % texts.length);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [displayText, textIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
      setCoinPosition((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Animate numbers
  useEffect(() => {
    const incomeInterval = setInterval(() => {
      setMonthlyIncome(prev => prev < 5420 ? prev + 100 : 5420);
    }, 50);

    const expenseInterval = setInterval(() => {
      setMonthlyExpense(prev => prev < 3240 ? prev + 75 : 3240);
    }, 50);

    const savingsInterval = setInterval(() => {
      setSavingsGoal(prev => prev < 75 ? prev + 2 : 75);
    }, 100);

    return () => {
      clearInterval(incomeInterval);
      clearInterval(expenseInterval);
      clearInterval(savingsInterval);
    };
  }, []);

  const features = [
    {
      icon: <FaChartLine className="text-4xl" />,
      title: "Smart Analytics",
      description: "Track your income, expenses, and savings with real-time visual charts and insights",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FaPiggyBank className="text-4xl" />,
      title: "Savings Goals",
      description: "Set savings targets and watch your progress grow with our interactive savings tracker",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <FaWallet className="text-4xl" />,
      title: "Expense Management",
      description: "Categorize and monitor your daily expenses with custom categories and alerts",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <FaChartPie className="text-4xl" />,
      title: "Income Tracking",
      description: "Record all your income sources and visualize your earnings with detailed reports",
      color: "from-orange-500 to-red-500"
    }
  ];

  const stats = [
    { number: "10K+", label: "Happy Users", icon: <FaUsers /> },
    { number: "$5M+", label: "Money Tracked", icon: <FaCoins /> },
    { number: "4.9★", label: "User Rating", icon: <FaTrophy /> },
    { number: "24/7", label: "Support", icon: <FaBell /> }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm animate-fade-in">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
              <span className="text-white font-bold text-2xl animate-bounce" style={{ animationDuration: '2s' }}>💰</span>
            </div>
            <span className="text-2xl font-black text-gray-800">Finance Tracker</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-purple-600 font-semibold transition-all hover:scale-110">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-purple-600 font-semibold transition-all hover:scale-110">How It Works</a>
            <Link to="/login" className="text-gray-600 hover:text-purple-600 font-semibold transition-all hover:scale-110">Login</Link>
            <Link 
              to="/signup" 
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-2xl transition-all transform hover:scale-105 hover:from-purple-600 hover:to-pink-600"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated Background with Money-related elements */}
        <div className="absolute inset-0">
          {/* Floating coins */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${(i * 15) + 5}%`,
                top: `${(i % 3) * 25}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + (i % 3)}s`
              }}
            >
              <div className="text-4xl opacity-20 transform hover:scale-150 hover:opacity-40 transition-all duration-500">
                {i % 4 === 0 ? '💰' : i % 4 === 1 ? '💵' : i % 4 === 2 ? '💳' : '📊'}
              </div>
            </div>
          ))}
          
          {/* Gradient orbs */}
          <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slide-in-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-purple-700 font-bold text-sm animate-bounce border-2 border-purple-300">
                <FaRocket className="animate-pulse" />
                Track Income, Expenses & Savings in One Place
              </div>
              <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-tight">
                Master Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative inline-block">
                  <span className="animate-pulse">{displayText}</span>
                  <span className="animate-blink ml-1">|</span>
                </span>
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed font-medium">
                Take control of your finances with our powerful tracking system. Monitor income, manage expenses, and achieve your savings goals - all in one beautiful dashboard.
              </p>
              <div className="flex gap-4">
                <Link 
                  to="/signup"
                  className="relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all flex items-center gap-2 group overflow-hidden animate-pulse-glow"
                  style={{
                    animationDuration: '2s'
                  }}
                >
                  <span className="relative z-10">Start Tracking Free</span>
                  <FaArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform animate-bounce-x" />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-400 to-purple-400 blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                </Link>
                <button className="relative px-8 py-4 border-3 border-gray-300 text-gray-700 rounded-xl font-bold text-lg hover:border-purple-500 hover:text-purple-600 hover:shadow-lg transition-all transform hover:scale-105 group overflow-hidden">
                  <span className="relative z-10">View Demo</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-all"></div>
                </button>
              </div>
              <div className="flex items-center gap-8 text-sm text-gray-700 font-medium">
                <div className="flex items-center gap-2 animate-fade-in">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <FaCheck className="text-white text-xs" />
                  </div>
                  <span>Free Forever</span>
                </div>
                <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <FaCheck className="text-white text-xs" />
                  </div>
                  <span>No Credit Card</span>
                </div>
                <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <FaCheck className="text-white text-xs" />
                  </div>
                  <span>Secure & Private</span>
                </div>
              </div>
            </div>

            {/* Animated Finance Dashboard Preview */}
            <div className="relative animate-slide-in-right" ref={heroRef}>
              {/* Main Dashboard Card */}
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-purple-100 transform hover:scale-105 hover:rotate-1 transition-all duration-500 relative overflow-hidden group">
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                {/* Glow effect on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500"></div>
                
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <h3 className="font-black text-gray-800 text-xl">Your Dashboard</h3>
                  <div className="text-sm text-gray-500 font-semibold bg-purple-100 px-3 py-1 rounded-full">January 2026</div>
                </div>
                
                {/* Animated Income/Expense Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-5 rounded-2xl text-white animate-float shadow-xl hover:shadow-2xl transition-all cursor-pointer group/card relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                    <div className="flex items-center gap-2 text-sm opacity-90 mb-1 relative z-10">
                      <FaArrowRight className="rotate-[-45deg] animate-bounce" />
                      Income
                    </div>
                    <div className="text-3xl font-black relative z-10">${monthlyIncome.toLocaleString()}</div>
                    <div className="text-xs opacity-75 mt-1 relative z-10 flex items-center gap-1">
                      <FaStar className="text-yellow-300 animate-spin" style={{ animationDuration: '3s' }} />
                      +12% this month
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-red-500 to-pink-600 p-5 rounded-2xl text-white animate-float shadow-xl hover:shadow-2xl transition-all cursor-pointer group/card relative overflow-hidden" style={{ animationDelay: '0.3s' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-pink-500 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                    <div className="flex items-center gap-2 text-sm opacity-90 mb-1 relative z-10">
                      <FaArrowRight className="rotate-[45deg] animate-bounce" />
                      Expenses
                    </div>
                    <div className="text-3xl font-black relative z-10">${monthlyExpense.toLocaleString()}</div>
                    <div className="text-xs opacity-75 mt-1 relative z-10">-8% from last month</div>
                  </div>
                </div>

                {/* Savings Progress */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-2xl mb-4 border-2 border-purple-200 relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FaPiggyBank className="text-purple-600 text-xl" />
                      <span className="font-bold text-gray-800">Savings Goal</span>
                    </div>
                    <span className="text-2xl font-black text-purple-600">{savingsGoal}%</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-4 overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                      style={{ width: `${savingsGoal}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mt-2 font-medium">$7,500 of $10,000</div>
                </div>

                {/* Recent Transactions */}
                <div className="space-y-2 relative z-10">
                  <div className="text-sm font-bold text-gray-700 mb-3">Recent Activity</div>
                  {[
                    { icon: '🛒', name: 'Groceries', amount: '-$45', color: 'text-red-600' },
                    { icon: '💼', name: 'Salary', amount: '+$2,500', color: 'text-green-600' },
                    { icon: '☕', name: 'Coffee', amount: '-$5', color: 'text-red-600' }
                  ].map((transaction, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all animate-slide-in-left"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow">
                          {transaction.icon}
                        </div>
                        <span className="font-semibold text-gray-800">{transaction.name}</span>
                      </div>
                      <span className={`font-bold ${transaction.color}`}>{transaction.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating notification */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-2xl p-4 border-2 border-green-200 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                    <FaCheck className="text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 text-sm">Savings Goal Hit!</div>
                    <div className="text-xs text-gray-600">You saved $500 this month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${i * 20}%`,
                top: `${(i % 2) * 50}%`,
                animationDelay: `${i * 0.5}s`,
                fontSize: '60px'
              }}
            >
              {i % 3 === 0 ? '💰' : i % 3 === 1 ? '📈' : '🎯'}
            </div>
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center text-white transform hover:scale-110 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-center mb-3 text-5xl animate-bounce" style={{ animationDuration: '3s', animationDelay: `${index * 0.2}s` }}>
                  {stat.icon}
                </div>
                <div className="text-5xl font-black mb-2">{stat.number}</div>
                <div className="text-purple-100 font-semibold text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-9xl">💳</div>
          <div className="absolute bottom-10 right-10 text-9xl">📊</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl">💎</div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Everything You Need in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                One Place
              </span>
            </h2>
            <p className="text-2xl text-gray-600 font-medium max-w-3xl mx-auto">
              Manage your income, track expenses, and grow your savings with powerful tools
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`group p-8 rounded-3xl transition-all duration-500 cursor-pointer transform hover:scale-110 animate-scale-in ${
                  activeFeature === index 
                    ? "bg-white shadow-2xl border-2 border-purple-200" 
                    : "bg-gray-50 hover:shadow-xl"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={`inline-flex p-5 rounded-2xl mb-6 transition-all duration-500 ${
                  activeFeature === index 
                    ? `bg-gradient-to-r ${feature.color} text-white shadow-xl scale-110 animate-glow` 
                    : "bg-white text-purple-600 group-hover:scale-105"
                }`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed font-medium">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-purple-50 to-pink-50 relative overflow-hidden">
        {/* Animated coins */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float opacity-10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.7}s`,
                fontSize: `${30 + Math.random() * 40}px`
              }}
            >
              💰
            </div>
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              How It{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Works
              </span>
            </h2>
            <p className="text-2xl text-gray-700 font-medium">Simple steps to financial freedom</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/4 left-0 right-0 h-1 bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300"></div>
            
            {[
              {
                step: '01',
                icon: '📝',
                title: 'Sign Up Free',
                description: 'Create your account in seconds - no credit card required'
              },
              {
                step: '02',
                icon: '💵',
                title: 'Track Your Money',
                description: 'Add your income, expenses, and savings goals'
              },
              {
                step: '03',
                icon: '📊',
                title: 'Watch it Grow',
                description: 'Get insights and watch your savings increase'
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-scale-in border-2 border-purple-100"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-black text-xl shadow-xl animate-bounce" style={{ animationDuration: '3s', animationDelay: `${index * 0.3}s` }}>
                  {item.step}
                </div>
                <div className="text-7xl text-center mb-6 mt-6 animate-float" style={{ animationDelay: `${index * 0.5}s` }}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4 text-center">{item.title}</h3>
                <p className="text-gray-600 text-center leading-relaxed font-medium">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Link 
              to="/signup"
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-black text-xl hover:shadow-2xl transform hover:scale-110 transition-all group relative overflow-hidden"
            >
              <span className="relative z-10">Start Your Journey Now</span>
              <FaRocket className="relative z-10 group-hover:translate-x-2 transition-transform text-2xl" />
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300 rounded-full filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Simple,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
                Transparent
              </span>{" "}
              Pricing
            </h2>
            <p className="text-2xl text-gray-600 font-medium">Choose the plan that fits your needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index}
                className={`relative rounded-3xl p-8 transition-all duration-500 transform hover:scale-105 animate-scale-in ${
                  plan.popular 
                    ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl -mt-4 mb-4 border-4 border-white" 
                    : "bg-white shadow-xl hover:shadow-2xl border-2 border-gray-100"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-black shadow-xl animate-bounce flex items-center gap-2">
                      <FaTrophy className="text-lg" /> MOST POPULAR
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`inline-flex p-4 rounded-2xl mb-4 ${
                    plan.popular 
                      ? "bg-white/20 backdrop-blur-sm" 
                      : "bg-gradient-to-r from-indigo-100 to-purple-100"
                  }`}>
                    <span className={`text-5xl ${plan.popular ? "" : "filter grayscale"}`}>
                      {index === 0 ? '🎯' : index === 1 ? '💎' : '🚀'}
                    </span>
                  </div>
                  <h3 className={`text-3xl font-black mb-2 ${plan.popular ? "" : "text-gray-900"}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className={`text-5xl font-black ${plan.popular ? "" : "text-gray-900"}`}>
                      ${plan.price}
                    </span>
                    <span className={`text-lg ${plan.popular ? "text-purple-100" : "text-gray-500"}`}>
                      /month
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3">
                      <FaCheckCircle className={`text-xl flex-shrink-0 mt-1 ${
                        plan.popular ? "text-green-300" : "text-green-500"
                      }`} />
                      <span className={`leading-relaxed font-medium ${
                        plan.popular ? "" : "text-gray-700"
                      }`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/signup"
                  className={`block w-full py-4 rounded-2xl font-black text-center transition-all duration-300 transform hover:scale-105 ${
                    plan.popular
                      ? "bg-white text-purple-600 hover:shadow-xl"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl"
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
      <section className="py-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Animated money rain */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float opacity-30"
              style={{
                left: `${i * 5}%`,
                top: `${-20 + (i % 3) * 30}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${3 + (i % 3)}s`,
                fontSize: `${20 + (i % 3) * 15}px`
              }}
            >
              {i % 4 === 0 ? '💰' : i % 4 === 1 ? '💵' : i % 4 === 2 ? '💳' : '📊'}
            </div>
          ))}
        </div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="animate-scale-in">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Ready to Master Your Money?
            </h2>
            <p className="text-2xl text-purple-100 mb-10 font-medium">
              Join thousands of users already managing their finances smarter
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-3 px-12 py-6 bg-white text-purple-600 rounded-2xl font-black text-2xl hover:shadow-2xl transform hover:scale-110 transition-all group relative overflow-hidden"
            >
              <span className="relative z-10">Start Free Today</span>
              <FaRocket className="relative z-10 text-3xl group-hover:translate-x-2 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
            <p className="mt-6 text-purple-100 text-lg font-medium">
              No credit card required • Free forever plan available
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute text-6xl"
              style={{
                left: `${i * 15}%`,
                top: `${(i % 2) * 50}%`
              }}
            >
              💎
            </div>
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-4xl animate-bounce" style={{ animationDuration: '2s' }}>💰</div>
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
                  Finance Tracker
                </span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed mb-6 font-medium">
                Your all-in-one solution for managing income, tracking expenses, and achieving your savings goals. Take control of your financial future today.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: <FaFacebook />, color: 'from-blue-500 to-blue-600' },
                  { icon: <FaTwitter />, color: 'from-cyan-400 to-blue-500' },
                  { icon: <FaInstagram />, color: 'from-pink-500 to-purple-600' },
                  { icon: <FaLinkedin />, color: 'from-blue-600 to-blue-700' }
                ].map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${social.color} flex items-center justify-center text-white text-xl hover:scale-110 transform transition-all shadow-lg hover:shadow-xl`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {['Features', 'Pricing', 'How It Works', 'About Us'].map((link, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors font-medium flex items-center gap-2 group">
                      <span className="w-0 h-0.5 bg-purple-500 group-hover:w-3 transition-all"></span>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Support
              </h4>
              <ul className="space-y-3">
                {['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map((link, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors font-medium flex items-center gap-2 group">
                      <span className="w-0 h-0.5 bg-pink-500 group-hover:w-3 transition-all"></span>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 font-medium">
                © 2024 Finance Tracker. All rights reserved.
              </p>
              <div className="flex items-center gap-2 text-gray-400 font-medium">
                <span>Made with</span>
                <span className="text-red-500 text-xl animate-pulse">❤️</span>
                <span>for your financial success</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
