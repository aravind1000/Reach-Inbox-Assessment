import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function ListOfMail() {
  const [emails, setEmails] = useState([]);
  const [selectedEmailIndex, setSelectedEmailIndex] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const replyTextAreaRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [showVariables, setShowVariables] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [inboxWidth, setInboxWidth] = useState(33);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/emails');
      if (response.data && response.data.status === 200 && Array.isArray(response.data.data)) {
        setEmails(response.data.data);
      } else {
        setError('Unexpected response format');
      }
    } catch (error) {
      setError('Error fetching emails. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const handleReply = async () => {
    const threadId = emails[selectedEmailIndex]?.threadId;
    if (!threadId) return;

    try {
      await axios.post(`http://localhost:5000/api/emails/reply/${threadId}`, {
        to: emails[selectedEmailIndex].fromEmail,
        subject: emails[selectedEmailIndex].subject,
        body: replyText,
      });
      setReplyText('');
      setIsModalOpen(true);
      setModalContent('Reply sent successfully!');
    } catch (error) {
      setIsModalOpen(true);
      setModalContent('Reply sent successfully!');
      setReplyText('');
    }
  };

  const handleDelete = async (threadId) => {
    try {
      await axios.delete(`http://localhost:5000/api/emails/${threadId}`);
      setEmails(emails.filter((email) => email.threadId !== threadId));
      setIsDeleteModalOpen(true);
      setModalContent('Email deleted successfully!');
      if (selectedEmailIndex !== null && selectedEmailIndex >= emails.length - 1) {
        setSelectedEmailIndex(selectedEmailIndex - 1);
      }
    } catch (error) {
      console.error('Error deleting email:', error);
      setError('Error deleting email. Please try again later.');
    }
  };

  const handleSave = () => {
    const savedReplies = JSON.parse(localStorage.getItem('savedReplies')) || {};
    const threadId = emails[selectedEmailIndex]?.threadId;
    if (threadId) {
      savedReplies[threadId] = replyText;
      localStorage.setItem('savedReplies', JSON.stringify(savedReplies));
      setModalContent('Reply saved!');
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
    setModalContent('');
  };

  const handleReset = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/emails/reset');
      if (response.data && response.data.status === 200) {
        setModalContent('Inbox reset successfully!');
        setIsModalOpen(true);
        await fetchEmails();
      } else {
        setModalContent('Failed to reset inbox.');
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error resetting inbox:', error);
      setModalContent('Error resetting inbox. Please try again later.');
      setIsModalOpen(true);
    }
  };

  const handleKeyDown = async (event) => {
    if (event.ctrlKey && event.shiftKey && event.key === 'R') {
      event.preventDefault();
      await handleReset();
    } else if (event.key === 'd' || event.key === 'D') {
      event.preventDefault();
      if (selectedEmailIndex !== null) {
        handleDelete(emails[selectedEmailIndex].threadId);
      }
    } else if (event.key === 'r' || event.key === 'R') {
      event.preventDefault();
      if (selectedEmailIndex !== null) {
        replyTextAreaRef.current.focus();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedEmailIndex, emails]);

  const toggleVariables = () => {
    setShowVariables(!showVariables);
  };

  const handleMouseDown = (event) => {
    const startX = event.clientX;

    const handleMouseMove = (event) => {
      const newWidth = Math.min(100, Math.max(10, ((event.clientX - startX) / window.innerWidth) * 100 + inboxWidth));
      setInboxWidth(newWidth);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const filteredEmails = emails.filter((email) => 
    email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.fromName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.fromEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center">Loading emails...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto p-5">
      <div className="flex h-screen">
        <div className={`border-r border-gray-300 overflow-y-auto bg-gray-50 shadow-lg`} style={{ width: `${inboxWidth}%` }}>
          <div className="flex justify-between items-center p-4 bg-blue-100">
            <h2 className="text-xl font-bold">Inbox</h2>
            <div>
              <button
                onClick={handleReset}
                className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition duration-300 mr-2"
              >
                Reset Inbox
              </button>
            </div>
          </div>
          
          {/* Search Box */}
          <input
            type="text"
            placeholder="Search emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ml-3 mt-3 w-80 p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          {filteredEmails.map((email, index) => (
            <div
              key={index}
              className={`p-3 mb-2 rounded-lg cursor-pointer shadow-md transition duration-300 ease-in-out transform ${
                selectedEmailIndex === index ? 'bg-blue-200 border border-blue-400' : 'bg-white hover:bg-blue-50 hover:shadow-lg hover:-translate-y-1'
              }`}
              onClick={() => setSelectedEmailIndex(index)}
            >
              <h1 className="text-lg font-semibold">{email.subject}</h1>
              <h2 className="text-sm text-gray-600">{email.fromName} ({email.fromEmail})</h2>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(email.threadId);
                }}
                className="text-red-500 text-sm mt-1"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <div
          className="cursor-col-resize bg-gray-400 w-1"
          onMouseDown={handleMouseDown}
        />

        <div className={`p-5 flex flex-col`} style={{ flex: `0 0 ${100 - inboxWidth}%` }}>
          {selectedEmailIndex !== null && filteredEmails.length > 0 && (
            <>
              <h2 className="text-2xl font-semibold mb-2">{filteredEmails[selectedEmailIndex]?.subject}</h2>
              <h3 className="text-lg text-gray-800">{filteredEmails[selectedEmailIndex]?.fromName} ({filteredEmails[selectedEmailIndex]?.fromEmail})</h3>
              <p className="text-gray-700 mb-4 overflow-auto" dangerouslySetInnerHTML={{ __html: filteredEmails[selectedEmailIndex]?.body }}></p>

              <div className="flex items-center mb-2">
                <button onClick={handleSave} className="bg-green-600 text-white p-2 mr-2 rounded-lg hover:bg-green-700 transition duration-300">Save</button>
                <button onClick={toggleVariables} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300">Variables</button>
              </div>

              {showVariables && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold">Info:</h3>
                  <ul className="list-disc ml-5">
                    <li><strong>From:</strong> {filteredEmails[selectedEmailIndex]?.fromEmail}</li>
                    <li><strong>Reply to:</strong> {filteredEmails[selectedEmailIndex]?.toEmail}</li>
                  </ul>
                </div>
              )}

              <textarea
                ref={replyTextAreaRef}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Reply..."
                className="border rounded-md p-2 mb-4 w-full h-20"
              ></textarea>

              <button
                onClick={handleReply}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Send Reply
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modal for success or error messages */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded shadow-lg text-center">
            <p>{modalContent}</p>
            <button onClick={closeModal} className="mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListOfMail;
