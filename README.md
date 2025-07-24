🚀 Working with the Repo
Now when working in this repo:

Frontend:
cd frontend
npm install
npm run dev  # or start


Backend:
cd backend
npm install
npm run dev  # e.g. with nodemon


package.json ( for control Front and Back)

// package.json in root
{
  "name": "my-app",
  "private": true,
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix backend\" \"npm run dev --prefix frontend\""
  },
  "devDependencies": {
    "concurrently": "^8.0.0"
  }
}

==============

npm install  # installs concurrently
npm run dev

