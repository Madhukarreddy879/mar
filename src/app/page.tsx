'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        body: JSON.stringify({
          firstName: formData.name.split(' ')[0],
          lastName: formData.name.split(' ').slice(1).join(' '),
          email: formData.email,
          phone: formData.phone,
          course: formData.course || 'b-tech',
          message: ''
        }),
      });

      if (response.ok) {
        setSubmitMessage('Thank you for your interest! We\'ll contact you soon.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          course: ''
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

  const handleCourseClick = (courseName: string) => {
    setFormData(prev => ({
      ...prev,
      course: courseName
    }));
    // Scroll to form
    const formElement = document.getElementById('apply-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Section */}
      <section className="bg-gray-100 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            {/* Left Side - Logo and Content */}
            <div className="flex flex-col items-center lg:items-start">
              {/* Logo and NIRF Badge */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 mb-8 sm:mb-12 flex-wrap">
                <div className="flex-shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Marwadi University"
                    width={200}
                    height={200}
                    className="h-auto w-auto sm:w-48 md:w-64 lg:w-96"
                  />
                </div>
                <div className="flex-shrink-0">
                  <Image
                    src="/nirf.png"
                    alt="NIRF Logo"
                    width={80}
                    height={100}
                    className="h-auto w-auto sm:w-20 md:w-24"
                  />
                </div>
                <div className="flex-shrink-0">
                  <Image
                    src="/qs-asia-rank.jpg"
                    alt="QS Asia Rank"
                    width={100}
                    height={120}
                    className="h-auto w-auto sm:w-24 md:w-32"
                  />
                </div>
              </div>

              {/* Main Heading */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-4">
                B.tech Admissions Open
              </h2>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl md:text-2xl text-teal-600 font-semibold mb-4 sm:mb-6">
                For Academic Year 2025-26
              </p>

              {/* Office Details */}
              <div className="bg-gradient-to-br from-white to-gray-50 p-4 sm:p-6 rounded-xl shadow-lg mb-6 sm:mb-8 border-l-4 border-teal-500 w-full sm:w-auto">
                <p className="text-base sm:text-lg text-gray-800 font-bold mb-3">
                   Telangana Zonal Office at<br />
                   <span className="text-teal-600">Warangal, Karimnagar, Asifabad, Mancherial</span>
                </p>
                <p className="text-sm sm:text-base text-gray-700 font-semibold mb-2">
                   Contact @{' '}
                   <span className="bg-teal-100 text-teal-700 px-2 sm:px-3 py-1 rounded-full font-bold text-sm sm:text-lg">
                     Dr. P. Nithin Rao
                   </span>
                </p>
                <p className="text-lg sm:text-xl font-bold text-teal-600">
                  📞 9908432153
                </p>
              </div>

              {/* Placement Badge */}
              <div className="mb-6 sm:mb-8">
                <div className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white px-6 sm:px-10 py-3 sm:py-5 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-block border border-red-400/30">
                  <div className="text-4xl sm:text-5xl font-black">100%</div>
                  <div className="text-lg sm:text-xl font-bold tracking-wider mt-1">PLACEMENTS</div>
                </div>
              </div>
            </div>

            {/* Right Side - Apply Now Form */}
            <div id="apply-form" className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Apply Now</h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm">(Field marked with * are mandatory)</p>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name*"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email*"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                  />
                </div>

                <div>
                   <input
                     type="tel"
                     name="phone"
                     placeholder="Enter Your Phone Number*"
                     required
                     value={formData.phone}
                     onChange={handleInputChange}
                     className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                   />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-teal-500 text-white py-2 sm:py-3 rounded font-semibold hover:bg-teal-600 transition-colors disabled:bg-gray-400 text-sm sm:text-base"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>

                {submitMessage && (
                  <div className={`text-center p-3 rounded-lg text-sm ${submitMessage.includes('Thank') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {submitMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Rankings & Accreditations Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Main Heading and Ranking */}
            <div>
              <h2 className="text-5xl md:text-6xl font-bold text-teal-600 mb-2 leading-tight">
                Among the Top
              </h2>
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-8xl font-black text-teal-600">150</span>
                <div>
                  <h3 className="text-4xl font-bold text-teal-600">Universities</h3>
                  <p className="text-3xl font-bold text-teal-600">of India</p>
                </div>
              </div>
              <div className="mt-8">
                <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>

            {/* Right Side - NIRF Logo and Badges */}
            <div className="space-y-12">
              {/* NIRF Logo */}
              <div className="flex justify-center lg:justify-end">
                <div className="text-center">
                  <div className="text-5xl font-black text-red-600 mb-1" style={{ letterSpacing: '0.05em' }}>nirf</div>
                  <p className="text-xs text-gray-600 font-bold tracking-wider">NATIONAL INSTITUTIONAL RANKING FRAMEWORK</p>
                </div>
              </div>

              {/* Ranking Badges */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 p-6 rounded-xl text-center border-2 border-yellow-300 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="text-sm font-bold text-red-600 mb-2 tracking-wider">ALL INDIA TOP</div>
                  <div className="text-3xl font-black text-red-600 mb-2">100-125</div>
                  <div className="text-xs font-bold text-gray-700 uppercase tracking-wide">Pharmacy Colleges</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 p-6 rounded-xl text-center border-2 border-yellow-300 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="text-sm font-bold text-red-600 mb-2 tracking-wider">ALL INDIA TOP</div>
                  <div className="text-3xl font-black text-red-600 mb-2">200-300</div>
                  <div className="text-xs font-bold text-gray-700 uppercase tracking-wide">Engineering Colleges</div>
                </div>
              </div>

              {/* Accreditation Shields */}
              <div className="flex justify-center lg:justify-end gap-6 mt-8">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg shadow-lg flex items-center justify-center mb-3 hover:shadow-xl transition-shadow transform hover:scale-105" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)' }}>
                    <div className="font-black text-3xl">A+</div>
                  </div>
                  <div className="text-xs font-bold text-gray-700">NAAC<br />Accreditation</div>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg shadow-lg flex items-center justify-center mb-3 hover:shadow-xl transition-shadow transform hover:scale-105" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)' }}>
                    <div className="font-black text-xl">CoE</div>
                  </div>
                  <div className="text-xs font-bold text-gray-700">Centre of<br />Excellence</div>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg shadow-lg flex items-center justify-center mb-3 hover:shadow-xl transition-shadow transform hover:scale-105" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)' }}>
                    <div className="font-black text-xl">NBA</div>
                  </div>
                  <div className="text-xs font-bold text-gray-700">TIER - 1<br />Accreditation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            {[
              {
                number: "1700+",
                description: "International students from 53 countries"
              },
              {
                number: "50+",
                description: "Highly qualified faculty from 22 states of India"
              },
              {
                number: "12,000+",
                description: "Students on campus pursuing the career of their choice with personalised education"
              },
              {
                number: "450+Companies",
                description: "Visited Marwadi University for on-campus placement offering highest package of 34 LPA"
              },
              {
                number: "38+Labs",
                description: "Labs Modern Research Labs that include 8 Industry Labs like Wipro, Bosch, Google, CAD/CAM, Smart Foundry, Jyoti CNC, and MUJCAL"
              },
              {
                number: "40+",
                description: "Affiliations and MOUs for student exchange programmes with foreign universities in USA, Germany, Poland and others."
              }
            ].map((stat, index) => (
              <div key={index} className="bg-white border-t-4 border-teal-500 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-2xl font-bold text-teal-600 mb-2">
                  {stat.number}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
            Courses to pick from
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "👔",
                title: "Business Administration"
              },
              {
                icon: "🔬",
                title: "Science"
              },
              {
                icon: "👥",
                title: "Management"
              },
              {
                icon: "💼",
                title: "Commerce"
              },
              {
                icon: "⚙️",
                title: "Engineering"
              },
              {
                icon: "🎓",
                title: "Diploma"
              },
              {
                icon: "💻",
                title: "Computer Application"
              },
              {
                icon: "🏥",
                title: "Physiotherapy"
              },
              {
                icon: "⚖️",
                title: "Law"
              },
              {
                icon: "🌾",
                title: "Agriculture"
              },
              {
                icon: "💊",
                title: "Pharmacy"
              },
              {
                icon: "🔍",
                title: "Research"
              }
            ].map((course, index) => (
              <button
                key={index}
                onClick={() => handleCourseClick(course.title)}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className="w-20 h-20 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center mb-4 hover:shadow-lg hover:border-teal-500 transition-all group-hover:scale-110">
                  <span className="text-4xl">{course.icon}</span>
                </div>
                <p className="text-center text-gray-700 font-medium text-sm group-hover:text-teal-600">{course.title}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* MOUs and Top Associations Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
            MOUs and Top association
          </h2>

          <div className="flex flex-wrap justify-center items-center gap-8">
            {[
              { name: "Wipro", logo: "/wipro.jpg" },
              { name: "Cisco", logo: "/cisco.jpg" },
              { name: "Oracle", logo: "/oracle.jpg" },
              { name: "Google", logo: "/google.jpg" },
              { name: "IBM", logo: "/ibm.jpg" }
            ].map((partner, index) => (
              <div 
                key={index} 
                className="bg-gray-100 rounded-xl p-8 hover:shadow-2xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center"
                style={{ width: '200px', height: '120px' }}
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={160}
                  height={100}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Entrepreneurship Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Discover the thriving Entrepreneur in you!
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Startup and Entrepreneurship Support at Marwadi University
              </p>

              <div className="space-y-6">
                <div className="border-l-4 border-teal-500 pl-6">
                  <div className="text-3xl font-bold text-teal-600 mb-1">₹ 2.3 Cr+</div>
                  <p className="text-gray-600">Total grant received by the University</p>
                </div>

                <div className="border-l-4 border-teal-500 pl-6">
                  <div className="text-3xl font-bold text-teal-600 mb-1">58+</div>
                  <p className="text-gray-600">Total number of startups initiated</p>
                </div>

                <div className="border-l-4 border-teal-500 pl-6">
                  <div className="text-3xl font-bold text-teal-600 mb-1">60+</div>
                  <p className="text-gray-600">Total number of startup programs conducted</p>
                </div>

                <div className="border-l-4 border-teal-500 pl-6">
                  <div className="text-3xl font-bold text-teal-600 mb-1">₹ 50 Lacs+</div>
                  <p className="text-gray-600">Total number of funds disbursed</p>
                </div>
              </div>
            </div>

            {/* Right Side - Image Placeholder */}
            <div className="hidden lg:flex justify-center">
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🚗</div>
                  <p className="text-gray-600 font-medium">Entrepreneurship & Innovation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="bg-gray-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Contact Section */}
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-bold mb-6">For More Details Contact US</h3>
              <p className="text-3xl font-black text-teal-400 mb-6">📞 9908432153</p>
              
              <div className="bg-gradient-to-br from-gray-600 to-gray-800 p-6 rounded-lg">
                <p className="text-lg font-bold text-teal-300 mb-3">
                  Dr. P. Nithin Rao
                </p>
                <p className="text-sm text-gray-200 leading-relaxed font-semibold">
                   Telangana Zonal Office<br />
                   Warangal, Karimnagar, Asifabad, Mancherial
                </p>
              </div>
            </div>

            {/* Spacer */}
            <div></div>

            {/* Links Section */}
            <div className="flex flex-col md:flex-row justify-center md:justify-end gap-8">
              <a href="#" className="text-lg font-semibold hover:text-teal-400 transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="text-lg font-semibold hover:text-teal-400 transition-colors duration-300">Terms and Conditions</a>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-600 pt-8">
            <p className="text-center text-gray-300 text-base">©2025-26 konfido – All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}