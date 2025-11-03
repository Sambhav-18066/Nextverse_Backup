// IMPORTANT: This file should only be used in server-side code.
// It is not intended for use in client-side code.
import 'dotenv/config';
import { initializeApp, getApps, App, cert, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let app: App;

function getApp(): App {
  if (getApps().length) {
    return getApps()[0];
  }

  // Check if running in a deployed App Hosting environment
  if (process.env.APP_HOSTING_CONFIG) {
    // initializeApp() discovers credentials automatically in App Hosting
    app = initializeApp();
  } else {
    // Not in App Hosting, so use a service account for local development
    let serviceAccount: ServiceAccount | undefined;
    try {
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      }
    } catch (e) {
      console.error('Error parsing FIREBASE_SERVICE_ACCOUNT:', e);
      throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not a valid JSON string.');
    }
    
    if (!serviceAccount) {
      throw new Error(
        'FIREBASE_SERVICE_ACCOUNT environment variable is not set. ' +
        'Please provide a service account for local development.'
      );
    }

    app = initializeApp({
      credential: cert(serviceAccount),
    });
  }

  return app;
}


export const getFirebaseAdmin = () => {
  const adminApp = getApp();
  return {
    auth: getAuth(adminApp),
    db: getFirestore(adminApp),
  };
};
