import express       from 'express';
import session       from 'express-session';
import authRoutes    from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import teamsRoutes   from './routes/teams.js';
import newsRoutes    from './routes/news.js';

const app = express();

app.use((req, res, next) => {
    const now = new Date();
    const timestamp = now.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    console.log(timestamp, '::', req.method, req.path);
    next();
});
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV == 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/news', newsRoutes);

export default app;
