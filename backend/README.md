MobileFoods Backend (Express + Google Maps)

Setup

- Node 18+
- Create .env with GOOGLE_MAPS_API_KEY=...
- npm ci
- npm run dev

Endpoints

- GET /api/geocode?query=paris
- GET /api/places/nearby?lat=48.8566&lng=2.3522&radius=1500&keyword=burger
- GET /api/places/details?id=ChIJN1t_tDeuEmsRUsoyG83frY4

Deploy (Render)

- New Web Service → root: backend
- Start command: npm start
- Env: GOOGLE_MAPS_API_KEY, NODE_ENV=production
