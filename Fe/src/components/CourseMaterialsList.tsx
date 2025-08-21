import React, { useState, useEffect } from 'react';
import { FileText, Image, Video, Youtube, Trash2, Download, ExternalLink } from 'lucide-react';
import { api, API_BASE_URL } from '../services/api';

interface CourseMaterial {
  id: number;
  course_id: number;
  title: string;
  description: string;
  type: 'image' | 'pdf' | 'video' | 'youtube';
  file_path: string;
  youtube_url: string;
  created_at: string;
  updated_at: string;
}

interface CourseMaterialsListProps {
  courseId: number;
  isTeacher?: boolean;
  onRefresh?: () => void;
}

const CourseMaterialsList: React.FC<CourseMaterialsListProps> = ({ 
  courseId, 
  isTeacher = false, 
  onRefresh 
}) => {
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMaterials = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/courses/${courseId}/materials`);
      
      if (response.data && response.data.success) {
        setMaterials(response.data.materials || []);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load materials');
      console.error('Error loading materials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, [courseId]);

  const handleDelete = async (materialId: number) => {
    if (!window.confirm('Are you sure you want to delete this material?')) {
      return;
    }

    try {
      const response = await api.delete(`/api/materials/${materialId}`);
      
      if (response.data.success) {
        setMaterials(materials.filter(m => m.id !== materialId));
        if (onRefresh) {
          onRefresh();
        }
      }
    } catch (error: any) {
      console.error('Error deleting material:', error);
      alert('Failed to delete material');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image size={20} color="#3b82f6" />;
      case 'pdf':
        return <FileText size={20} color="#ef4444" />;
      case 'video':
        return <Video size={20} color="#10b981" />;
      case 'youtube':
        return <Youtube size={20} color="#ef4444" />;
      default:
        return <FileText size={20} color="#6b7280" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'image':
        return 'Image';
      case 'pdf':
        return 'PDF';
      case 'video':
        return 'Video';
      case 'youtube':
        return 'YouTube';
      default:
        return 'File';
    }
  };

  const handleMaterialClick = (material: CourseMaterial) => {
    if (material.type === 'youtube') {
      window.open(material.youtube_url, '_blank');
    } else if (material.file_path) {
      window.open(`${API_BASE_URL}${material.file_path}`, '_blank');
    }
  };

  const renderMaterialPreview = (material: CourseMaterial) => {
    if (material.type === 'image' && material.file_path) {
      return (
        <img 
          src={`${API_BASE_URL}${material.file_path}`}
          alt={material.title}
          style={{
            width: '100%',
            height: '120px',
            objectFit: 'cover',
            borderRadius: '6px',
            marginBottom: '8px'
          }}
        />
      );
    } else if (material.type === 'youtube') {
      // Extract YouTube video ID for thumbnail
      const videoId = material.youtube_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
      if (videoId) {
        return (
          <div style={{ position: 'relative', marginBottom: '8px' }}>
            <img 
              src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
              alt={material.title}
              style={{
                width: '100%',
                height: '120px',
                objectFit: 'cover',
                borderRadius: '6px'
              }}
            />
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              borderRadius: '50%',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Youtube size={24} color="white" />
            </div>
          </div>
        );
      }
    }
    
    return (
      <div style={{
        height: '120px',
        backgroundColor: '#f3f4f6',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '8px'
      }}>
        {getTypeIcon(material.type)}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#6b7280', margin: 0 }}>Loading materials...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        padding: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <p style={{ color: '#dc2626', fontSize: '14px', margin: 0 }}>{error}</p>
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px 20px',
        color: '#6b7280'
      }}>
        <FileText size={48} color="#d1d5db" style={{ marginBottom: '16px' }} />
        <p style={{ fontSize: '16px', margin: 0 }}>No materials available yet</p>
        {isTeacher && (
          <p style={{ fontSize: '14px', margin: '8px 0 0 0' }}>
            Add some materials to help your students learn!
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {materials.map((material) => (
          <div 
            key={material.id}
            style={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              overflow: 'hidden',
              transition: 'box-shadow 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
            onClick={() => handleMaterialClick(material)}
          >
            {renderMaterialPreview(material)}
            
            <div style={{ padding: '12px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  {getTypeIcon(material.type)}
                  <span style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    fontWeight: '500'
                  }}>
                    {getTypeLabel(material.type)}
                  </span>
                </div>
                
                {isTeacher && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(material.id);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Trash2 size={16} color="#ef4444" />
                  </button>
                )}
              </div>
              
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                margin: '0 0 4px 0',
                lineHeight: '1.4'
              }}>
                {material.title}
              </h4>
              
              {material.description && (
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  margin: '0 0 8px 0',
                  lineHeight: '1.4',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {material.description}
                </p>
              )}
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '8px'
              }}>
                <span style={{
                  fontSize: '11px',
                  color: '#9ca3af'
                }}>
                  {new Date(material.created_at).toLocaleDateString()}
                </span>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  color: '#3b82f6'
                }}>
                  {material.type === 'youtube' ? (
                    <>
                      <ExternalLink size={12} />
                      Watch
                    </>
                  ) : (
                    <>
                      <Download size={12} />
                      Open
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseMaterialsList;