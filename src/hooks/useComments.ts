import { useState, useEffect } from 'react';
import apiService from '../services/api';
import { Comment } from '../types/api';

export const useComments = (modelName: string, objectId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await apiService.getComments(modelName, objectId);
      setComments(response.data || []);
      setError(null);
    } catch (err: any) {
      console.error('Comments fetch error:', err);
      setError('Failed to fetch comments');
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string) => {
    try {
      const response = await apiService.createComment(modelName, objectId, { content });
      setComments(prev => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      console.error('Add comment error:', err);
      throw err;
    }
  };

  const updateComment = async (commentId: string, content: string) => {
    try {
      const response = await apiService.updateComment(commentId, { content });
      setComments(prev => prev.map(c => c.id === commentId ? response.data : c));
      return response.data;
    } catch (err: any) {
      console.error('Update comment error:', err);
      throw err;
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      await apiService.deleteComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err: any) {
      console.error('Delete comment error:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (modelName && objectId) {
      fetchComments();
    }
  }, [modelName, objectId]);

  return {
    comments,
    loading,
    error,
    addComment,
    updateComment,
    deleteComment,
    refetch: fetchComments
  };
};

export const useComment = (commentId: string) => {
  const [comment, setComment] = useState<Comment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComment = async () => {
    try {
      setLoading(true);
      const response = await apiService.getComment(commentId);
      setComment(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Comment fetch error:', err);
      setError('Failed to fetch comment');
      setComment(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (commentId) {
      fetchComment();
    }
  }, [commentId]);

  return {
    comment,
    loading,
    error,
    refetch: fetchComment
  };
};