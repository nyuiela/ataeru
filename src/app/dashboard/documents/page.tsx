'use client';

import { useState, useEffect } from 'react';

interface Document {
  id: string;
  name: string;
  type: 'license' | 'certification' | 'insurance' | 'permit' | 'other';
  status: 'verified' | 'pending' | 'rejected';
  dateUploaded: string;
  expiryDate?: string;
  fileSize: string;
  fileUrl: string;
  verificationDetails?: {
    verifiedBy: string;
    verifiedDate: string;
    transactionHash?: string;
  };
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'verified' | 'pending'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch the documents from your backend
    // For now, we'll use mock data
    const fetchDocuments = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDocuments([
        {
          id: '1',
          name: 'Medical Facility License',
          type: 'license',
          status: 'verified',
          dateUploaded: '2023-06-15',
          expiryDate: '2024-06-15',
          fileSize: '1.2 MB',
          fileUrl: '/documents/license.pdf',
          verificationDetails: {
            verifiedBy: 'State Medical Board',
            verifiedDate: '2023-06-20',
            transactionHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f',
          },
        },
        {
          id: '2',
          name: 'Reproductive Medicine Certification',
          type: 'certification',
          status: 'verified',
          dateUploaded: '2023-05-10',
          expiryDate: '2025-05-10',
          fileSize: '2.5 MB',
          fileUrl: '/documents/certification.pdf',
          verificationDetails: {
            verifiedBy: 'American Society for Reproductive Medicine',
            verifiedDate: '2023-05-15',
            transactionHash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f',
          },
        },
        {
          id: '3',
          name: 'Liability Insurance',
          type: 'insurance',
          status: 'pending',
          dateUploaded: '2023-11-05',
          expiryDate: '2024-11-05',
          fileSize: '3.1 MB',
          fileUrl: '/documents/insurance.pdf',
        },
        {
          id: '4',
          name: 'Stem Cell Research Permit',
          type: 'permit',
          status: 'rejected',
          dateUploaded: '2023-09-12',
          fileSize: '1.8 MB',
          fileUrl: '/documents/permit.pdf',
        },
        {
          id: '5',
          name: 'Staff Qualifications',
          type: 'other',
          status: 'verified',
          dateUploaded: '2023-07-24',
          fileSize: '5.4 MB',
          fileUrl: '/documents/staff.pdf',
          verificationDetails: {
            verifiedBy: 'LifeSpring Verification Team',
            verifiedDate: '2023-07-28',
            transactionHash: '0x7e6f5d4c3b2a1c0b9a8b7c6d5e4f3a2b1c0d',
          },
        },
      ]);
      setIsLoading(false);
    };

    fetchDocuments();
  }, []);

  const filteredDocuments = activeTab === 'all' 
    ? documents 
    : documents.filter(doc => doc.status === activeTab);

  const handleUploadDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setIsUploading(true);
    
    // In a real app, you would upload the file to your backend
    // For now, we'll simulate the upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create a new document object
    const newDocument: Document = {
      id: Math.random().toString(36).substring(2, 11),
      name: file.name,
      type: 'other',
      status: 'pending',
      dateUploaded: new Date().toISOString().split('T')[0],
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      fileUrl: URL.createObjectURL(file),
    };
    
    setDocuments([newDocument, ...documents]);
    setIsUploading(false);
    
    // Reset file input
    e.target.value = '';
  };

  const getIconForDocumentType = (type: Document['type']) => {
    switch (type) {
      case 'license':
        return (
          <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
          </svg>
        );
      case 'certification':
        return (
          <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'insurance':
        return (
          <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'permit':
        return (
          <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
          </svg>
        );
      default:
        return (
          <svg className="h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  return (
    <div>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Hospital Documents</h1>
        <div className="mt-3 flex sm:mt-0 sm:ml-4">
          <label
            htmlFor="file-upload"
            className={`ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Document
              </>
            )}
          </label>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            onChange={handleUploadDocument}
            disabled={isUploading}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('all')}
            className={`${
              activeTab === 'all'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            All Documents
            <span className="ml-2 py-0.5 px-2.5 text-xs font-medium rounded-full bg-gray-100 text-gray-900">
              {documents.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('verified')}
            className={`${
              activeTab === 'verified'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Verified
            <span className="ml-2 py-0.5 px-2.5 text-xs font-medium rounded-full bg-green-100 text-green-900">
              {documents.filter(doc => doc.status === 'verified').length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`${
              activeTab === 'pending'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Pending Verification
            <span className="ml-2 py-0.5 px-2.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-900">
              {documents.filter(doc => doc.status === 'pending').length}
            </span>
          </button>
        </nav>
      </div>

      {/* Documents List */}
      {isLoading ? (
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      ) : filteredDocuments.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {getIconForDocumentType(doc.type)}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium text-gray-900 truncate">{doc.name}</h3>
                    <p className="text-sm text-gray-500">
                      Uploaded {new Date(doc.dateUploaded).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <span 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${doc.status === 'verified' ? 'bg-green-100 text-green-800' : 
                          doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`}
                    >
                      {doc.status === 'verified' ? 'Verified' : 
                       doc.status === 'pending' ? 'Pending' : 'Rejected'}
                    </span>
                  </div>
                </div>
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{doc.fileSize}</span>
                    {doc.expiryDate && (
                      <span 
                        className={`${
                          new Date(doc.expiryDate) < new Date() 
                            ? 'text-red-600' 
                            : 'text-gray-500'
                        }`}
                      >
                        Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                {doc.status === 'verified' && doc.verificationDetails && (
                  <div className="mt-3 bg-green-50 p-3 rounded-md">
                    <h4 className="text-xs font-semibold text-green-800">BLOCKCHAIN VERIFIED</h4>
                    <p className="mt-1 text-xs text-green-800">
                      Verified by {doc.verificationDetails.verifiedBy} on{' '}
                      {new Date(doc.verificationDetails.verifiedDate).toLocaleDateString()}
                    </p>
                    {doc.verificationDetails.transactionHash && (
                      <p className="mt-1 text-xs text-green-800 break-all">
                        <span className="font-medium">TX:</span> {doc.verificationDetails.transactionHash}
                      </p>
                    )}
                  </div>
                )}
                <div className="mt-4 flex space-x-3">
                  <a 
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="-ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </a>
                  {doc.status === 'pending' && (
                    <button
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg className="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                      </svg>
                      Submit for Verification
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center py-12">
          <svg className="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-4 text-gray-500 text-lg">No documents found in this category.</p>
          <label
            htmlFor="empty-file-upload"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Your First Document
          </label>
          <input
            id="empty-file-upload"
            name="empty-file-upload"
            type="file"
            className="sr-only"
            onChange={handleUploadDocument}
            disabled={isUploading}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
        </div>
      )}

      {/* Information Section */}
      <div className="mt-10 bg-blue-50 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900">Document Verification</h3>
            <p className="mt-2 text-sm text-gray-600">
              Documents can be verified on the blockchain for authenticity. This is especially important for medical records and certifications. You&apos;ll receive verification confirmation within 24-48 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
