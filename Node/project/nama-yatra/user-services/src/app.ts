import express, { type Application, type Request, type  Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import errorHandler from './middleware/errorHandler';
import corsHandler from './middleware/corsHandler';
import requestLoggerHandler from './middleware/requestHandler';
import  authRoutes  from './routes/auth.routes';


const app:Application = express();

// Middleware
app.use(helmet());
app.use(corsHandler);
app.use(requestLoggerHandler);
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", authRoutes);
    
app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to User Services API");
});

app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString(), uptime: process.uptime() });
});

//Error handling middleware
// app.use((err: Error, req: Request, res: Response, next: Function) => {
//     console.error(err.stack);
//     res.status(500).json({ error: "Internal Server Error" });
// });

app.use(errorHandler);

export default app;
