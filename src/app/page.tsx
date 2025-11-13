'use client';

import { useState } from 'react';
import { ChevronDown, Phone, Mail, MapPin, Star, Users, BookOpen, Award } from 'lucide-react';

export default function Home() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    course: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitMessage('Thank you for your interest! We\'ll contact you soon.');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          course: '',
          message: ''
        });
        // Redirect to thanks page after 2 seconds
        setTimeout(() => {
          window.location.href = '/thanks';
        }, 2000);
      } else {
        setSubmitMessage('Something went wrong. Please try again.');
      }
    } catch (error) {
      setSubmitMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-600">Admissions</div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#courses" className="text-gray-700 hover:text-blue-600 transition-colors">Courses</a>
              <a href="#why-us" className="text-gray-700 hover:text-blue-600 transition-colors">Why Us</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
              <a href="/crm" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Admin Login</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Transform Your Future with Quality Education
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of students who have shaped their careers through our comprehensive programs and expert faculty.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#contact" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center">
                  Apply Now
                </a>
                <a href="#courses" className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors text-center">
                  View Courses
                </a>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Get Started Today</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <input
                     type="text"
                     name="firstName"
                     placeholder="First Name"
                     required
                     value={formData.firstName}
                     onChange={handleInputChange}
                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                   />
                   <input
                     type="text"
                     name="lastName"
                     placeholder="Last Name"
                     value={formData.lastName}
                     onChange={handleInputChange}
                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                   />
                 </div>
                 <input
                   type="email"
                   name="email"
                   placeholder="Email Address"
                   required
                   value={formData.email}
                   onChange={handleInputChange}
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                 />
                 <input
                   type="tel"
                   name="phone"
                   placeholder="Phone Number"
                   required
                   value={formData.phone}
                   onChange={handleInputChange}
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                 />
                 <select
                   name="course"
                   value={formData.course}
                   onChange={handleInputChange}
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                 >
                   <option value="">Select Course</option>
                   <option value="computer-science">Computer Science</option>
                   <option value="business-administration">Business Administration</option>
                   <option value="engineering">Engineering</option>
                   <option value="arts">Arts & Humanities</option>
                   <option value="health-sciences">Health Sciences</option>
                 </select>
                 <textarea
                   name="message"
                   placeholder="Tell us about your goals..."
                   rows={3}
                   value={formData.message}
                   onChange={handleInputChange}
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                 />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
                {submitMessage && (
                  <div className={`text-center p-3 rounded-lg ${submitMessage.includes('Thank') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {submitMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Programs</h2>
            <p className="text-xl text-gray-600">Choose from our wide range of industry-relevant courses</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Computer Science",
                description: "Master programming, algorithms, and software development with industry experts.",
                icon: <BookOpen className="w-8 h-8" />,
                features: ["Programming Fundamentals", "Data Structures", "Web Development", "AI & Machine Learning"]
              },
              {
                title: "Business Administration",
                description: "Develop leadership skills and business acumen for the modern corporate world.",
                icon: <Users className="w-8 h-8" />,
                features: ["Management Principles", "Marketing Strategy", "Financial Analysis", "Leadership"]
              },
              {
                title: "Engineering",
                description: "Build a strong foundation in engineering principles and practical applications.",
                icon: <Award className="w-8 h-8" />,
                features: ["Mathematics & Physics", "Design Principles", "Project Management", "Innovation"]
              }
            ].map((course, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-blue-600 mb-4">{course.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <ul className="space-y-2 mb-6">
                  {course.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-400 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why-us" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
            <p className="text-xl text-gray-600">We are committed to your success</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Users className="w-12 h-12 text-blue-600" />,
                title: "Expert Faculty",
                description: "Learn from industry professionals with years of experience"
              },
              {
                icon: <Award className="w-12 h-12 text-blue-600" />,
                title: "Industry Recognition",
                description: "Our programs are recognized by top employers worldwide"
              },
              {
                icon: <BookOpen className="w-12 h-12 text-blue-600" />,
                title: "Practical Learning",
                description: "Hands-on projects and real-world applications"
              },
              {
                icon: <Star className="w-12 h-12 text-blue-600" />,
                title: "Career Support",
                description: "Comprehensive placement assistance and career guidance"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Get answers to common questions</p>
          </div>
          <div className="space-y-6">
            {[
              {
                question: "How do I apply?",
                answer: "Simply fill out the application form on this page with your details and our admissions team will contact you within 24 hours."
              },
              {
                question: "What documents are required?",
                answer: "You'll need your academic transcripts, ID proof, and any relevant certificates. Our team will guide you through the complete process."
              },
              {
                question: "Are there scholarships available?",
                answer: "Yes, we offer various scholarships based on merit and need. Contact our admissions team to learn more about eligibility criteria."
              },
              {
                question: "What is the admission timeline?",
                answer: "Applications are reviewed on a rolling basis. We recommend applying early to secure your spot in your preferred program."
              }
            ].map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Get in Touch</h2>
              <p className="text-xl text-gray-300 mb-8">
                Have questions? Our admissions team is here to help you every step of the way.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="w-6 h-6 text-blue-400 mr-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-6 h-6 text-blue-400 mr-4" />
                  <span>admissions@university.edu</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-6 h-6 text-blue-400 mr-4" />
                  <span>123 University Ave, Education City, EC 12345</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Application</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="">Select Course</option>
                  <option value="computer-science">Computer Science</option>
                  <option value="business-administration">Business Administration</option>
                  <option value="engineering">Engineering</option>
                  <option value="arts">Arts & Humanities</option>
                  <option value="health-sciences">Health Sciences</option>
                </select>
                <textarea
                  name="message"
                  placeholder="Tell us about your goals..."
                  rows={3}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
                {submitMessage && (
                  <div className={`text-center p-3 rounded-lg ${submitMessage.includes('Thank') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {submitMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">&copy; 2024 Admissions University. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}