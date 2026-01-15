"use client"
import  { useState, ChangeEvent, FormEvent } from 'react';


interface FileUpload {
  file: File | null;
  preview: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  bloodType: string;
  gender: string;
  idNumber: string;
  address: string;
  weight: string;
  lastDonation: string;
  medications: string;
  allergies: string;
  medicalConditions: string[];
}

export default function DonorVerification() {

  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    bloodType: '',
    gender: '',
    idNumber: '',
    address: '',
    weight: '',
    lastDonation: '',
    medications: '',
    allergies: '',
    medicalConditions: []
  });

  const [files, setFiles] = useState({
    idDocument: { file: null, preview: '' } as FileUpload,
    medicalCert: { file: null, preview: '' } as FileUpload,
    photo: { file: null, preview: '' } as FileUpload,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (condition: string) => {
    setFormData(prev => ({
      ...prev,
      medicalConditions: prev.medicalConditions.includes(condition)
        ? prev.medicalConditions.filter(c => c !== condition)
        : [...prev.medicalConditions, condition]
    }));
  };

  const handleFileUpload = (fileType: keyof typeof files, file: File | null) => {
    if (!file) return;

    const maxSize = fileType === 'photo' ? 2 : 5;
    const fileSizeMB = file.size / 1024 / 1024;

    if (fileSizeMB > maxSize) {
      alert(`File size must be less than ${maxSize}MB`);
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

    if (!termsAccepted || !consentAccepted) {
      alert('Please accept the terms and conditions');
      return;
    }

    if (!files.idDocument.file || !files.photo.file) {
      alert('Please upload required documents (ID and Photo)');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Form Data:', formData);
      console.log('Files:', files);
      setIsSubmitting(false);
      setShowModal(true);
    }, 2000);
  };

  const closeModal = () => {
    setShowModal(false);
  
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{
      background: 'linear-gradient(135deg, #f8b9b3 0%, #fec2c2 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif"
    }}>
      

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-card p-6 mb-6 animation-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <button onClick={() => "/"} className="text-gray-700 hover:text-purple-600 transition">
                <i className="fas fa-arrow-left text-2xl"></i>
              </button>
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
                <i className="fas fa-user-check text-white text-2xl"></i>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Donor Verification</h1>
                <p className="text-gray-600">Complete your registration to become a verified donor</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="glass-card p-6 mb-6 animation-fade-in">
          <div className="flex justify-between items-center max-w-3xl mx-auto">
            <div className="progress-step active flex-1 text-center">
              <div className="step-circle">1</div>
              <p className="text-sm mt-2 font-semibold text-gray-700">Personal Info</p>
            </div>
            <div className="h-1 flex-1 bg-gray-300 mx-2"></div>
            <div className="progress-step flex-1 text-center">
              <div className="step-circle">2</div>
              <p className="text-sm mt-2 font-semibold text-gray-500">Documents</p>
            </div>
            <div className="h-1 flex-1 bg-gray-300 mx-2"></div>
            <div className="progress-step flex-1 text-center">
              <div className="step-circle">3</div>
              <p className="text-sm mt-2 font-semibold text-gray-500">Review</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <div className="glass-card p-6 animation-fade-in mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <i className="fas fa-user mr-2 text-purple-600"></i>
                  Personal Information
                </h2>
                
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      placeholder="john.doe@example.com"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth *</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        required
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Type *</label>
                      <select
                        name="bloodType"
                        required
                        value={formData.bloodType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      >
                        <option value="">Select Blood Type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Gender *</label>
                      <select
                        name="gender"
                        required
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">ID Number *</label>
                    <input
                      type="text"
                      name="idNumber"
                      required
                      value={formData.idNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      placeholder="National ID / Driver's License / Passport"
                    />
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
                      placeholder="Street Address, City, State, ZIP Code"
                    ></textarea>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (kg) *</label>
                      <input
                        type="number"
                        name="weight"
                        required
                        value={formData.weight}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        placeholder="50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Last Donation Date</label>
                      <input
                        type="date"
                        name="lastDonation"
                        value={formData.lastDonation}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Upload */}
              <div className=" glass-card p-6 animation-fade-in mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <i className="fas fa-file-upload mr-2 text-purple-600"></i>
                  Document Upload
                </h2>

                <div className="space-y-4">
                  {/* ID Document */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Government Issued ID *
                    </label>
                    <div className="upload-area p-6 rounded-lg text-center cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload('idDocument', e.target.files?.[0] || null)}
                        className="hidden"
                        id="idUpload"
                      />
                      <label htmlFor="idUpload" className="cursor-pointer">
                        <i className="fas fa-cloud-upload-alt text-4xl text-purple-600 mb-2"></i>
                        <p className="text-gray-600 font-medium">Click to upload or drag and drop</p>
                        <p className="text-sm text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                      </label>
                    </div>
                    {files.idDocument.preview && (
                      <div className="mt-2 flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <i className="fas fa-file text-2xl text-blue-600"></i>
                          <div className="font-semibold text-gray-800 text-sm">{files.idDocument.preview}</div>
                        </div>
                        <button type="button" onClick={() => removeFile('idDocument')} className="text-red-600 hover:text-red-700 p-2">
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Medical Certificate */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Medical Certificate (Optional)
                    </label>
                    <div className="upload-area p-6 rounded-lg text-center cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload('medicalCert', e.target.files?.[0] || null)}
                        className="hidden"
                        id="medicalUpload"
                      />
                      <label htmlFor="medicalUpload" className="cursor-pointer">
                        <i className="fas fa-file-medical text-4xl text-purple-600 mb-2"></i>
                        <p className="text-gray-600 font-medium">Upload medical certificate</p>
                        <p className="text-sm text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                      </label>
                    </div>
                    {files.medicalCert.preview && (
                      <div className="mt-2 flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <i className="fas fa-file text-2xl text-blue-600"></i>
                          <div className="font-semibold text-gray-800 text-sm">{files.medicalCert.preview}</div>
                        </div>
                        <button type="button" onClick={() => removeFile('medicalCert')} className="text-red-600 hover:text-red-700 p-2">
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Recent Photograph *
                    </label>
                    <div className="upload-area p-6 rounded-lg text-center cursor-pointer">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload('photo', e.target.files?.[0] || null)}
                        className="hidden"
                        id="photoUpload"
                      />
                      <label htmlFor="photoUpload" className="cursor-pointer">
                        <i className="fas fa-camera text-4xl text-purple-600 mb-2"></i>
                        <p className="text-gray-600 font-medium">Upload your photo</p>
                        <p className="text-sm text-gray-500 mt-1">JPG, PNG (Max 2MB)</p>
                      </label>
                    </div>
                    {files.photo.preview && (
                      <div className="mt-2 flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <i className="fas fa-image text-2xl text-blue-600"></i>
                          <div className="font-semibold text-gray-800 text-sm">{files.photo.preview}</div>
                        </div>
                        <button type="button" onClick={() => removeFile('photo')} className="text-red-600 hover:text-red-700 p-2">
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div className="glass-card p-6 animation-fade-in mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <i className="fas fa-notes-medical mr-2 text-purple-600"></i>
                  Medical History
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Do you have any of the following conditions? *</label>
                    <div className="space-y-2">
                      {['HIV/AIDS', 'Hepatitis B or C', 'Heart Disease', 'Diabetes', 'None of the above'].map((condition) => (
                        <label key={condition} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.medicalConditions.includes(condition)}
                            onChange={() => handleCheckboxChange(condition)}
                            className="w-4 h-4 text-purple-600 rounded"
                          />
                          <span className="text-sm text-gray-700">{condition}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Medications (if any)</label>
                    <textarea
                      name="medications"
                      rows={3}
                      value={formData.medications}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      placeholder="List any medications you are currently taking"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Allergies (if any)</label>
                    <textarea
                      name="allergies"
                      rows={2}
                      value={formData.allergies}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                      placeholder="List any allergies"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Terms and Submit */}
              <div className="glass-card p-6 animation-fade-in">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-1 w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I certify that all information provided is accurate and complete. I understand that providing false information may result in rejection and legal consequences.
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="consent"
                      checked={consentAccepted}
                      onChange={(e) => setConsentAccepted(e.target.checked)}
                      className="mt-1 w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                    />
                    <label htmlFor="consent" className="text-sm text-gray-600">
                      I agree to be contacted by hospitals and blood banks for blood donation requests.
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
                        <i className="fas fa-paper-plane mr-2"></i>Submit Verification Request
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
                    <span className="text-sm text-gray-600">Pending</span>
                    <span className="text-2xl font-bold text-yellow-700">24</span>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Verified Today</span>
                    <span className="text-2xl font-bold text-green-700">12</span>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Donors</span>
                    <span className="text-2xl font-bold text-blue-700">156</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="glass-card p-6 animation-fade-in">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                <i className="fas fa-info-circle mr-2 text-blue-600"></i>
                Requirements
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <i className="fas fa-check text-green-600 mt-1"></i>
                  <span>Age: 18-65 years</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-check text-green-600 mt-1"></i>
                  <span>Weight: Minimum 50 kg</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-check text-green-600 mt-1"></i>
                  <span>Valid government ID</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-check text-green-600 mt-1"></i>
                  <span>Good health condition</span>
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
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Verification Submitted!</h3>
            <p className="text-gray-600 mb-4">Your donor verification request has been submitted successfully.</p>
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-700"><strong>Whats Next?</strong></p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1 text-left">
                <li>✓ Well review your documents within 24-48 hours</li>
                <li>✓ Youll receive an email notification</li>
                <li>✓ Check your dashboard for status updates</li>
              </ul>
            </div>
            <button onClick={closeModal} className="btn-primary py-3 px-8 rounded-lg font-semibold">
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}