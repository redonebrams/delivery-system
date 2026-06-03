import api from './api';

// Get all approved testimonials
export const getApprovedTestimonials = async () => {
  const response = await api.get('/testimonials/approved');
  return response.data.data;
};

// Get testimonial stats
export const getTestimonialStats = async () => {
  const response = await api.get('/testimonials/stats');
  return response.data.data;
};

// Get user's testimonials
export const getUserTestimonials = async () => {
  const response = await api.get('/testimonials/user/my-testimonials');
  return response.data.data;
};

// Submit new testimonial
export const submitTestimonial = async (rating, comment) => {
  const response = await api.post('/testimonials', {
    rating,
    comment
  });
  return response.data;
};

// Get all testimonials (admin)
export const getAllTestimonials = async () => {
  const response = await api.get('/testimonials/admin/all');
  return response.data.data;
};

// Update testimonial (admin)
export const updateTestimonial = async (id, { rating, comment, is_approved }) => {
  const response = await api.put(`/testimonials/${id}`, {
    rating,
    comment,
    is_approved
  });
  return response.data;
};

// Approve testimonial (admin)
export const approveTestimonial = async (id) => {
  const response = await api.patch(`/testimonials/${id}/approve`);
  return response.data;
};

// Reject testimonial (admin)
export const rejectTestimonial = async (id) => {
  const response = await api.patch(`/testimonials/${id}/reject`);
  return response.data;
};

// Delete testimonial (admin)
export const deleteTestimonial = async (id) => {
  const response = await api.delete(`/testimonials/${id}`);
  return response.data;
};
