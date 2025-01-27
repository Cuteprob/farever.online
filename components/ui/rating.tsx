"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

export interface RatingProps {
  initialRating?: number;
  totalVotes?: number;
  onRate?: (rating: number) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  isReadOnly?: boolean;
  showReviewSystem?: boolean;
}

interface ReviewFormData {
  name: string;
  email: string;
  comment: string;
  rating: number;
}

export function Rating({ 
  initialRating = 4.8, 
  totalVotes = 234, 
  onRate, 
  className, 
  size = "md",
  isReadOnly = false,
  showReviewSystem = false
}: RatingProps) {
  const [rating, setRating] = useState<number>(0)
  const [hoveredRating, setHoveredRating] = useState<number>(0)
  const [hasVoted, setHasVoted] = useState(false)
  const [currentRating, setCurrentRating] = useState(initialRating)
  const [currentVotes, setCurrentVotes] = useState(totalVotes)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [formData, setFormData] = useState<ReviewFormData>({
    name: '',
    email: '',
    comment: '',
    rating: 0
  })

  const handleRate = (value: number) => {
    if (!hasVoted && !isReadOnly) {
      setRating(value)
      setHasVoted(true)
      onRate?.(value)

      const newTotalVotes = currentVotes + 1
      const newRating = ((currentRating * currentVotes) + value) / newTotalVotes
      
      setCurrentVotes(newTotalVotes)
      setCurrentRating(Number(newRating.toFixed(1)))
    }
  }

  const renderStar = (position: number) => {
    const filled = isReadOnly ? currentRating >= position : (hasVoted ? rating : hoveredRating) >= position

    return (
      <button
        key={position}
        className={cn(
          "transition-all duration-300 transform",
          !isReadOnly && !hasVoted && "cursor-pointer hover:scale-125",
          "disabled:cursor-default group",
          {
            'w-6 h-6': size === 'sm',
            'w-8 h-8': size === 'md',
            'w-10 h-10': size === 'lg',
          }
        )}
        disabled={hasVoted || isReadOnly}
        onClick={() => handleRate(position)}
        onMouseEnter={() => !isReadOnly && !hasVoted && setHoveredRating(position)}
        onMouseLeave={() => !isReadOnly && !hasVoted && setHoveredRating(0)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className={cn(
            "transition-all duration-300 drop-shadow-md",
            filled ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" : 
                    "fill-muted-foreground/20 text-muted-foreground/20 group-hover:fill-yellow-400/50 group-hover:text-yellow-400/50",
            !isReadOnly && !hasVoted && "group-hover:drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]",
          )}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
          />
        </svg>
      </button>
    )
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()

    setReviewSubmitted(true)
    setFormData({
      name: '',
      email: '',
      comment: '',
      rating: 0
    })
  }

  const ratingDisplay = (
    <div className="flex items-center gap-6">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(renderStar)}
      </div>
      {!isReadOnly && (
        <div className="flex items-center gap-3 text-sm font-mono bg-card/50 px-4 py-2 rounded-full border border-border/50 shadow-sm">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-yellow-400 drop-shadow-[0_0_3px_rgba(250,204,21,0.3)]">{currentRating}</span>
            <span className="text-muted-foreground/30">/</span>
            <span className="text-muted-foreground">5</span>
          </div>
          <span className="text-muted-foreground/30">•</span>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground font-medium">{currentVotes.toLocaleString()}</span>
            <span className="text-muted-foreground/70">votes</span>
          </div>
        </div>
      )}
    </div>
  )

  if (!showReviewSystem) {
    return (
      <div className={cn(
        "flex items-center",
        {
          'text-sm': size === 'sm',
          'text-base': size === 'md',
          'text-lg': size === 'lg',
        },
        className
      )}>
        {ratingDisplay}
      </div>
    )
  }

  return (
    <div className={cn(
      "flex flex-col gap-8 w-full max-w-2xl",
      {
        'text-sm': size === 'sm',
        'text-base': size === 'md',
        'text-lg': size === 'lg',
      },
      className
    )}>
      {ratingDisplay}
      
      {!isReadOnly && (
        <>
          {reviewSubmitted ? (
            <div className="text-sm text-yellow-400 text-center p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-yellow-400/20 shadow-[0_0_15px_rgba(250,204,21,0.1)]">
              Thank you for your review! It will be displayed after moderation.
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-5 bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50 shadow-lg">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                <input
                  type="text"
                  required
                  className="block w-full rounded-xl border border-border/50 shadow-sm focus:border-yellow-400/50 focus:ring focus:ring-yellow-400/20 bg-background/50 text-foreground placeholder-muted-foreground/50 px-4 py-2.5 transition-all duration-300"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  required
                  className="block w-full rounded-xl border border-border/50 shadow-sm focus:border-yellow-400/50 focus:ring focus:ring-yellow-400/20 bg-background/50 text-foreground placeholder-muted-foreground/50 px-4 py-2.5 transition-all duration-300"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Review</label>
                <textarea
                  required
                  rows={4}
                  className="block w-full rounded-xl border border-border/50 shadow-sm focus:border-yellow-400/50 focus:ring focus:ring-yellow-400/20 bg-background/50 text-foreground placeholder-muted-foreground/50 px-4 py-2.5 transition-all duration-300"
                  value={formData.comment}
                  onChange={(e) => setFormData({...formData, comment: e.target.value})}
                  placeholder="Share your thoughts about the game..."
                />
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-8 py-2.5 text-sm font-heading font-medium text-white bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-yellow-400/20 focus:ring-2 focus:ring-yellow-400/20 active:scale-95"
                >
                  Submit Review
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  )
}
