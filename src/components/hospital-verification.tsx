"use client"

import  { useState, ChangeEvent, FormEvent } from 'react';


interface FileUpload {
  file: File | null;
  preview: string;
}

interface HospitalFormData {
  organizationName: string;
  registrationNumber: string;
  yearEstablished: string;
  organizationType: string;
  bloodBankCapacity: string;
  email: string;
  primaryPhone: string;
  emergencyPhone: string;
  address: string;
  city: string;
  state: string;
  website: string;
  description: string;
  contactPersonName: string;
  contactPersonDesignation: string;
  contactPersonEmail: string;
  contactPersonPhone: string;
  employeeId: string;
}

export default function HospitalVerification() {
  
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [dataConsentAccepted, setDataConsentAccepted] = useState(false);
  const [complianceAccepted, setComplianceAccepted] = useState(false);

  const [formData, setFormData] = useState<HospitalFormData>({
    organizationName: '',
    registrationNumber: '',
    yearEstablished: '',
    organizationType: '',
    bloodBankCapacity: '',
    email: '',
    primaryPhone: '',
    emergencyPhone: '',
    address: '',
    city: '',
    state: '',
    website: '',
    description: '',
    contactPersonName: '',
    contactPersonDesignation: '',
    contactPersonEmail: '',
    contactPersonPhone: '',
    employeeId: ''
  });

  const [files, setFiles] = useState({
    registration: { file: null, preview: '' } as FileUpload,
    license: { file: null, preview: '' } as FileUpload,
    accreditation: { file: null, preview: '' } as FileUpload,
    tax: { file: null, preview: '' } as FileUpload,
    contactId: { file: null, preview: '' } as FileUpload,
    authLetter: { file: null, preview: '' } as FileUpload,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (fileType: keyof typeof files, file: File | null) => {
    if (!file) return;

    const fileSizeMB = file.size / 1024 / 1024;

    if (fileSizeMB > 5) {
      alert('File size must be less than 5MB');
      return;
    }

    setFiles(prev => ({
      ...prev,
      [fileType]: {
        file,
        preview: file.name
      }
    }));
  };

  const removeFile = (fileType: keyof typeof files) => {
    setFiles(prev => ({
      ...prev,
      [fileType]: { file: null, preview: '' }
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!termsAccepted || !dataConsentAccepted || !complianceAccepted) {
      alert('Please accept all terms and conditions');
      return;
    }

    // Check if all required documents are uploaded
    const requiredDocs: (keyof typeof files)[] = ['registration', 'license', 'accreditation', 'tax', 'contactId', 'authLetter'];
    const missingDocs = requiredDocs.filter(doc => !files[doc].file);

    if (missingDocs.length > 0) {
      alert('Please upload all required documents');
      return;
    }

    setIsSubmitting(true);

    // Generate reference ID
    const refId = `HOSP-2024-${Math.floor(Math.random() * 10000)}`;
    setReferenceId(refId);

    // Simulate API call
    setTimeout(() => {
      console.log('Form Data:', formData);
      console.log('Files:', files);
      console.log('Reference ID:', refId);
      setIsSubmitting(false);
      setShowModal(true);
    }, 2500);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 " style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif"
    }}>
      <style jsx global>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }

        .upload-area {
          border: 2px dashed #667eea;
          transition: all 0.3s ease;
        }

        .upload-area:hover {
          border-color: #764ba2;
          background: #f9fafb;
        }

        .document-card {
          border: 2px solid #e5e7eb;
          transition: all 0.3s ease;
        }

        .document-card:hover {
          border-color: #667eea;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        }

        .status-badge {
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-verified {
          background: #d1fae5;
          color: #065f46;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transition: all 0.3s ease;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .animation-fade-in {
          animation: fadeIn 0.5s ease-in;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .loader {
          border: 3px solid #f3f4f6;
          border-top: 3px solid #667eea;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .step-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin: 0 auto;
        }

        .progress-step.active .step-circle {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
      `}</style>

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      <div className="max-w-7xl mx-auto ">
        {/* Header */}
        <div className="glass-card p-6 mb-6 animation-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <button onClick={() => "/"} className="text-gray-700 hover:text-purple-600 transition">
                <i className="fas fa-arrow-left text-2xl"></i>
              </button>
              <div className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-xl">
                <i className="fas fa-hospital text-white text-2xl"></i>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Hospital Verification</h1>
                <p className="text-gray-600">Register your hospital or blood bank facility</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="glass-card p-6 mb-6 animation-fade-in">
          <div className="flex justify-between items-center max-w-4xl mx-auto">
            <div className="progress-step active flex-1 text-center">
              <div className="step-circle">1</div>
              <p className="text-sm mt-2 font-semibold text-gray-700">Organization Info</p>
            </div>
            <div className="h-1 flex-1 bg-gray-300 mx-2"></div>
            <div className="progress-step flex-1 text-center">
              <div className="step-circle">2</div>
              <p className="text-sm mt-2 font-semibold text-gray-500">Documents</p>
            </div>
            <div className="h-1 flex-1 bg-gray-300 mx-2"></div>
            <div className="progress-step flex-1 text-center">
              <div className="step-circle">3</div>
              <p className="text-sm mt-2 font-semibold text-gray-500">Contact Person</p>
            </div>
            <div className="h-1 flex-1 bg-gray-300 mx-2"></div>
            <div className="progress-step flex-1 text-center">
              <div className="step-circle">4</div>
              <p className="text-sm mt-2 font-semibold text-gray-500">Review</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6 ">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit}>
              {/* Organization Information */}
              <div className="glass-card p-6 animation-fade-in mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <i className="fas fa-building mr-2 text-purple-600"></i>
                  Organization Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Hospital/Organization Name *</label>
                    <input
                      type="text"
                      name="organizationName"
                      required
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      placeholder="City General Hospital"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Registration Number *</label>
                      <input
                        type="text"
                        name="registrationNumber"
                        required
                        value={formData.registrationNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        placeholder="REG-123456"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Year Established *</label>
                      <input
                        type="number"
                        name="yearEstablished"
                        required
                        value={formData.yearEstablished}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        placeholder="1990"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Organization Type *</label>
                      <select
                        name="organizationType"
                        required
                        value={formData.organizationType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      >
                        <option value="">Select Type</option>
                        <option value="government">Government Hospital</option>
                        <option value="private">Private Hospital</option>
                        <option value="charitable">Charitable Hospital</option>
                        <option value="specialty">Specialty Hospital</option>
                        <option value="bloodbank">Independent Blood Bank</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Bank Capacity *</label>
                      <select
                        name="bloodBankCapacity"
                        required
                        value={formData.bloodBankCapacity}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      >
                        <option value="">Select Capacity</option>
                        <option value="small">Small (&lt; 100 units)</option>
                        <option value="medium">Medium (100-500 units)</option>
                        <option value="large">Large (500-1000 units)</option>
                        <option value="very-large">Very Large (&gt; 1000 units)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Official Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      placeholder="contact@cityhospital.com"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Phone Number *</label>
                      <input
                        type="tel"
                        name="primaryPhone"
                        required
                        value={formData.primaryPhone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact Number *</label>
                      <input
                        type="tel"
                        name="emergencyPhone"
                        required
                        value={formData.emergencyPhone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        placeholder="+1 (555) 987-6543"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Complete Address *</label>
                    <textarea
                      name="address"
                      required
                      rows={3}
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      placeholder="Street Address, City, State, ZIP Code, Country"
                    ></textarea>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">State/Province *</label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        placeholder="NY"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Website (Optional)</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      placeholder="https://www.cityhospital.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Brief Description *</label>
                    <textarea
                      name="description"
                      required
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      placeholder="Provide a brief description of your hospital, services, and blood bank facilities..."
                    ></textarea>
                  </div>
                </div>
              </div>

               {/* Document Upload Section */}
              <div className="glass-card p-6 animation-fade-in mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-center">
                  <i className="fas fa-file-upload mr-2 text-purple-600"></i>
                  Required Documents
                </h2>

                <div className="space-y-6 max-w-2xl mx-auto">
                  {/* Document Upload Components */}
                  {[
                    { key: 'registration', icon: 'fa-certificate', color: 'purple', title: 'Hospital Registration Certificate *', desc: 'Official registration document from health authority' },
                    { key: 'license', icon: 'fa-file-contract', color: 'red', title: 'Blood Bank License *', desc: 'Valid license for blood collection and storage' },
                    { key: 'accreditation', icon: 'fa-award', color: 'green', title: 'Accreditation Certificate *', desc: 'National or international healthcare accreditation' },
                    { key: 'tax', icon: 'fa-file-invoice', color: 'blue', title: 'Tax Registration Document *', desc: 'Tax ID or business registration certificate' }
                  ].map((doc) => (
                    <div key={doc.key} className="document-card p-4 rounded-lg">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-10 h-10 bg-${doc.color}-100 rounded-lg flex items-center justify-center`}>
                          <i className={`fas ${doc.icon} text-${doc.color}-600`}></i>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800">{doc.title}</h4>
                          <p className="text-sm text-gray-600">{doc.desc}</p>
                        </div>
                      </div>
                      <div className="upload-area p-4 rounded-lg text-center cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(doc.key as keyof typeof files, e.target.files?.[0] || null)}
                          className="hidden"
                          id={`${doc.key}Upload`}
                        />
                        <label htmlFor={`${doc.key}Upload`} className="cursor-pointer">
                          <i className="fas fa-cloud-upload-alt text-3xl text-purple-600 mb-2"></i>
                          <p className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                        </label>
                      </div>
                      {files[doc.key as keyof typeof files].preview && (
                        <div className="mt-2 flex items-center justify-between p-3 bg-white rounded-lg border-2 border-green-200">
                          <div className="flex items-center gap-3">
                            <i className="fas fa-file text-2xl text-blue-600"></i>
                            <div className="font-semibold text-gray-800 text-sm">{files[doc.key as keyof typeof files].preview}</div>
                          </div>
                          <button type="button" onClick={() => removeFile(doc.key as keyof typeof files)} className="text-red-600 hover:text-red-700 p-2">
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Person Information */}
              <div className="glass-card p-6 animation-fade-in mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-center">
                  <i className="fas fa-user-tie mr-2 text-purple-600"></i>
                  Authorized Contact Person
                </h2>

                <div className="space-y-4 max-w-2xl mx-auto">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="contactPersonName"
                        required
                        value={formData.contactPersonName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        placeholder="Dr. Jane Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Designation/Position *</label>
                      <input
                        type="text"
                        name="contactPersonDesignation"
                        required
                        value={formData.contactPersonDesignation}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        placeholder="Blood Bank Manager"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="contactPersonEmail"
                        required
                        value={formData.contactPersonEmail}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        placeholder="jane.smith@hospital.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="contactPersonPhone"
                        required
                        value={formData.contactPersonPhone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Employee ID/Badge Number *</label>
                    <input
                      type="text"
                      name="employeeId"
                      required
                      value={formData.employeeId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      placeholder="EMP-12345"
                    />
                  </div>

                  {/* Contact Person Documents */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Person ID/Badge *</label>
                    <div className="upload-area p-4 rounded-lg text-center cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload('contactId', e.target.files?.[0] || null)}
                        className="hidden"
                        id="contactIdUpload"
                      />
                      <label htmlFor="contactIdUpload" className="cursor-pointer">
                        <i className="fas fa-id-card text-3xl text-purple-600 mb-2"></i>
                        <p className="text-sm text-gray-600 font-medium">Upload government ID or employee badge</p>
                        <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                      </label>
                    </div>
                    {files.contactId.preview && (
                      <div className="mt-2 flex items-center justify-between p-3 bg-white rounded-lg border-2 border-green-200">
                        <div className="flex items-center gap-3">
                          <i className="fas fa-file text-2xl text-blue-600"></i>
                          <div className="font-semibold text-gray-800 text-sm">{files.contactId.preview}</div>
                        </div>
                        <button type="button" onClick={() => removeFile('contactId')} className="text-red-600 hover:text-red-700 p-2">
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Authorization Letter *</label>
                    <div className="upload-area p-4 rounded-lg text-center cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileUpload('authLetter', e.target.files?.[0] || null)}
                        className="hidden"
                        id="authLetterUpload"
                      />
                      <label htmlFor="authLetterUpload" className="cursor-pointer">
                        <i className="fas fa-file-signature text-3xl text-purple-600 mb-2"></i>
                        <p className="text-sm text-gray-600 font-medium">Upload authorization letter</p>
                        <p className="text-xs text-gray-500 mt-1">PDF (Max 5MB) - Must be on official letterhead</p>
                      </label>
                    </div>
                    {files.authLetter.preview && (
                      <div className="mt-2 flex items-center justify-between p-3 bg-white rounded-lg border-2 border-green-200">
                        <div className="flex items-center gap-3">
                          <i className="fas fa-file-pdf text-2xl text-red-600"></i>
                          <div className="font-semibold text-gray-800 text-sm">{files.authLetter.preview}</div>
                        </div>
                        <button type="button" onClick={() => removeFile('authLetter')} className="text-red-600 hover:text-red-700 p-2">
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Terms and Submit */}
              <div className="glass-card p-6 animation-fade-in">
                <div className="space-y-4">
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <div className="flex items-start gap-3">
                      <i className="fas fa-exclamation-triangle text-yellow-600 text-xl"></i>
                      <div>
                        <h4 className="font-bold text-gray-800 mb-1">Important Notice</h4>
                        <p className="text-sm text-gray-700">All documents must be current and valid. Expired or fraudulent documents will result in immediate rejection and may lead to legal action.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-1 w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I certify that all information and documents provided are authentic and accurate. I have the authority to represent this organization.
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="dataConsent"
                      checked={dataConsentAccepted}
                      onChange={(e) => setDataConsentAccepted(e.target.checked)}
                      className="mt-1 w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                    />
                    <label htmlFor="dataConsent" className="text-sm text-gray-600">
                      I consent to Rapid Rescuers storing and processing this information for verification purposes.
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="compliance"
                      checked={complianceAccepted}
                      onChange={(e) => setComplianceAccepted(e.target.checked)}
                      className="mt-1 w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                    />
                    <label htmlFor="compliance" className="text-sm text-gray-600">
                      Our organization complies with all applicable healthcare regulations, HIPAA requirements, and blood banking standards.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full py-4 px-6 rounded-lg font-semibold text-lg"
                  >
                    {isSubmitting ? (
                      <div className="loader mx-auto"></div>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane mr-2"></i>Submit Hospital Verification Request
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

        {/* Right Column - Info & Stats */}
          <div className="space-y-6">
            {/* Statistics */}
            <div className="glass-card p-6 animation-fade-in">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Verification Statistics</h3>
              <div className="space-y-3">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pending Review</span>
                    <span className="text-2xl font-bold text-yellow-700">12</span>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Verified This Month</span>
                    <span className="text-2xl font-bold text-green-700">8</span>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Hospitals</span>
                    <span className="text-2xl font-bold text-blue-700">89</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Checklist */}
            <div className="glass-card p-6 animation-fade-in">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                <i className="fas fa-clipboard-list mr-2 text-blue-600"></i>
                Document Checklist
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <i className="fas fa-check-circle text-green-600 mt-1"></i>
                  <span>Hospital registration certificate</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-check-circle text-green-600 mt-1"></i>
                  <span>Valid blood bank license</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-check-circle text-green-600 mt-1"></i>
                  <span>Accreditation certificates</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-check-circle text-green-600 mt-1"></i>
                  <span>Tax registration documents</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-check-circle text-green-600 mt-1"></i>
                  <span>Contact person ID & authorization</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-8 max-w-md w-full text-center animation-fade-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-check-circle text-5xl text-green-600"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h3>
            <p className="text-gray-600 mb-4">Your hospital verification application has been submitted successfully.</p>
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-700 font-semibold mb-2">What Happens Next?</p>
              <ul className="text-sm text-gray-600 space-y-1 text-left">
                <li>✓ Initial document review: 1-2 business days</li>
                <li>✓ Verification call from our team</li>
                <li>✓ Final approval: 3-5 business days</li>
                <li>✓ Email notifications at each stage</li>
              </ul>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              <strong>Reference ID:</strong> <span className="text-purple-600 font-mono">{referenceId}</span>
            </p>
            <button onClick={closeModal} className="btn-primary py-3 px-8 rounded-lg font-semibold">
              Return to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}