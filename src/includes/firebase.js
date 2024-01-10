import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

//Firebase Configuration Data
const firebaseConfig = {
  apiKey: 'AIzaSyBS6oDHEhRYNvV-Hi3W4q3eHldnWCe-XCA',
  authDomain: 'music-cec96.firebaseapp.com',
  projectId: 'music-cec96',
  storageBucket: 'music-cec96.appspot.com',
  appId: '1:336860934776:web:a21cc36495e323e5cc338d'
}

//Initializing Firebase
firebase.initializeApp(firebaseConfig)

//Referencing the services
const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()

//PWA Configuration
db.enablePersistence().catch((error) => {
  console.log(`Firebase Persistence Error, ${error.code}`)
})

const usersCollection = db.collection('users')
const songsCollection = db.collection('songs')
const commentsCollection = db.collection('comments')

export { auth, db, usersCollection, songsCollection, commentsCollection, storage }
