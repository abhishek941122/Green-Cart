import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhooks } from './controllers/orderController.js';
const app = express();
const port = process.env.PORT || 4000;
await connectDB()
await connectCloudinary()

// allow Multiple origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://green-cart-client-ochre.vercel.app'
]

app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)

// Middleware configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.get('/', (req, res) => res.send("API is Working"));
app.use('/api/user', userRouter)
app.use('/api/seller', sellerRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`)
})