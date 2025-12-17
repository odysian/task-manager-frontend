import { Loader2, MessageSquareOff } from 'lucide-react'; // Icons for loading/empty states
import { useCallback, useEffect, useState } from 'react';
import api from '../api'; // Your centralized API handler
import CommentForm from './CommentForm'; // For adding NEW comments
import CommentItem from './CommentItem'; // For displaying EXISTING comments

function CommentsSection({ taskId }) {
  const [comments, setComments] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  // FUNCTION: Go get the data
  const fetchComments = useCallback(async () => {
    setLoading(true); // Turn on spinner
    try {
      const response = await api.get(`/tasks/${taskId}/comments`);
      setComments(response.data); // Save the data
      setError(''); // Clear any old errors
    } catch (err) {
      console.error('Failed to load comments:', err);
      setError('Failed to load conversation.');
    } finally {
      setLoading(false); // Turn off spinner (success or fail)
    }
  }, [taskId]); // Re-create this function only if taskId changes

  // EFFECT: Run the fetch function when the component mounts
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleAddComment = async (content) => {
    try {
      const response = await api.post(`/tasks/${taskId}/comments`, { content });

      // STATE UPDATE: Add the new comment to the START of the array
      // [newComment, ...oldComments]
      setComments((prev) => [response.data, ...prev]);

      return true; // Tell the form "Success! You can clear the text box now."
    } catch (err) {
      console.error('Failed to post comment:', err);
      throw err; // Tell the form "Failure! Keep the text box open."
    }
  };

  const handleDeleteComment = async (commentId) => {
    // 1. Snapshot: Remember the list before we delete, just in case
    const previousComments = [...comments];

    // 2. Optimistic Update: Remove it from the UI immediately
    setComments(comments.filter((c) => c.id !== commentId));

    try {
      // 3. API Call: Tell server to delete
      await api.delete(`/comments/${commentId}`);
    } catch (err) {
      // 4. Rollback: If server failed, put the list back how it was
      console.error('Failed to delete comment:', err);
      setComments(previousComments);
      alert('Failed to delete comment');
    }
  };

  const handleUpdateComment = async (commentId, newContent) => {
    try {
      const response = await api.patch(`/comments/${commentId}`, {
        content: newContent,
      });

      // Map through the list:
      // If ID matches, use the new data (response.data).
      // If not, keep the old data (c).
      setComments(
        comments.map((c) => (c.id === commentId ? response.data : c))
      );
    } catch (err) {
      console.error('Failed to update comment:', err);
      throw err;
    }
  };

  return (
    <div className="mt-6 pt-6 border-t border-zinc-800/50">
      {/* 1. Header with Count */}
      <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">
        Discussion ({comments.length})
      </h4>

      {/* 2. The Input Form (Top of list, like modern apps) */}
      <div className="mb-6">
        <CommentForm onSubmit={handleAddComment} />
      </div>

      {/* 3. Loading Spinner (Centered) */}
      {loading && (
        <div className="flex justify-center py-4">
          <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
        </div>
      )}

      {/* 4. Error Message */}
      {error && (
        <div className="text-red-400 text-xs text-center py-2">{error}</div>
      )}

      {/* 5. Empty State (Only show if not loading and no error) */}
      {!loading && comments.length === 0 && !error && (
        <div className="text-center py-8 text-zinc-600 flex flex-col items-center">
          <MessageSquareOff className="w-8 h-8 mb-2 opacity-50" />
          <p className="text-sm">No comments yet. Start the conversation!</p>
        </div>
      )}

      {/* 6. The List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id} // Critical for React performance!
            comment={comment}
            onDelete={handleDeleteComment}
            onUpdate={handleUpdateComment}
          />
        ))}
      </div>
    </div>
  );
}

export default CommentsSection;
