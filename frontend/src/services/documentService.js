import axios from 'axios';

const API_URL = 'http://localhost:5000/api/documents/';

const uploadDocument = (file, token) => {
  const formData = new FormData();
  formData.append('document', file); // 'document' must match the backend's field name

  return axios.post(API_URL + 'upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'x-auth-token': token // Sending the token for protected routes
    }
  });
};

const documentService = {
  uploadDocument,
};

export default documentService;