// ============================================================
//  Rosmar Soap — Firebase Configuration
//  Replace the placeholder values below with your actual
//  Firebase project credentials from the Firebase Console.
//  Console → Project Settings → Your Apps → SDK setup
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey:            "AIzaSyCq439iU04E-TqeQu0ImbDwoUec1Se5o2c",
  authDomain:        "rosmar-soap-ph.firebaseapp.com",
  projectId:         "rosmar-soap-ph",
  storageBucket:     "rosmar-soap-ph.firebasestorage.app",
  messagingSenderId: "52608885064",
  appId:             "1:52608885064:web:bb413636222ddee8ca137d"
};

const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);
const auth = getAuth(app);

// ── Admin whitelist ──────────────────────────────────────────
// Only these emails can access the admin panel.
const ADMIN_EMAILS = ['wardopon123@gmail.com'];

function isAdmin(user) {
  return user && ADMIN_EMAILS.includes(user.email?.toLowerCase());
}

export { app, db, auth, ADMIN_EMAILS, isAdmin };
