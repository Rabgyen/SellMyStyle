import React, { useState } from 'react';
import axios from 'axios';
import { FiX, FiCheckCircle, FiUploadCloud } from 'react-icons/fi';
import { FaInstagram, FaTiktok, FaFacebook, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const STEPS = [
  { id: 'store', label: 'Store Overview' },
  { id: 'bank', label: 'Bank Details' },
  { id: 'identity', label: 'Identity Verification' },
  { id: 'confirm', label: 'Confirm Details' },
];

const SellerVerificationModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    storeName: '',
    storeDescription: '',
    storeLogo: null,
    socialInstagramEnabled: false,
    socialInstagramUrl: '',
    socialTiktokEnabled: false,
    socialTiktokUrl: '',
    socialFacebookEnabled: false,
    socialFacebookUrl: '',
    socialXEnabled: false,
    socialXUrl: '',
    socialYoutubeEnabled: false,
    socialYoutubeUrl: '',
    businessType: '',
    paymentMethod: '',
    bankAccountName: '',
    bankAccountNumber: '',
    idType: '',
    idFront: null,
    idBack: null,
    infoAccurate: false,
    termsAgreed: false,
    falseInfo: false,
    authorizeReview: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      
      // Get seller id from local storage
      const sellerId = localStorage.getItem("user_id");
      data.append("seller_id", sellerId);

      // Append all simple text/boolean fields
      Object.keys(formData).forEach(key => {
        if (key !== 'storeLogo' && key !== 'idFront' && key !== 'idBack') {
          data.append(key, formData[key]);
        }
      });

      // Append files
      if (formData.storeLogo) data.append("storeLogo", formData.storeLogo);
      if (formData.idFront) data.append("idFront", formData.idFront);
      if (formData.idBack) data.append("idBack", formData.idBack);

      const response = await axios.post("http://localhost:5000/api/seller/register", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.success) {
        setIsSubmitting(false);
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
          setCurrentStep(0);
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting seller application:", error);
      alert("There was an error submitting your application. Please try again.");
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Store Overview</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Store Name *</label>
              <input
                type="text"
                name="storeName"
                required
                value={formData.storeName}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="My Awesome Store"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Store Description *</label>
              <textarea
                name="storeDescription"
                required
                value={formData.storeDescription}
                onChange={handleInputChange}
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                placeholder="What does your store sell?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Store Logo (Optional)</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiUploadCloud className="w-6 h-6 text-slate-400 mb-2" />
                    <p className="text-xs text-slate-500">{formData.storeLogo ? formData.storeLogo.name : 'Click to upload logo'}</p>
                  </div>
                  <input type="file" name="storeLogo" accept="image/*" className="hidden" onChange={handleInputChange} />
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Social Media Links</label>
              <div className="space-y-3">
                {[
                  { id: 'Instagram', icon: FaInstagram, color: 'text-pink-600' },
                  { id: 'Tiktok', icon: FaTiktok, color: 'text-slate-900' },
                  { id: 'Facebook', icon: FaFacebook, color: 'text-blue-600' },
                  { id: 'X', icon: FaXTwitter, color: 'text-slate-900' },
                  { id: 'Youtube', icon: FaYoutube, color: 'text-red-600' },
                ].map((social) => (
                  <div key={social.id} className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        name={`social${social.id}Enabled`}
                        checked={formData[`social${social.id}Enabled`]}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <social.icon className={`w-4 h-4 ${social.color}`} />
                      <span className="text-sm text-slate-700 font-medium">{social.id}</span>
                    </label>
                    {formData[`social${social.id}Enabled`] && (
                      <input
                        type="url"
                        name={`social${social.id}Url`}
                        value={formData[`social${social.id}Url`]}
                        onChange={handleInputChange}
                        className="ml-6 w-[calc(100%-1.5rem)] rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder={`https://${social.id.toLowerCase()}.com/yourusername`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Business Type *</label>
              <select
                name="businessType"
                required
                value={formData.businessType}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Select a business type</option>
                <option value="individual">Individual / Sole Proprietor</option>
                <option value="company">Registered Company</option>
                <option value="brand">Brand / Boutique</option>
              </select>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Bank Details</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method *</label>
              <select
                name="paymentMethod"
                required
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Select payment method</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="visa_card">Visa Card</option>
                <option value="paypal">PayPal</option>
                <option value="other">Other</option>
              </select>
            </div>
            {formData.paymentMethod && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Account Name *</label>
                  <input
                    type="text"
                    name="bankAccountName"
                    required
                    value={formData.bankAccountName}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Account Number / Email *</label>
                  <input
                    type="text"
                    name="bankAccountNumber"
                    required
                    value={formData.bankAccountNumber}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Enter account details"
                  />
                </div>
              </>
            )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Identity Verification</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Upload Type *</label>
              <select
                name="idType"
                required
                value={formData.idType}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Select ID type</option>
                <option value="citizen_card">Citizen Card</option>
                <option value="passport">Passport</option>
                <option value="driving_license">Driving License</option>
                <option value="national_id">National ID</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ID Front Side *</label>
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiUploadCloud className="w-6 h-6 text-slate-400 mb-2" />
                    <p className="text-xs text-slate-500 text-center px-2">
                      {formData.idFront ? formData.idFront.name : 'Upload Front'}
                    </p>
                  </div>
                  <input type="file" name="idFront" accept="image/*,.pdf" className="hidden" onChange={handleInputChange} required />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ID Back Side *</label>
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiUploadCloud className="w-6 h-6 text-slate-400 mb-2" />
                    <p className="text-xs text-slate-500 text-center px-2">
                      {formData.idBack ? formData.idBack.name : 'Upload Back'}
                    </p>
                  </div>
                  <input type="file" name="idBack" accept="image/*,.pdf" className="hidden" onChange={handleInputChange} required />
                </label>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Confirm Details</h3>
            <p className="text-sm text-slate-500 mb-4">Please review and confirm the following statements to submit your seller application.</p>
            
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                <input type="checkbox" name="infoAccurate" checked={formData.infoAccurate} onChange={handleInputChange} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" required />
                <span className="text-sm text-slate-700">I confirm that all the information provided is accurate.</span>
              </label>
              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                <input type="checkbox" name="termsAgreed" checked={formData.termsAgreed} onChange={handleInputChange} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" required />
                <span className="text-sm text-slate-700">I agree to the SellMyStyle Terms and Condition.</span>
              </label>
              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                <input type="checkbox" name="falseInfo" checked={formData.falseInfo} onChange={handleInputChange} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" required />
                <span className="text-sm text-slate-700">I understand that providing false information may result in suspension of my seller account.</span>
              </label>
              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                <input type="checkbox" name="authorizeReview" checked={formData.authorizeReview} onChange={handleInputChange} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" required />
                <span className="text-sm text-slate-700">I authorize SellMyStyle to review my submitted information for seller verification.</span>
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const isCurrentStepValid = () => {
    switch(currentStep) {
      case 0:
        return formData.storeName.trim() !== '' && formData.storeDescription.trim() !== '' && formData.businessType !== '';
      case 1:
        return formData.paymentMethod !== '' && formData.bankAccountName.trim() !== '' && formData.bankAccountNumber.trim() !== '';
      case 2:
        return formData.idType !== '' && formData.idFront !== null && formData.idBack !== null;
      case 3:
        return formData.infoAccurate && formData.termsAgreed && formData.falseInfo && formData.authorizeReview;
      default:
        return false;
    }
  }

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden my-8" onClick={(e) => e.stopPropagation()}>
        
        {/* Left Navigation */}
        <div className="w-full md:w-64 bg-slate-50 p-4 md:p-6 border-b md:border-b-0 md:border-r border-slate-200 shrink-0">
          <h2 className="text-lg font-bold text-slate-900 mb-4 md:mb-6">Seller Verification</h2>
          <nav className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {STEPS.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              return (
                <div key={step.id} className={`flex shrink-0 items-center gap-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600'}`}>
                  <div className={`flex items-center justify-center w-6 h-6 shrink-0 rounded-full text-xs font-semibold ${isCompleted ? 'bg-indigo-600 text-white' : isActive ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {isCompleted ? <FiCheckCircle className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className={`text-sm font-medium whitespace-nowrap ${isActive ? 'text-indigo-700' : isCompleted ? 'text-slate-900' : 'text-slate-500'}`}>{step.label}</span>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col relative min-h-100">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h2 className="text-xl font-semibold text-slate-800">Become a Verified Seller</h2>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition">
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Form Area */}
          {isSuccess ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <FiCheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h3>
              <p className="text-slate-600">Your seller application is under review. We will notify you once verified.</p>
            </div>
          ) : (
            <>
              <div className="flex-1 p-6 overflow-y-auto">
                <form id="seller-form" onSubmit={handleSubmit}>
                  {renderStepContent()}
                </form>
              </div>

              {/* Footer / Actions */}
              <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-white">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 0 || isSubmitting}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${currentStep === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 bg-slate-100 hover:bg-slate-200'}`}
                >
                  Back
                </button>
                
                {currentStep < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isCurrentStepValid()}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    form="seller-form"
                    disabled={!isCurrentStepValid() || isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Submitting...</>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerVerificationModal;
