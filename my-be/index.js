import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import generateUsername from './functions/generateUsername.js'; 
import cors from 'cors';
import prisma from './functions/prisma.js';
import session from 'express-session';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = [process.env.FRONTEND_URL || "http://localhost:3000" , "https://mgit.vercel.app" , "https://mgitunofficial.vercel.app"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, 
  })
);
const port = 3114;

const server = http.createServer(app);

const wss = new WebSocketServer({ server });
let clients = new Set(); 

wss.on("connection", (ws) => {
  console.log("New WebSocket client connected");
  clients.add(ws);

  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === "new_message") {
        // Create a new chat message in the database
        const newMessage = await prisma.chatMessage.create({
          data: {
            content: data.content,
            sender: data.sender || 'Guest',
          },
        });

        // Broadcast the message to all connected clients
        clients.forEach((client) => {
          if (client.readyState === ws.OPEN) {
            client.send(JSON.stringify({ 
              type: "new_message", 
              message: newMessage 
            }));
          }
        });
      }
    } catch (error) {
      console.error("WebSocket message error:", error);
    }
  });

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
    clients.delete(ws);
  });
});

app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 3600000 }, 
  })
);

app.get('/chat/messages', async (req, res) => {
    console.log("Request received at /chat/messages endpoint");
    const messages = await prisma.chatMessage.findMany({
        orderBy: {
            createdAt: "desc",
        },
        take: 300,
    });
    const sortedMessages = messages.sort((a, b) => a.createdAt - b.createdAt);
    res.json(sortedMessages);
});

app.post('/admin/login', (req, res) => {
console.log("Request received at /admin/login");
const { password } = req.body;

if (password === process.env.ADMIN_PASSWORD) {
    req.session.admin = true; 
    res.json({ success: true, message: "Logged in successfully" });
} else {
    res.json({ success: false, message: "Incorrect password" });
}
});

app.get('/admin/check', (req, res) => {
console.log("Request received at /admin/check");
if (req.session.admin) {
    res.json({ loggedIn: true });
} else {
    res.json({ loggedIn: false });
}
});

app.get('/admin/logout', (req, res) => {
req.session.destroy((err) => {
    if (err) {
    return res.status(500).json({ message: "Logout failed" });
    }
    res.json({ success: true, message: "Logged out successfully" });
});
});

app.get('/', async (req, res) => {
   res.send('Hello World!');
});

app.get('/dis/change/date/:id', async (req, res) => {
    console.log("Request received at /dis/change/date/:id endpoint");
    const { id } = req.params;
    const discussion = await prisma.discussion.findUnique({
        where: {
            id,
        },
        include: {
            replies: true,
        },
    });
    discussion.updatedAt = new Date();
    await prisma.discussion.update({
        where: {
            id,
        },
        data: {
            updatedAt: discussion.updatedAt,
        },
    });
    res.json(discussion);
});

app.get('/getusername', (req, res) => {
    console.log("Request received at /getusername endpoint");
    const randomUsername = generateUsername();
    res.json({ username: randomUsername });
});

app.post('/discussion/create', async (req, res) => {
    console.log("Request received at /postdiscussion endpoint");
    const { title, content, category , guestName } = req.body;
    const newDiscussion = await prisma.discussion.create({
        data: {
            title,
            content,
            category,
            guestName,
        },
    });
    res.json({id:newDiscussion.id});
});

app.post('/discussion/details', async (req, res) => {
    console.log("Request received at /discussion/" + req.body.id + " endpoint");
    const { id } = req.body;
    //console.log(id);
    const discussion = await prisma.discussion.findUnique({
        where: {
            id,
        },
        include: {
            replies: true,
        },
    });
    res.json(discussion);
});

