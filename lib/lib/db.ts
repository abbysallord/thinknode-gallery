import fs from 'fs';
import path from 'path';

const DATA_DIR = 'c:/Users/Dhanush/agronova/data'; // path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Types
export interface Order {
    id: string;
    buyerEmail: string;
    sellerVpa: string; // The "Seller" ID in this context
    amount: number;
    items: any[];
    status: 'PENDING_BUYER' | 'PENDING_SELLER' | 'VERIFIED' | 'FAILED' | 'DISPUTED';
    createdAt: string;
    tries: number;
    buyerUpiIndex?: string; // Captured from Buyer Input
    shippingAddress: string;
}

export interface Strike {
    id: string;
    date: string;
    reason: string;
    orderId: string;
    active: boolean; // If false, it was removed/forgiven
}

export interface User {
    email: string; // or UPI ID
    name?: string;
    role?: string;
    strikes: Strike[];
    status: 'CLEAR' | 'YELLOW' | 'RED' | 'BLACK';
    followers?: string[];
    following?: string[];
}

// Helpers
function readJSON<T>(file: string, defaultValue: T): T {
    if (!fs.existsSync(file)) return defaultValue;
    try {
        const data = fs.readFileSync(file, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return defaultValue;
    }
}

function writeJSON(file: string, data: any) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// --- Orders API ---

export const dbOrders = {
    getAll: () => readJSON<Order[]>(ORDERS_FILE, []),
    
    getById: (id: string) => {
        const orders = readJSON<Order[]>(ORDERS_FILE, []);
        return orders.find(o => o.id === id);
    },

    create: (order: Order) => {
        const orders = readJSON<Order[]>(ORDERS_FILE, []);
        orders.push(order);
        writeJSON(ORDERS_FILE, orders);
        return order;
    },

    update: (id: string, updates: Partial<Order>) => {
        const orders = readJSON<Order[]>(ORDERS_FILE, []);
        const index = orders.findIndex(o => o.id === id);
        if (index === -1) return null;
        
        orders[index] = { ...orders[index], ...updates };
        writeJSON(ORDERS_FILE, orders);
        return orders[index];
    }
};

// --- Users API (Malpractice) ---

export const dbUsers = {
    getAll: () => readJSON<User[]>(USERS_FILE, []),

    get: (email: string) => {
        const users = readJSON<User[]>(USERS_FILE, []);
        return users.find(u => u.email === email);
    },

    // Add or Get User (Safe Create)
    ensure: (userData: Partial<User> & { email: string }) => {
        const users = readJSON<User[]>(USERS_FILE, []);
        let user = users.find(u => u.email === userData.email);
        if (!user) {
            user = { 
                email: userData.email, 
                strikes: [], 
                status: 'CLEAR',
                name: userData.name || userData.email.split('@')[0], 
                role: userData.role || 'Farmer',
                followers: userData.followers || [],
                following: userData.following || []
            } as any; // Cast to avoid strict type issues with extended fields if User interface isn't fully updated yet (I updated it previously but name/role might be missing in Interface?)
            // Actually I need to add name/role to User Interface too? yes.
            users.push(user);
            writeJSON(USERS_FILE, users);
        }
        return user;
    },

    addStrike: (email: string, reason: string, orderId: string) => {
        const users = readJSON<User[]>(USERS_FILE, []);
        const index = users.findIndex(u => u.email === email);
        
        if (index === -1) {
            // Create user if not exists
            const newUser: User = { 
                email, 
                strikes: [{ id: Date.now().toString(), date: new Date().toISOString(), reason, orderId, active: true }], 
                status: 'CLEAR' // Will update below
            };
            users.push(newUser);
            // Recalculate status
            updateUserStatus(newUser);
            writeJSON(USERS_FILE, users);
            return newUser;
        }

        const user = users[index];
        user.strikes.push({ id: Date.now().toString(), date: new Date().toISOString(), reason, orderId, active: true });
        updateUserStatus(user);
        writeJSON(USERS_FILE, users);
        return user;
    },

    removeStrike: (email: string, strikeId: string) => {
         const users = readJSON<User[]>(USERS_FILE, []);
         const user = users.find(u => u.email === email);
         if (!user) return null;

         const strike = user.strikes.find(s => s.id === strikeId);
         if (strike) {
             strike.active = false; // Soft delete
             updateUserStatus(user);
             writeJSON(USERS_FILE, users);
         }
         return user;
    }
};

function updateUserStatus(user: User) {
    const activeStrikes = user.strikes.filter(s => s.active).length;
    if (activeStrikes === 0) user.status = 'CLEAR';
    else if (activeStrikes === 1) user.status = 'YELLOW';
    else if (activeStrikes === 2) user.status = 'RED';
    else if (activeStrikes >= 3) user.status = 'BLACK';
}

// --- Community API ---

// --- Community API ---

const POSTS_FILE = path.join(DATA_DIR, 'posts.json');

export interface Comment {
    id: string;
    userEmail: string;
    userName: string;
    text: string;
    date: string;
}

export interface Post {
    id: string;
    userEmail: string; // Author
    userName: string;
    userRole: string; // Farmer/Admin
    content: string;
    image?: string; // Base64 or URL
    likes: string[]; // List of user emails who liked
    comments: Comment[];
    date: string;
}

export const dbPosts = {
    getAll: () => {
        const posts = readJSON<Post[]>(POSTS_FILE, []);
        return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },

    create: (post: Omit<Post, 'id' | 'likes' | 'comments' | 'date'>) => {
        const posts = readJSON<Post[]>(POSTS_FILE, []);
        console.log(`[DB] Creating post. Current count: ${posts.length}`);
        const newPost: Post = {
            ...post,
            id: Date.now().toString(),
            likes: [],
            comments: [],
            date: new Date().toISOString()
        };
        posts.push(newPost);
        writeJSON(POSTS_FILE, posts);
        console.log(`[DB] Post created. New count: ${posts.length}`);
        return newPost;
    },

    toggleLike: (postId: string, userEmail: string) => {
        const posts = readJSON<Post[]>(POSTS_FILE, []);
        const post = posts.find(p => p.id === postId);
        if (!post) return null;

        const idx = post.likes.indexOf(userEmail);
        if (idx === -1) {
            post.likes.push(userEmail);
        } else {
            post.likes.splice(idx, 1);
        }
        writeJSON(POSTS_FILE, posts);
        return post;
    },

    addComment: (postId: string, comment: Omit<Comment, 'id' | 'date'>) => {
        const posts = readJSON<Post[]>(POSTS_FILE, []);
        const post = posts.find(p => p.id === postId);
        if (!post) return null;

        const newComment: Comment = {
            ...comment,
            id: Date.now().toString(),
            date: new Date().toISOString()
        };
        post.comments.push(newComment);
        writeJSON(POSTS_FILE, posts);
        return newComment;
    },

    deleteComment: (postId: string, commentId: string, userEmail: string) => {
        const posts = readJSON<Post[]>(POSTS_FILE, []);
        const post = posts.find(p => p.id === postId);
        if (!post) return null;

        const commentIdx = post.comments.findIndex(c => c.id === commentId);
        if (commentIdx === -1) return null;

        const comment = post.comments[commentIdx];
        const isCommentOwner = comment.userEmail.toLowerCase().trim() === userEmail.toLowerCase().trim();
        const isPostOwner = post.userEmail.toLowerCase().trim() === userEmail.toLowerCase().trim();

        if (!isCommentOwner && !isPostOwner) return null; // Unauthorized

        post.comments.splice(commentIdx, 1);
        writeJSON(POSTS_FILE, posts);
        return post;
    },

    delete: (postId: string, userEmail: string) => {
        const safeEmail = userEmail?.toLowerCase().trim();
        console.log(`[DB] Request Delete Post ${postId} by ${safeEmail}`);
        
        let posts = readJSON<Post[]>(POSTS_FILE, []);
        const post = posts.find(p => p.id === postId);
        
        if (!post) {
            console.log(`[DB] Post ${postId} not found.`);
            return false;
        }

        const postOwner = post.userEmail?.toLowerCase().trim();
        console.log(`[DB] Found Post. Owner: ${postOwner}, Requestor: ${safeEmail}`);

        if (postOwner !== safeEmail) {
            console.log(`[DB] Unauthorized delete attempt.`);
            return false;
        }
        
        posts = posts.filter(p => p.id !== postId);
        console.log(`[DB] Writing ${posts.length} posts to file.`);
        writeJSON(POSTS_FILE, posts);
        return true;
    },

    edit: (postId: string, userEmail: string, newContent: string) => {
        const posts = readJSON<Post[]>(POSTS_FILE, []);
        const post = posts.find(p => p.id === postId);
        if (!post || post.userEmail.toLowerCase().trim() !== userEmail.toLowerCase().trim()) return null;

        post.content = newContent;
        writeJSON(POSTS_FILE, posts);
        return post;
    }
};

// --- Social & Messages API ---

const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

export interface Message {
    id: string;
    sender: string;
    receiver: string;
    content: string;
    timestamp: string;
    read: boolean;
    reactions?: Record<string, string>;
    replyToId?: string;
    edited?: boolean;
}

export const dbSocial = {
    toggleFollow: (userEmail: string, targetEmail: string) => {
        const users = readJSON<User[]>(USERS_FILE, []);
        const user = users.find(u => u.email === userEmail);
        const target = users.find(u => u.email === targetEmail);
        
        if (!user || !target) return false;

        if (!user.following) user.following = [];
        if (!target.followers) target.followers = [];

        const idx = user.following.indexOf(targetEmail);
        if (idx === -1) {
            user.following.push(targetEmail);
            target.followers.push(userEmail);
        } else {
            user.following.splice(idx, 1);
            const tIdx = target.followers.indexOf(userEmail);
            if (tIdx !== -1) target.followers.splice(tIdx, 1);
        }

        writeJSON(USERS_FILE, users);
        return true;
    },

    getMessages: (userEmail: string) => {
        let msgs = readJSON<Message[]>(MESSAGES_FILE, []);
        
        // Auto-Delete > 24h
        const now = Date.now();
        const ONE_DAY = 24 * 60 * 60 * 1000;
        // const ONE_DAY = 2 * 60 * 1000; // Debug: 2 mins
        const initialLen = msgs.length;
        msgs = msgs.filter(m => (now - new Date(m.timestamp).getTime()) < ONE_DAY);
        if (msgs.length !== initialLen) writeJSON(MESSAGES_FILE, msgs);

        return msgs.filter(m => m.sender === userEmail || m.receiver === userEmail)
                   .sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    },

    sendMessage: (sender: string, receiver: string, content: string, replyToId?: string) => {
        const msgs = readJSON<Message[]>(MESSAGES_FILE, []);
        const newMsg: Message = {
            id: Date.now().toString(),
            sender,
            receiver,
            content,
            timestamp: new Date().toISOString(),
            read: false,
            reactions: {},
            replyToId
        };
        msgs.push(newMsg);
        writeJSON(MESSAGES_FILE, msgs);
        return newMsg;
    },

    deleteMessage: (msgId: string, userEmail: string) => {
        let msgs = readJSON<Message[]>(MESSAGES_FILE, []);
        const msg = msgs.find(m => m.id === msgId);
        // Allow sender or receiver to delete? Usually only sender deletes for everyone.
        if (!msg || msg.sender !== userEmail) return false;

        msgs = msgs.filter(m => m.id !== msgId);
        writeJSON(MESSAGES_FILE, msgs);
        return true;
    },

    editMessage: (msgId: string, userEmail: string, newContent: string) => {
        const msgs = readJSON<Message[]>(MESSAGES_FILE, []);
        const msg = msgs.find(m => m.id === msgId);
        if (!msg || msg.sender !== userEmail) return null;

        msg.content = newContent;
        msg.edited = true;
        writeJSON(MESSAGES_FILE, msgs);
        return msg;
    },

    reactMessage: (msgId: string, userEmail: string, emoji: string) => {
        const msgs = readJSON<Message[]>(MESSAGES_FILE, []);
        const msg = msgs.find(m => m.id === msgId);
        if (!msg) return null;

        if (!msg.reactions) msg.reactions = {};
        if (msg.reactions[userEmail] === emoji) delete msg.reactions[userEmail];
        else msg.reactions[userEmail] = emoji;
        
        writeJSON(MESSAGES_FILE, msgs);
        return msg;
    }
};
