'use client'

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth'
import { getDataConnect, type DataConnect, type ConnectorConfig } from 'firebase/data-connect'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Must match dataconnect/dataconnect.yaml and dataconnect/default/connector.yaml.
export const dataConnectConfig: ConnectorConfig = {
  service: 'conand-cd515-service',
  location: 'europe-southwest1',
  connector: 'default',
}

let _app: FirebaseApp | null = null
let _auth: Auth | null = null
let _dc: DataConnect | null = null

export function getFirebaseApp(): FirebaseApp {
  if (_app) return _app
  _app = getApps().length ? getApp() : initializeApp(firebaseConfig)
  return _app
}

export function getFirebaseAuth(): Auth {
  if (_auth) return _auth
  _auth = getAuth(getFirebaseApp())
  return _auth
}

export function getFirebaseDataConnect(): DataConnect {
  if (_dc) return _dc
  _dc = getDataConnect(getFirebaseApp(), dataConnectConfig)
  return _dc
}

export { GoogleAuthProvider }