app.post('/discussion/like', async (req, res) => {
    console.log("Request received at /discussion/" + req.body.id + "/like endpoint");
    const { id , event} = req.body;
    const discussion = await prisma.discussion.findUnique({
        where: {
            id,
        },
        include: {
            replies: true,
        },
    });

    if(event === "like"){
        discussion.likes++;
    }
    else if(event === "unlike"){
        discussion.likes--;
    }
    await prisma.discussion.update({
        where: {
            id,
        },
        data: {
            likes: discussion.likes,
        },
    });
    res.json(discussion);
});

app.post('/discussion/reply', async (req, res) => {
  console.log("Request received at /discussion/" + req.body.id + "/reply endpoint");
  const { discussionId, content, guestName , parentReplyId } = req.body;

  console.log(req.body);

  if(!parentReplyId){
    try {
        // Create a new reply
        const newReply = await prisma.reply.create({
            data: {
                content,
                guestName,
                discussion: {
                    connect: { id: discussionId }, 
                },
            },
        });

        const updatedDiscussion = await prisma.discussion.findUnique({
            where: { id: discussionId },
            include: { replies: true },
        });

        res.json(updatedDiscussion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
  }else{
    try {
      const newReply = await prisma.reply.create({
        data: {
          content,
          guestName,
          discussion: {
            connect: { id: discussionId }, 
          },
          parentReply: {
            connect: { id: parentReplyId }, 
          },
        },
      });

      const updatedDiscussion = await prisma.discussion.findUnique({
        where: { id: discussionId },
        include: { replies: true },
      });
      res.json(updatedDiscussion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
  }
});

app.post('/reply/like', async (req, res) => {
  console.log("Request received at /reply/" + req.body.id + "/like endpoint");
  
  const { id, event } = req.body;

  const reply = await prisma.reply.findUnique({
      where: { id },
  });

  if (!reply) {
      return res.status(404).json({ error: "Reply not found" });
  }

  let newLikes = reply.likes;
  if (event === "like") {
      newLikes++;
  } else if (event === "dislike") {
      newLikes--;
  }

  const updatedReply = await prisma.reply.update({
      where: { id },
      data: { likes: newLikes },
  });

  res.json(updatedReply);
});

app.get("/discussions/recent", async (req, res) => {
    console.log("hitting recent discussions")
    const recentDiscussions = await prisma.discussion.findMany({
        orderBy: {
            createdAt: "asc",
        },
        take: 6,
    });

    res.json(recentDiscussions);
});

app.post("/discussion/category", async (req, res) => {
    const { category, sortBy, timeRange } = req.body;

    const whereCondition = { category };

    if (timeRange && timeRange !== "all-time") {
        const now = new Date();
        let dateFilter;

        if (timeRange === "today") {
            dateFilter = new Date(now.setHours(0, 0, 0, 0));
        } else if (timeRange === "this-week") {
            dateFilter = new Date(now.setDate(now.getDate() - 7));
        } else if (timeRange === "this-month") {
            dateFilter = new Date(now.setMonth(now.getMonth() - 1));
        }

        whereCondition.createdAt = { gte: dateFilter };
    }

    const orderBy = {};
    if (sortBy === "latest") {
        orderBy.createdAt = "desc";
    } else if (sortBy === "popular") {
        orderBy.views = "desc";
    } else if (sortBy === "unanswered") {
        orderBy.replies = "asc";
    }

    const discussions = await prisma.discussion.findMany({
        where: whereCondition,
        orderBy,
        take: 10,
        include:{
          replies: true
        }
    });

    res.json(discussions);
});

app.get('/discussion/category-stats', async (req, res) => {
    console.log("Request received to fetch discussion category statistics.");

    try {
        const discussions = await prisma.discussion.findMany({
            include: {
                replies: true,
            },
        });

        const categoryStats = discussions.reduce((acc, discussion) => {
            const category = discussion.category || "Uncategorized";

            if (!acc[category]) {
                acc[category] = { threads: 0, messages: 0 };
            }

            acc[category].threads += 1; 
            acc[category].messages += discussion.replies.length;

            return acc;
        }, {});

        res.json(categoryStats);
    } catch (error) {
        console.error("Error fetching category statistics:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
