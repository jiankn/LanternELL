'use client'

import { useState } from 'react'
import { 
  BookOpen, 
  Users, 
  Download, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  GraduationCap,
  Globe,
  Heart,
  ChevronDown,
  ChevronUp,
  Mail
} from 'lucide-react'

// Course catalog data
const courses = [
  {
    id: 1,
    title: 'Newcomer Survival Pack',
    description: 'Essential vocabulary and phrases for first-week ELL students',
    price: '$9.99',
    badge: 'Bestseller',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'bg-amber-100'
  },
  {
    id: 2,
    title: 'Classroom Labels EN-ES',
    description: 'Bilingual labels for everything in your classroom',
    price: '$5.99',
    badge: 'Popular',
    icon: <Globe className="w-6 h-6" />,
    color: 'bg-emerald-100'
  },
  {
    id: 3,
    title: 'Vocabulary Builder K-2',
    description: 'Picture word cards with tracing and matching activities',
    price: '$7.99',
    badge: null,
    icon: <BookOpen className="w-6 h-6" />,
    color: 'bg-blue-100'
  },
  {
    id: 4,
    title: 'Parent Communication',
    description: 'Bilingual notes for home-school communication',
    price: '$4.99',
    badge: 'New',
    icon: <Heart className="w-6 h-6" />,
    color: 'bg-rose-100'
  }
]

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: 'Sarah M.',
    role: '2nd Grade ESL Teacher',
    avatar: 'SM',
    content: 'These packs saved me hours of prep time! My newcomer students love the visual supports.',
    rating: 5
  },
  {
    id: 2,
    name: 'Miguel R.',
    role: 'Dual Language Kindergarten',
    avatar: 'MR',
    content: 'The classroom labels are a game-changer. My students are learning both languages naturally.',
    rating: 5
  },
  {
    id: 3,
    name: 'Jennifer L.',
    role: 'Newcomer Support Specialist',
    avatar: 'JL',
    content: 'Finally, resources that actually work for ELL students. Worth every penny!',
    rating: 5
  }
]

// Stats data
const stats = [
  { value: '50+', label: 'Printable Packs' },
  { value: '10K+', label: 'Teachers Served' },
  { value: '4.9', label: 'Average Rating' },
  { value: 'Free', label: 'Sample Downloads' }
]

