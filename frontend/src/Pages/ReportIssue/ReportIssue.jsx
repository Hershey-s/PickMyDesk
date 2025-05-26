import React, { useState } from 'react';
import { AlertTriangle, Upload, Send, CheckCircle } from 'lucide-react';

const ReportIssue = () => {
  const [formData, setFormData] = useState({
    issueType: '',
    priority: 'medium',
    subject: '',
    description: '',
    email: '',
    phone: '',
    bookingId: '',
    workspaceId: ''
  });
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const issueTypes = [
    { value: 'booking', label: 'Booking Problem' },
    { value: 'payment', label: 'Payment Issue' },
    { value: 'workspace', label: 'Workspace Quality' },
    { value: 'technical', label: 'Technical Problem' },
    { value: 'safety', label: 'Safety Concern' },
    { value: 'billing', label: 'Billing Dispute' },
    { value: 'other', label: 'Other' }
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low - General inquiry', color: 'text-green-600' },
    { value: 'medium', label: 'Medium - Standard issue', color: 'text-yellow-600' },
    { value: 'high', label: 'High - Urgent problem', color: 'text-orange-600' },
    { value: 'critical', label: 'Critical - Emergency', color: 'text-red-600' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true);
      setIsSubmitting(false);
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Issue Reported Successfully</h1>
            <p className="text-gray-600 mb-6">
              Thank you for reporting this issue. We've received your report and assigned it ticket #PMD-{Math.floor(Math.random() * 10000)}.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-2">What happens next?</h3>
              <ul className="text-left text-gray-600 space-y-1">
                <li>• You'll receive an email confirmation within 5 minutes</li>
                <li>• Our team will review your issue within 2 hours</li>
                <li>• We'll contact you with updates via email or phone</li>
                <li>• Critical issues are escalated immediately</li>
              </ul>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    issueType: '',
                    priority: 'medium',
                    subject: '',
                    description: '',
                    email: '',
                    phone: '',
                    bookingId: '',
                    workspaceId: ''
                  });
                  setAttachments([]);
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
              >
                Report Another Issue
              </button>
              <a
                href="/"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Report an Issue</h1>
          <p className="text-xl text-gray-600">
            Help us improve PickMyDesk by reporting any problems you encounter
          </p>
        </div>

        {/* Emergency Notice */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 mr-3" />
            <div>
              <h3 className="font-semibold text-red-800">Emergency Issues</h3>
              <p className="text-red-700 text-sm">
                For urgent safety concerns or issues affecting your current booking, 
                call our emergency hotline: <strong>+91 98765 43210</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Report Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Issue Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Type *
              </label>
              <select
                name="issueType"
                value={formData.issueType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select issue type</option>
                {issueTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level *
              </label>
              <div className="space-y-2">
                {priorityLevels.map((level) => (
                  <label key={level.value} className="flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      value={level.value}
                      checked={formData.priority === level.value}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <span className={`font-medium ${level.color}`}>
                      {level.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                placeholder="Brief description of the issue"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={5}
                placeholder="Please provide as much detail as possible about the issue, including steps to reproduce it..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your.email@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Reference Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking ID (if applicable)
                </label>
                <input
                  type="text"
                  name="bookingId"
                  value={formData.bookingId}
                  onChange={handleInputChange}
                  placeholder="e.g., PMD-12345"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workspace ID (if applicable)
                </label>
                <input
                  type="text"
                  name="workspaceId"
                  value={formData.workspaceId}
                  onChange={handleInputChange}
                  placeholder="e.g., WS-67890"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* File Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments (Screenshots, documents, etc.)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-2">
                  Drag and drop files here, or click to select
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept="image/*,.pdf,.doc,.docx"
                />
                <label
                  htmlFor="file-upload"
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 cursor-pointer inline-block"
                >
                  Choose Files
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Max 5MB per file. Supported: Images, PDF, DOC, DOCX
                </p>
              </div>
              
              {/* Attachment List */}
              {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Issue Report
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
