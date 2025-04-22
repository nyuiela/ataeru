'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function SurrogacyForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    height: '',
    weight: '',
    previousPregnancies: '',
    healthStatus: '',
    lifestyle: '',
    motivation: '',
    expectation: '',
    availability: '',
    agreeToTerms: false,
    agreeToScreening: false,
    agreeToContract: false
  });

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const nextStep = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // In a real app, you would handle form submission here
    // For demo, we'll simulate a submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <Image src="/images/logo.svg" alt="LifeSpring Logo" width={32} height={32} className="w-8 h-8" />
            <span className="text-xl font-bold text-blue-600">LifeSpring</span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Progress Bar */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-2">
            <div 
              className="h-full bg-green-400 transition-all duration-500"
              style={{ width: `${step * 33.33}%` }}
            ></div>
          </div>
          
          {/* Form Title */}
          <div className="py-6 px-6 sm:px-10 border-b">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Surrogate Application</h1>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">
              Apply to become a surrogate and help families achieve their dream of parenthood
            </p>
          </div>

          {isSubmitted ? (
            <div className="py-12 px-6 sm:px-10 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for your interest in our surrogacy program. We&apos;ll review your application and contact you within 3-5 business days for an initial consultation.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6 max-w-md mx-auto text-left">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Application ID:</span> 
                  <span className="ml-2 font-mono text-blue-600">SUR-{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Submitted on:</span> 
                  <span className="ml-2">{new Date().toLocaleDateString()}</span>
                </p>
              </div>
              <Link 
                href="/" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
              >
                Return to Homepage
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="py-6 px-6 sm:px-10">
                {step === 1 && (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                          Age (21-40) *
                        </label>
                        <input
                          type="number"
                          id="age"
                          name="age"
                          min="21"
                          max="40"
                          value={formData.age}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                          Height (cm) *
                        </label>
                        <input
                          type="number"
                          id="height"
                          name="height"
                          value={formData.height}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                          Weight (kg) *
                        </label>
                        <input
                          type="number"
                          id="weight"
                          name="weight"
                          value={formData.weight}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={nextStep}
                        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Medical & Background Information</h2>
                    
                    <div>
                      <label htmlFor="previousPregnancies" className="block text-sm font-medium text-gray-700 mb-1">
                        Previous Pregnancy Experience *
                      </label>
                      <textarea
                        id="previousPregnancies"
                        name="previousPregnancies"
                        value={formData.previousPregnancies}
                        onChange={handleChange}
                        required
                        rows={3}
                        placeholder="Please provide details about your previous pregnancies and births"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label htmlFor="healthStatus" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Health Status *
                      </label>
                      <textarea
                        id="healthStatus"
                        name="healthStatus"
                        value={formData.healthStatus}
                        onChange={handleChange}
                        required
                        rows={3}
                        placeholder="Please describe your current health status including any medical conditions"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label htmlFor="lifestyle" className="block text-sm font-medium text-gray-700 mb-1">
                        Lifestyle Information *
                      </label>
                      <textarea
                        id="lifestyle"
                        name="lifestyle"
                        value={formData.lifestyle}
                        onChange={handleChange}
                        required
                        rows={3}
                        placeholder="Please describe your lifestyle including exercise habits, diet, and any substance use"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      ></textarea>
                    </div>
                    
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors"
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Information & Consent</h2>
                    
                    <div>
                      <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 mb-1">
                        Motivation for Becoming a Surrogate *
                      </label>
                      <textarea
                        id="motivation"
                        name="motivation"
                        value={formData.motivation}
                        onChange={handleChange}
                        required
                        rows={3}
                        placeholder="Please explain why you want to become a surrogate"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label htmlFor="expectation" className="block text-sm font-medium text-gray-700 mb-1">
                        Expectations from the Program *
                      </label>
                      <textarea
                        id="expectation"
                        name="expectation"
                        value={formData.expectation}
                        onChange={handleChange}
                        required
                        rows={3}
                        placeholder="What are your expectations from our surrogacy program?"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
                        Availability *
                      </label>
                      <select
                        id="availability"
                        name="availability"
                        value={formData.availability}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">When would you be available to start?</option>
                        <option value="Immediately">Immediately</option>
                        <option value="1-3 months">1-3 months</option>
                        <option value="3-6 months">3-6 months</option>
                        <option value="6+ months">6+ months</option>
                      </select>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                      <h3 className="font-bold text-blue-800 mb-2">Smart Contract Information</h3>
                      <p className="text-sm text-blue-700">
                        LifeSpring uses smart contracts to ensure secure and transparent agreements between surrogates and intended parents. Your compensation and medical expenses will be stored in an escrow account with milestone-based releases.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          id="agreeToTerms"
                          name="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onChange={handleChange}
                          required
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="agreeToTerms" className="ml-3 text-sm text-gray-700">
                          I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> *
                        </label>
                      </div>
                      
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          id="agreeToScreening"
                          name="agreeToScreening"
                          checked={formData.agreeToScreening}
                          onChange={handleChange}
                          required
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="agreeToScreening" className="ml-3 text-sm text-gray-700">
                          I consent to undergo medical screening, psychological evaluation, and background verification *
                        </label>
                      </div>
                      
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          id="agreeToContract"
                          name="agreeToContract"
                          checked={formData.agreeToContract}
                          onChange={handleChange}
                          required
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="agreeToContract" className="ml-3 text-sm text-gray-700">
                          I understand that if selected, I will be required to sign a smart contract agreement with the intended parents *
                        </label>
                      </div>
                    </div>
                    
                    <div className="pt-4 flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors"
                      >
                        Previous
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                          </>
                        ) : 'Submit Application'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </form>
          )}
          
          {/* Information Section */}
          {!isSubmitted && (
            <div className="py-6 px-6 sm:px-10 bg-gray-50 border-t">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Important Information</h3>
                  <div className="mt-2 text-sm text-gray-600 space-y-1">
                    <p>• Surrogates must be between 21-40 years old with at least one healthy pregnancy</p>
                    <p>• Compensation starts at $25,000 USD (paid in crypto-equivalent) plus expenses</p>
                    <p>• Smart contract escrow ensures payment security and milestone-based releases</p>
                    <p>• Questions? Contact us at surrogacy@lifespring.eth</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 