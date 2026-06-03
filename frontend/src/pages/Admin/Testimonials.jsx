import React, { useEffect, useMemo, useState } from 'react';
import {
  getAllTestimonials,
  approveTestimonial,
  rejectTestimonial,
  deleteTestimonial,
  updateTestimonial
} from '../../services/testimonialService';
import AdminLayout from '../../components/Layout/AdminLayout';
import { FaCheckCircle, FaTimes, FaEdit, FaTrash, FaSpinner, FaStar } from 'react-icons/fa';
import './Testimonials.css';

const STATUS_LABELS = {
  all: 'Tous',
  pending: 'En attente',
  approved: 'Approuvé',
  rejected: 'Rejeté'
};

const STATUS_BADGES = {
  pending: 'bg-warning text-dark',
  approved: 'bg-success',
  rejected: 'bg-danger'
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllTestimonials();
      setTestimonials(data);
    } catch (err) {
      console.error('Error loading testimonials:', err);
      setError('Erreur lors du chargement des témoignages');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveTestimonial(id);
      setTestimonials(testimonials.map(t =>
        t.id === id ? { ...t, status: 'approved' } : t
      ));
    } catch (err) {
      alert('Erreur lors de l\'approbation du témoignage');
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Voulez-vous vraiment rejeter ce témoignage ?')) {
      try {
        await rejectTestimonial(id);
        setTestimonials(testimonials.map(t =>
          t.id === id ? { ...t, status: 'rejected' } : t
        ));
      } catch (err) {
        alert('Erreur lors du rejet du témoignage');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce témoignage?')) {
      try {
        await deleteTestimonial(id);
        setTestimonials(testimonials.filter(t => t.id !== id));
      } catch (err) {
        alert('Erreur lors de la suppression du témoignage');
      }
    }
  };

  const handleEdit = (testimonial) => {
    setEditingId(testimonial.id);
    setEditData({
      rating: testimonial.rating,
      comment: testimonial.comment,
      status: testimonial.status || 'pending'
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      await updateTestimonial(id, editData);
      setTestimonials(testimonials.map(t =>
        t.id === id ? { ...t, ...editData } : t
      ));
      setEditingId(null);
    } catch (err) {
      alert('Erreur lors de la mise à jour du témoignage');
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`star ${i < rating ? 'filled' : 'empty'}`}
        size={16}
      />
    ));
  };

  const filteredTestimonials = useMemo(() => {
    return testimonials.filter((testimonial) =>
      filterStatus === 'all' ? true : testimonial.status === filterStatus
    );
  }, [filterStatus, testimonials]);

  if (loading) {
    return (
      <AdminLayout title="Témoignages">
        <div className="testimonials-admin-loading">
          <FaSpinner className="spinner" size={32} />
          <p>Chargement des témoignages...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Témoignages">
      <div className="testimonials-admin-container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
          <div>
            <h2>Gestion des témoignages</h2>
            <p className="text-muted mb-0">Approuvez, rejetez, modifiez ou supprimez les avis clients.</p>
          </div>
          <div className="d-flex gap-2 align-items-center">
            <span className="badge bg-secondary py-2">{testimonials.length} au total</span>
            <select
              className="form-select form-select-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger mb-4">{error}</div>
        )}

        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Client</th>
                <th>Email</th>
                <th>Note</th>
                <th>Commentaire</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTestimonials.length > 0 ? (
                filteredTestimonials.map((testimonial) => (
                  <tr key={testimonial.id}>
                    <td><strong>{testimonial.nom} {testimonial.prenom}</strong></td>
                    <td>{testimonial.email}</td>
                    <td>
                      {editingId === testimonial.id ? (
                        <select
                          className="form-control form-control-sm"
                          value={editData.rating}
                          onChange={(e) => setEditData({ ...editData, rating: parseInt(e.target.value) })}
                        >
                          {[1, 2, 3, 4, 5].map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      ) : (
                        <div className="rating-display">
                          {renderStars(testimonial.rating)}
                        </div>
                      )}
                    </td>
                    <td>
                      {editingId === testimonial.id ? (
                        <textarea
                          className="form-control form-control-sm"
                          value={editData.comment}
                          onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
                          rows="2"
                        />
                      ) : (
                        <small>{testimonial.comment.substring(0, 80)}{testimonial.comment.length > 80 ? '...' : ''}</small>
                      )}
                    </td>
                    <td>
                      {editingId === testimonial.id ? (
                        <select
                          className="form-control form-control-sm"
                          value={editData.status}
                          onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                        >
                          <option value="pending">En attente</option>
                          <option value="approved">Approuvé</option>
                          <option value="rejected">Rejeté</option>
                        </select>
                      ) : (
                        <span className={`badge ${STATUS_BADGES[testimonial.status] || 'bg-secondary'}`}>
                          {STATUS_LABELS[testimonial.status] || 'Inconnu'}
                        </span>
                      )}
                    </td>
                    <td><small>{new Date(testimonial.created_at).toLocaleDateString('fr-FR')}</small></td>
                    <td>
                      <div className="btn-group btn-group-sm" role="group">
                        {editingId === testimonial.id ? (
                          <>
                            <button
                              className="btn btn-success"
                              onClick={() => handleSaveEdit(testimonial.id)}
                              title="Enregistrer"
                            >
                              <FaCheckCircle />
                            </button>
                            <button
                              className="btn btn-secondary"
                              onClick={() => setEditingId(null)}
                              title="Annuler"
                            >
                              <FaTimes />
                            </button>
                          </>
                        ) : (
                          <>
                            {testimonial.status !== 'approved' && (
                              <button
                                className="btn btn-primary"
                                onClick={() => handleApprove(testimonial.id)}
                                title="Approuver"
                              >
                                <FaCheckCircle />
                              </button>
                            )}
                            {testimonial.status !== 'rejected' && (
                              <button
                                className="btn btn-danger"
                                onClick={() => handleReject(testimonial.id)}
                                title="Rejeter"
                              >
                                <FaTimes />
                              </button>
                            )}
                            <button
                              className="btn btn-warning"
                              onClick={() => handleEdit(testimonial)}
                              title="Modifier"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(testimonial.id)}
                              title="Supprimer"
                            >
                              <FaTrash />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <div className="text-muted">Aucun témoignage correspondant à ce filtre.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Testimonials;
