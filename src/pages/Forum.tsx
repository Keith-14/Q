import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, MessageCircle, Plus, Send, ArrowLeft, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
}

interface Post {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  likes: string[];
  comments: Comment[];
}

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

export const Forum = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      userId: 'user1',
      userName: 'Abdullah',
      content: 'Assalamu Alaikum everyone! Just wanted to share that I completed reading Surah Al-Kahf today. May Allah bless us all.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: ['user2', 'user3'],
      comments: [
        { id: 'c1', userId: 'user2', userName: 'Fatima', content: 'MashaAllah, may Allah reward you!', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) }
      ]
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Fatima',
      content: 'Looking for recommendations on good Islamic books for beginners. Any suggestions?',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      likes: ['user1'],
      comments: []
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Omar',
      content: 'Reminder: The last third of the night is the best time for dua. May Allah accept all our prayers.',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      likes: ['user1', 'user2', 'user4'],
      comments: [
        { id: 'c2', userId: 'user4', userName: 'Aisha', content: 'JazakAllah khair for the reminder!', timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000) }
      ]
    }
  ]);

  const [newPostContent, setNewPostContent] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState('');

  const currentUserId = user?.id || 'guest';
  const currentUserName = 'You';

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      userId: currentUserId,
      userName: currentUserName,
      content: newPostContent.trim(),
      timestamp: new Date(),
      likes: [],
      comments: []
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setIsCreateDialogOpen(false);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likes.includes(currentUserId);
        return {
          ...post,
          likes: isLiked
            ? post.likes.filter(id => id !== currentUserId)
            : [...post.likes, currentUserId]
        };
      }
      return post;
    }));
  };

  const handleAddComment = (postId: string) => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      userId: currentUserId,
      userName: currentUserName,
      content: newComment.trim(),
      timestamp: new Date()
    };

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, comment]
        };
      }
      return post;
    }));

    setNewComment('');
  };

  const PostCard = ({ post }: { post: Post }) => {
    const isLiked = post.likes.includes(currentUserId);

    return (
      <Card className="bg-card border-border shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-semibold text-sm">
                {post.userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-foreground">{post.userName}</p>
              <p className="text-xs text-muted-foreground">{formatTimeAgo(post.timestamp)}</p>
            </div>
          </div>

          <p className="text-foreground mb-4 leading-relaxed">{post.content}</p>

          <div className="flex items-center gap-4 pt-2 border-t border-border">
            <button
              onClick={() => handleLike(post.id)}
              className={cn(
                "flex items-center gap-2 text-sm transition-colors",
                isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
              )}
            >
              <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
              <span>{post.likes.length}</span>
            </button>

            <button
              onClick={() => setSelectedPost(post)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              <span>{post.comments.length}</span>
            </button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Comments View
  if (selectedPost) {
    return (
      <Layout>
        <div className="min-h-screen bg-background pb-24">
          <div className="px-4 pt-6">
            <button
              onClick={() => setSelectedPost(null)}
              className="flex items-center gap-2 text-muted-foreground mb-4"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>

            <PostCard post={selectedPost} />

            <div className="mt-4">
              <h3 className="font-semibold text-foreground mb-3">
                Comments ({selectedPost.comments.length})
              </h3>

              <div className="space-y-3">
                {selectedPost.comments.map(comment => (
                  <div key={comment.id} className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-semibold text-xs">
                          {comment.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-sm text-foreground">{comment.userName}</span>
                      <span className="text-xs text-muted-foreground">{formatTimeAgo(comment.timestamp)}</span>
                    </div>
                    <p className="text-sm text-foreground pl-9">{comment.content}</p>
                  </div>
                ))}

                {selectedPost.comments.length === 0 && (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 min-h-[44px] max-h-[120px] resize-none"
                />
                <Button
                  onClick={() => handleAddComment(selectedPost.id)}
                  disabled={!newComment.trim()}
                  size="icon"
                  className="h-11 w-11"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background pb-24">
        <div className="px-4 pt-6">
          <h1 className="text-2xl font-bold text-primary mb-6">Forum</h1>

          <div className="space-y-4">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* Floating Create Post Button */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="fixed bottom-24 right-4 h-14 w-14 rounded-full shadow-lg"
              size="icon"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share your thoughts with the community..."
                className="min-h-[120px] resize-none"
                maxLength={500}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {newPostContent.length}/500
                </span>
                <Button
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim()}
                >
                  Post
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};
