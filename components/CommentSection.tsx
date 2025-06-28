'use client'

import { useState, useEffect } from 'react'

interface Comment {
  id: string
  text: string
  timestamp: string
  likes: number
  dislikes: number
  userReactions?: {
    like?: boolean
    dislike?: boolean
  }
}

interface CommentSectionProps {
  newsId: string
}

export default function CommentSection({ newsId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isPosting, setIsPosting] = useState(false)

  useEffect(() => {
    // ローカルストレージからコメントを読み込み
    const storedComments = localStorage.getItem(`comments_${newsId}`)
    if (storedComments) {
      setComments(JSON.parse(storedComments))
    }
  }, [newsId])

  const saveComments = (updatedComments: Comment[]) => {
    localStorage.setItem(`comments_${newsId}`, JSON.stringify(updatedComments))
    setComments(updatedComments)
  }

  const postComment = () => {
    if (!newComment.trim() || isPosting) return

    setIsPosting(true)
    
    const comment: Comment = {
      id: Date.now().toString(),
      text: newComment,
      timestamp: new Date().toISOString(),
      likes: 0,
      dislikes: 0
    }

    const updatedComments = [comment, ...comments]
    saveComments(updatedComments)
    setNewComment('')
    setIsPosting(false)
  }

  const handleReaction = (commentId: string, type: 'like' | 'dislike') => {
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        const userReactions = comment.userReactions || {}
        const wasLiked = userReactions.like
        const wasDisliked = userReactions.dislike

        if (type === 'like') {
          return {
            ...comment,
            likes: wasLiked ? comment.likes - 1 : comment.likes + 1 + (wasDisliked ? 0 : 0),
            dislikes: wasDisliked ? comment.dislikes - 1 : comment.dislikes,
            userReactions: {
              like: !wasLiked,
              dislike: false
            }
          }
        } else {
          return {
            ...comment,
            dislikes: wasDisliked ? comment.dislikes - 1 : comment.dislikes + 1 + (wasLiked ? 0 : 0),
            likes: wasLiked ? comment.likes - 1 : comment.likes,
            userReactions: {
              like: false,
              dislike: !wasDisliked
            }
          }
        }
      }
      return comment
    })

    saveComments(updatedComments)
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}日前`
    if (hours > 0) return `${hours}時間前`
    if (minutes > 0) return `${minutes}分前`
    return 'たった今'
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-2xl font-bold mb-6 text-white flex items-center">
        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
          <div className="w-4 h-4 bg-white rounded-sm"></div>
        </div>
        匿名掲示板
      </h3>

      {/* 投稿フォーム */}
      <div className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="好きなこと書いてええで（匿名やから誰か分からへんで）"
          className="w-full p-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:border-purple-500"
          rows={3}
          maxLength={500}
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-400">
            {newComment.length}/500文字
          </span>
          <button
            onClick={postComment}
            disabled={!newComment.trim() || isPosting}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              !newComment.trim() || isPosting
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            投稿
          </button>
        </div>
      </div>

      {/* コメント一覧 */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            まだコメントないで。最初の1人になってや！
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-gray-400">
                  匿名さん・{formatTime(comment.timestamp)}
                </span>
              </div>
              
              <p className="text-white mb-3 whitespace-pre-wrap break-words">
                {comment.text}
              </p>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleReaction(comment.id, 'like')}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${
                    comment.userReactions?.like
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
                  }`}
                >
                  <div className="w-4 h-4 bg-white/20 rounded-sm"></div>
                  <span className="text-sm font-medium">{comment.likes}</span>
                </button>
                
                <button
                  onClick={() => handleReaction(comment.id, 'dislike')}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${
                    comment.userReactions?.dislike
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
                  }`}
                >
                  <div className="w-4 h-4 bg-white/20 rounded-sm"></div>
                  <span className="text-sm font-medium">{comment.dislikes}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {comments.length > 0 && (
        <p className="text-xs text-gray-500 text-center mt-6">
          ※このコメント欄は完全匿名です。誰が書いたか一切分かりません。
        </p>
      )}
    </div>
  )
}