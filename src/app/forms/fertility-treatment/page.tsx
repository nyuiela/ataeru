'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function FertilityTreatmentForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    partnerName: '',
    partnerAge: '',
    address: '',
    city: '',
    country: '',
    infertilityDuration: '',
    previousTreatments: '',
    medicalHistory: '',
    additionalInfo: '',
    preferredTreatment: '',
    budget: '',
    insuranceDetails: '',
    referralSource: '',
    agreeToTerms: false,
    agreeToMedicalInfo: false,
    agreeToContact: false
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
            <Image src="/images/logo.svg" alt="Ataeru Logo" width={32} height={32} className="w-8 h-8" />
            <span className="text-xl font-bold text-blue-600">Ataeru</span>
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Fertility Treatment Application</h1>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">
              Start your fertility journey with our specialized treatments and personalized care
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
                Thank you for applying to our fertility treatment program. One of our specialists will contact you within 48 hours to discuss your options and schedule an initial consultation.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6 max-w-md mx-auto text-left">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Application ID:</span>
                  <span className="ml-2 font-mono text-blue-600">FER-{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
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
                          Age *
                        </label>
                        <input
                          type="number"
                          id="age"
                          name="age"
                          min="18"
                          value={formData.age}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="partnerName" className="block text-sm font-medium text-gray-700 mb-1">
                          Partner&apos;s Name (if applicable)
                        </label>
                        <input
                          type="text"
                          id="partnerName"
                          name="partnerName"
                          value={formData.partnerName}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="partnerAge" className="block text-sm font-medium text-gray-700 mb-1">
                          Partner&apos;s Age (if applicable)
                        </label>
                        <input
                          type="number"
                          id="partnerAge"
                          name="partnerAge"
                          min="18"
                          value={formData.partnerAge}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                          Country *
                        </label>
                        <input
                          type="text"
                          id="country"
                          name="country"
                          value={formData.country}
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
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Medical Information</h2>

                    <div>
                      <label htmlFor="infertilityDuration" className="block text-sm font-medium text-gray-700 mb-1">
                        How long have you been trying to conceive? *
                      </label>
                      <select
                        id="infertilityDuration"
                        name="infertilityDuration"
                        value={formData.infertilityDuration}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Please select</option>
                        <option value="Less than 6 months">Less than 6 months</option>
                        <option value="6-12 months">6-12 months</option>
                        <option value="1-2 years">1-2 years</option>
                        <option value="2-5 years">2-5 years</option>
                        <option value="More than 5 years">More than 5 years</option>
                        <option value="Not applicable">Not applicable</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="previousTreatments" className="block text-sm font-medium text-gray-700 mb-1">
                        Previous Fertility Treatments (if any)
                      </label>
                      <textarea
                        id="previousTreatments"
                        name="previousTreatments"
                        value={formData.previousTreatments}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Please describe any previous fertility treatments you have undergone"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      ></textarea>
                    </div>

                    <div>
                      <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700 mb-1">
                        Relevant Medical History *
                      </label>
                      <textarea
                        id="medicalHistory"
                        name="medicalHistory"
                        value={formData.medicalHistory}
                        onChange={handleChange}
                        required
                        rows={3}
                        placeholder="Please describe any relevant medical conditions that may affect fertility"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      ></textarea>
                    </div>

                    <div>
                      <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Information
                      </label>
                      <textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Any additional information you'd like us to know"
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
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Treatment Preferences & Consent</h2>

                    <div>
                      <label htmlFor="preferredTreatment" className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Treatment Option (if known)
                      </label>
                      <select
                        id="preferredTreatment"
                        name="preferredTreatment"
                        value={formData.preferredTreatment}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Please select</option>
                        <option value="In Vitro Fertilization (IVF)">In Vitro Fertilization (IVF)</option>
                        <option value="Intrauterine Insemination (IUI)">Intrauterine Insemination (IUI)</option>
                        <option value="Ovulation Induction">Ovulation Induction</option>
                        <option value="Egg Freezing">Egg Freezing</option>
                        <option value="Sperm Freezing">Sperm Freezing</option>
                        <option value="Donor Egg">Donor Egg</option>
                        <option value="Donor Sperm">Donor Sperm</option>
                        <option value="Surrogacy">Surrogacy</option>
                        <option value="Not sure/Need guidance">Not sure/Need guidance</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                        Budget Range (USD)
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Please select</option>
                        <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                        <option value="$10,000 - $20,000">$10,000 - $20,000</option>
                        <option value="$20,000 - $30,000">$20,000 - $30,000</option>
                        <option value="$30,000 - $50,000">$30,000 - $50,000</option>
                        <option value="$50,000+">$50,000+</option>
                        <option value="Not sure/Need guidance">Not sure/Need guidance</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="insuranceDetails" className="block text-sm font-medium text-gray-700 mb-1">
                        Insurance Details (if applicable)
                      </label>
                      <textarea
                        id="insuranceDetails"
                        name="insuranceDetails"
                        value={formData.insuranceDetails}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Please provide details about your insurance coverage, if applicable"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      ></textarea>
                    </div>

                    <div>
                      <label htmlFor="referralSource" className="block text-sm font-medium text-gray-700 mb-1">
                        How did you hear about us?
                      </label>
                      <select
                        id="referralSource"
                        name="referralSource"
                        value={formData.referralSource}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Please select</option>
                        <option value="Doctor/Physician">Doctor/Physician</option>
                        <option value="Friend/Family">Friend/Family</option>
                        <option value="Internet Search">Internet Search</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Advertisement">Advertisement</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                      <h3 className="font-bold text-blue-800 mb-2">Ataeru Commitment</h3>
                      <p className="text-sm text-blue-700">
                        We believe in making fertility treatments accessible and affordable. Our blockchain-based platform enables transparent pricing, secure payment options including cryptocurrency, and streamlined insurance processing where applicable.
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
                          id="agreeToMedicalInfo"
                          name="agreeToMedicalInfo"
                          checked={formData.agreeToMedicalInfo}
                          onChange={handleChange}
                          required
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="agreeToMedicalInfo" className="ml-3 text-sm text-gray-700">
                          I understand that I will need to provide medical records and may need to undergo additional testing *
                        </label>
                      </div>

                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          id="agreeToContact"
                          name="agreeToContact"
                          checked={formData.agreeToContact}
                          onChange={handleChange}
                          required
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="agreeToContact" className="ml-3 text-sm text-gray-700">
                          I consent to be contacted by Ataeru representatives regarding my fertility treatment options *
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
                    <p>• Initial consultation fee: $250 USD (refundable if you proceed with treatment)</p>
                    <p>• Most treatments can begin within 2-4 weeks of approval</p>
                    <p>• Financing options available with 0% interest for qualified applicants</p>
                    <p>• Crypto payments accepted (BTC, ETH, USDC) with 5% discount</p>
                    <p>• Questions? Contact us at fertility@Ataeru.eth</p>
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