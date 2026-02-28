import axios from 'axios';

const API_URL = 'http://localhost:5000/api/documents/';

const uploadDocument = (file, token) => {
  const formData = new FormData();
  formData.append('document', file);

  return axios.post(API_URL + 'upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'x-auth-token': token
    }
  });
};

const documentService = {
  uploadDocument,
};

export default documentService;