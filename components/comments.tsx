
// 确保这是一个客户端组件，因为它使用了 React Hooks
'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { GameComment } from '@/types/game';

interface CommentsProps {
  pageTitle?: string;
  className?: string;
  gameId?: string; // 特定游戏的评论，可选
}

export function Comments({ 
  pageTitle = 'Comments',
  className = '',
  gameId
}: CommentsProps) {
  const [comments, setComments] = useState<GameComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState({ 
    nickname: '', 
    email: '', 
    content: '',
    ratingScore: undefined as number | undefined
  });
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  // 加载评论
  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 构建查询参数
      const params = new URLSearchParams({
        limit: '20'
      });
      
      if (gameId) {
        params.append('gameId', gameId);
      }
      
      const response = await fetch(`/api/comments?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setComments(data.data);
      } else {
        setComments([]);
        setError(data.error || 'No comments found');
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
      setError(error instanceof Error ? error.message : 'Failed to load comments');
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  // 提交评论
  const submitComment = async () => {
    if (!newComment.nickname.trim() || !newComment.content.trim()) {
      alert('Please fill in nickname and comment content');
      return;
    }

    try {
      setSubmitting(true);
      
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment.content,
          nickname: newComment.nickname,
          email: newComment.email || undefined,
          gameId: gameId || undefined,
          ratingScore: newComment.ratingScore || undefined,
        }),
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setNewComment({ 
          nickname: '', 
          email: '', 
          content: '',
          ratingScore: undefined
        });
        setShowSuccessMessage(true);
        // 5秒后隐藏成功消息
        setTimeout(() => setShowSuccessMessage(false), 5000);
        await loadComments(); // 重新加载评论
      } else {
        alert(result.error || 'Failed to submit comment');
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
      alert('Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
          }
        });
      },
      {
        rootMargin: '50px', // 提前50px开始加载
        threshold: 0.1
      }
    );

    const currentRef = componentRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      loadComments();
    }
  }, [gameId, isVisible, loadComments]); // 添加gameId和isVisible依赖 

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div ref={componentRef} className={`mt-8 ${className}`} id="comments">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-theme-heading font-semibold text-primary mb-1">
          Discuss: {pageTitle}
        </h2>
        <p className="text-secondary text-sm font-theme-body">
          Share your thoughts and connect with other players
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="px-4">
          {/* Comment Form */}
          <div className="mb-6 bg-theme-dark-700 p-4 rounded-lg border border-theme-dark-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <label htmlFor="nickname" className="block text-xs font-theme-body font-medium text-secondary mb-1">
                  Nickname *
                </label>
                <input
                  type="text"
                  id="nickname"
                  value={newComment.nickname}
                  onChange={(e) => setNewComment(prev => ({ ...prev, nickname: e.target.value }))}
                  className="w-full px-3 py-2 text-sm bg-theme-dark-800 border border-theme-dark-600 rounded-md text-primary font-theme-body"
                  placeholder="Your nickname"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-theme-body font-medium text-secondary mb-1">
                  Email (optional)
                </label>
                <input
                  type="email"
                  id="email"
                  value={newComment.email}
                  onChange={(e) => setNewComment(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 text-sm bg-theme-dark-800 border border-theme-dark-600 rounded-md text-primary font-theme-body"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            {/* 评分功能 */}
            <div className="mb-3">
              <label className="block text-xs font-theme-body font-medium text-secondary mb-1">
                Rate this {gameId ? 'game' : 'page'} (optional)
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setNewComment(prev => ({ 
                      ...prev, 
                      ratingScore: prev.ratingScore === rating ? undefined : rating 
                    }))}
                    className={`w-6 h-6 ${
                      newComment.ratingScore && newComment.ratingScore >= rating
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    } hover:text-yellow-400 transition-colors`}
                  >
                    <svg
                      className="w-full h-full"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
                {newComment.ratingScore && (
                  <span className="ml-2 text-xs text-secondary font-theme-body">
                    {newComment.ratingScore} star{newComment.ratingScore !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="content" className="block text-xs font-theme-body font-medium text-secondary mb-1">
                Comment *
              </label>
              <textarea
                id="content"
                value={newComment.content}
                onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 text-sm bg-theme-dark-800 border border-theme-dark-600 rounded-md resize-vertical text-primary font-theme-body"
                placeholder="Share your thoughts..."
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={submitComment}
                disabled={submitting}
                className="px-4 py-2 text-sm bg-theme-fire-500 text-white font-theme-body font-medium rounded-md hover:bg-theme-fire-600 focus:ring-2 focus:ring-theme-fire-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Comment'}
              </button>
            </div>
            
            {/* Success Message */}
            {showSuccessMessage && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <p className="text-xs font-medium text-green-800">
                      Comment submitted successfully! Your comment will be visible after admin approval.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {!isVisible ? (
              <div className="text-center py-6">
                <div className="inline-block h-6 w-6 border-b-2 border-gray-300 rounded-full"></div>
                <p className="mt-2 text-sm text-gray-600">Comments will load when visible...</p>
              </div>
            ) : loading ? (
              <div className="text-center py-6">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                <p className="mt-2 text-sm text-gray-600">Loading comments...</p>
              </div>
            ) : error ? (
              <div className="text-center py-6">
                <p className="text-red-600 mb-2 text-sm">Error loading comments: {error}</p>
                <button 
                  onClick={loadComments}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <p className="text-sm">No approved comments yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-gray-500 mb-3">
                  Showing {comments.length} approved comment{comments.length !== 1 ? 's' : ''}
                </p>
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium text-xs">
                            {comment.nickname.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900 text-sm">{comment.nickname}</span>
                          {comment.ratingScore && (
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  className={`w-3 h-3 ${
                                    star <= comment.ratingScore! ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          )}
                          <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
                        {comment.helpfulVotes > 0 && (
                          <div className="mt-1 text-xs text-gray-500">
                            👍 {comment.helpfulVotes} helpful
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