// FAQ data
const faqs = [
  {
    question: 'What grade levels are these resources for?',
    answer: 'Our printable packs are designed primarily for K-2 ELL and newcomer students, with some resources extending to grade 3.'
  },
  {
    question: 'What file formats do you offer?',
    answer: 'All resources are delivered as PDF files, formatted for US Letter (8.5" x 11") and ready to print.'
  },
  {
    question: 'Can I use these in my classroom?',
    answer: 'Yes! Single-teacher licenses allow use in one classroom. School-wide licenses are also available.'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes, we offer a 30-day money-back guarantee if you\'re not satisfied with your purchase.'
  }
]

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [email, setEmail] = useState('')

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Thanks for subscribing with: ${email}`)
    setEmail('')
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-clay-sm">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="font-heading text-xl font-bold text-text-primary">LanternELL</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#courses" className="text-text-primary hover:text-primary transition-colors cursor-pointer">Packs</a>
              <a href="#testimonials" className="text-text-primary hover:text-primary transition-colors cursor-pointer">Reviews</a>
              <a href="#pricing" className="text-text-primary hover:text-primary transition-colors cursor-pointer">Pricing</a>
              <button className="clay-button text-sm">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-clay-sm mb-8">
              <Sparkles className="w-4 h-4 text-cta" />
              <span className="text-sm font-medium text-text-primary">Trusted by 10,000+ Teachers</span>
            </div>
            
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight">
              Print-Ready Bilingual & ELL<br />
              <span className="text-gradient">Resources for Real Classrooms</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-text-primary/80 max-w-2xl mx-auto mb-10">
              Save hours of prep time with ready-to-print teaching packs designed for K-2 ELL and newcomer students. 
              Just print and use today.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button className="clay-button-cta text-lg flex items-center gap-2 cursor-pointer">
                <Download className="w-5 h-5" />
                Get Free Samples
              </button>
              <button className="clay-button text-lg flex items-center gap-2 cursor-pointer">
                View All Packs
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="clay-card-sm p-4">
                  <div className="font-heading text-2xl sm:text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-text-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Course Catalog Preview */}
      <section id="courses" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Popular Teaching Packs
            </h2>
            <p className="text-lg text-text-primary/70 max-w-2xl mx-auto">
              Ready-to-use printable resources for your classroom
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="clay-card p-6 hover:scale-[1.02] transition-transform duration-200 cursor-pointer group">
                <div className={`w-12 h-12 ${course.color} rounded-xl flex items-center justify-center mb-4 text-primary`}>
                  {course.icon}
                </div>
                
                {course.badge && (
                  <span className="inline-block px-3 py-1 bg-cta/10 text-cta text-xs font-semibold rounded-full mb-3">
                    {course.badge}
                  </span>
                )}
                
                <h3 className="font-heading text-lg font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                
                <p className="text-sm text-text-primary/70 mb-4">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="font-heading text-xl font-bold text-primary">{course.price}</span>
                  <span className="text-sm text-cta font-medium flex items-center gap-1 cursor-pointer group-hover:gap-2 transition-all">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button className="clay-button cursor-pointer">
              Browse All Packs <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Progress Tracking Demo */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                Track Student Progress with Confidence
              </h2>
              <p className="text-lg text-text-primary/70 mb-8">
                Our printable packs include built-in progress tracking tools. Monitor vocabulary mastery, 
                reading fluency, and classroom participation.
              </p>
              
              <div className="space-y-4">
                {[
                  'Vocabulary checklists for each pack',
                  'Student self-assessment cards',
                  'Teacher observation guides',
                  'Progress report templates'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-text-primary">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Progress Card 1 */}
              <div className="clay-card-sm p-6 text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#EEF2FF"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#4F46E5"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray="251.2"
                      strokeDashoffset="62.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-heading text-2xl font-bold text-primary">75%</span>
                  </div>
                </div>
                <p className="text-sm font-medium text-text-primary">Vocabulary Mastered</p>
              </div>

              {/* Progress Card 2 */}
              <div className="clay-card-sm p-6 text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#EEF2FF"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#F97316"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray="251.2"
                      strokeDashoffset="100.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-heading text-2xl font-bold text-cta">60%</span>
                  </div>
                </div>
                <p className="text-sm font-medium text-text-primary">Reading Fluency</p>
              </div>

              {/* Progress Card 3 */}
              <div className="clay-card-sm p-6 text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#EEF2FF"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#10B981"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray="251.2"
                      strokeDashoffset="25.1"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-heading text-2xl font-bold text-green-500">90%</span>
                  </div>
                </div>
                <p className="text-sm font-medium text-text-primary">Class Participation</p>
              </div>

              {/* Progress Card 4 */}
              <div className="clay-card-sm p-6 text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#EEF2FF"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#8B5CF6"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray="251.2"
                      strokeDashoffset="75.4"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-heading text-2xl font-bold text-purple-500">70%</span>
                  </div>
                </div>
                <p className="text-sm font-medium text-text-primary">Writing Skills</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Loved by Teachers Everywhere
            </h2>
            <p className="text-lg text-text-primary/70">
              Join thousands of educators who trust LanternELL
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="clay-card p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-cta text-cta" />
                  ))}
                </div>
                
                <p className="text-text-primary mb-6 italic">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">{testimonial.name}</p>
                    <p className="text-sm text-text-muted">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="clay-card p-8 sm:p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-cta to-[#ea580c] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-clay-button">
              <Download className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Start Saving Time Today
            </h2>
            
            <p className="text-lg text-text-primary/70 mb-8 max-w-xl mx-auto">
              Get instant access to our complete library of printable teaching packs. 
              New resources added weekly!
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <button className="clay-button-cta text-lg cursor-pointer">
                Get All Access - $19/mo
              </button>
              <button className="clay-button text-lg cursor-pointer">
                View Pricing Options
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-text-muted">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" /> 30-Day Guarantee
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" /> Cancel Anytime
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" /> Instant Download
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="clay-card-sm overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
                >
                  <span className="font-semibold text-text-primary pr-4">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-text-muted flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-text-muted flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-text-primary/70">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="clay-card p-8 sm:p-10">
            <Mail className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary mb-4">
              Get Free Sample Packs
            </h2>
            <p className="text-text-primary/70 mb-6">
              Subscribe to get 3 free printable packs and be the first to know about new resources.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="clay-input flex-1"
              />
              <button type="submit" className="clay-button-cta cursor-pointer whitespace-nowrap">
                Get Free Samples
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 border-t border-white/40 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-clay-sm">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="font-heading text-xl font-bold text-text-primary">LanternELL</span>
              </div>
              <p className="text-sm text-text-primary/70">
                Print-ready bilingual & ELL resources for real classrooms.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-text-primary mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-text-primary/70">
                <li><a href="#" className="hover:text-primary transition-colors cursor-pointer">All Packs</a></li>
                <li><a href="#" className="hover:text-primary transition-colors cursor-pointer">Free Samples</a></li>
                <li><a href="#" className="hover:text-primary transition-colors cursor-pointer">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-text-primary mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-text-primary/70">
                <li><a href="#" className="hover:text-primary transition-colors cursor-pointer">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors cursor-pointer">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors cursor-pointer">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-text-primary mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-text-primary/70">
                <li><a href="#" className="hover:text-primary transition-colors cursor-pointer">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors cursor-pointer">Terms of Use</a></li>
                <li><a href="#" className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-text-primary/10 text-center text-sm text-text-muted">
            © 2026 LanternELL. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  )
}
