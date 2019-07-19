/**
 * External dependencies
 */
import * as firebase from 'firebase';
import Expo from 'expo';
import {Google} from 'expo';
import Rebase from 're-base';

/**
 * Initialize a Firebase instance
 */
const firebaseConfig = {
	apiKey: "AIzaSyBGt-n0ZOdbVfph7nwrzzx5Yth7uJR4eHI",
	authDomain: "locus-d80a9.firebaseapp.com",
	databaseURL: "https://locus-d80a9.firebaseio.com",
	projectId: "locus-d80a9",
	storageBucket: "",
	messagingSenderId: "380731318846",
	appId: "1:380731318846:web:6ba151faefb447f1"
};
export const firebaseInit = () => {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
}

export const app = firebase.initializeApp(firebaseConfig);
export const base = Rebase.createClass(app.database());

/**
 * Set Firebase's authentication persistence
 *
 * @param  {Function} onSuccess
 * @param  {Function} onError
 *
 * @return {Void}
 */
export const authPersist = (onSuccess, onError) =>
  firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(onSuccess)
    .catch(onError);

/**
 * Sign up with email and password using Firebase
 *
 * @param  {String}   email
 * @param  {String}   password
 * @param  {Function} onSuccess
 * @param  {Function} onError
 *
 * @return {Void}
 */
export const authSignUp = (email, firstName, lastName, password, onSuccess, onError) =>
  authPersist(_ =>
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        // Returned result api
        // https://firebase.google.com/docs/reference/js/firebase.auth.html#usercredential
        console.log('Successfully created user account');
        // console.log(result);

        firebase
          .database()
          .ref('/users/' + result.user.uid)
          .set({
            email: result.user.email,
            // profile_picture: 'null',
            first_name: firstName,
            last_name: lastName,
            created_at: Date.now()
          })
          .then(function (snapshot) {
            console.log('Saved in DB');
          });
        onSuccess()
      })
      .catch(onError)
  );

/**
 * Login with email and password using Firebase
 *
 * @param  {String}   email
 * @param  {String}   password
 * @param  {Function} onSuccess
 * @param  {Function} onError
 *
 * @return {Void}
 */
export const authLogin = (email, password, onSuccess, onError) =>
  authPersist(_ =>
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(onSuccess)
      .catch(onError)
  );

/**
 * Detect Firebase's authentication status
 *
 * @param  {Function} onSuccess
 *
 * @return {Void}
 */
export const authDetect = onSuccess =>
  firebase.auth().onAuthStateChanged(user => onSuccess(user));

/**
 * Sign out using Firebase
 *
 * @param  {Function} onSuccess
 * @param  {Function} onError
 *
 * @return {Void}
 */
export const authSignOut = (onSuccess, onError) =>
  firebase
    .auth()
    .signOut()
    .then(onSuccess)
    .catch(onError);

/**
 * Delete user from Firebase
 *
 * @param  {Function} onSuccess
 * @param  {Function} onError
 *
 * @return {Void}
 */
export const authDelete = (onSuccess, onError) => {
  const user = firebase.auth().currentUser;

  user.delete()
    .then(onSuccess)
    .catch(onError);
};

/**
 * Send password reset email using Firebase
 *
 * @param  {String}   email
 * @param  {Function} onSuccess
 * @param  {Function} onError
 *
 * @return {Void}
 */
export const sendPasswordResetEmail = (email, onSuccess, onError) =>
  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(onSuccess)
    .catch(onError);

/**
 * Login with Google and keep the session in Firebase
 *
 * @param  {Function} onSuccess
 * @param  {Function} onError
 *
 * @return {Void}
 */
export const authWithGoogle = async (onSuccess, onError) => {
  // prettier-ignore
  const iosClientId = '343870794487-0nk4il84fncvh7tu0ua62nkhbv75glsp.apps.googleusercontent.com';

  // prettier-ignore
  const androidCliendId = '<ANDROID_CLIENT_ID>';

  try {
    const result = await Google.logInAsync({
      behaviour: 'web',
      // androidCliendId,
      iosClientId: iosClientId,
      scopes: ['profile', 'email']
    });

    if (result.type === 'success') {
      onGoogleSignIn(result);
      onSuccess();
      // const {idToken, accessToken} = result;
      // const credential = firebase.auth.GoogleAuthProvider.credential(
      //   idToken,
      //   accessToken
      // );

      // firebase
      //   .auth()
      //   .signInAndRetrieveDataWithCredential(credential)
      //   .then(onSuccess)
      //   .catch(onError);
    } else {
      onError({
        cancelled: true
      });
    }
  } catch (error) {
    onError(error);
  }
};

const onGoogleSignIn = (googleUser) => {
  console.log('Google Auth Response', googleUser);
  console.log('test');
  // We need to register an Observer on Firebase Auth to make sure auth is initialized.
  var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
    console.log('Before Unsubscribe method');
    unsubscribe();
    console.log('After Unsubscribe method');
    // Check if we are already signed-in Firebase with the correct user.
    // if (!isUserEqual(googleUser, firebaseUser)) {
    if (true) {
      console.log('Why Lord');
      // Build Firebase credential with the Google ID token.
      var credential = firebase.auth.GoogleAuthProvider.credential(
        // googleUser.getAuthResponse().id_token);
        googleUser.idToken,
        googleUser.accessToken
      );
      console.log('Before firebase auth');
      console.log('Credential is: ', credential);
      // Sign in with credential from the Google user.
      firebase.auth()
        .signInWithCredential(credential)
        .then(function (result) {
          console.log('user signed in ');
          if (result.additionalUserInfo.isNewUser) {
            firebase
              .database()
              .ref('/users/' + result.user.uid)
              .set({
                email: result.user.email,
                profile_picture: result.additionalUserInfo.profile.picture,
                first_name: result.additionalUserInfo.profile.given_name,
                last_name: result.additionalUserInfo.profile.family_name,
                created_at: Date.now()
              })
              .then(function (snapshot) {
                // console.log('Snapshot', snapshot);
              });
          } else {
            firebase
              .database()
              .ref('/users/' + result.user.uid)
              .update({
                last_logged_in: Date.now()
              });
          }
        })
        .catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
          console.log(error.code, error.message);
        });
    } else {
      console.log('User already signed-in Firebase.');
    }
  });
}

const isUserEqual = (googleUser, firebaseUser) => {
  if (firebaseUser) {
    var providerData = firebaseUser.providerData;
    for (var i = 0; i < providerData.length; i++) {
      if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
        providerData[i].uid === googleUser.getBasicProfile().getId()) {
        // We don't need to reauth the Firebase connection.
        return true;
      }
    }
  }
  return false;
}

/**
 * Login with Facebook and keep the session in Firebase
 *
 * @param  {Function} onSuccess
 * @param  {Function} onError
 *
 * @return {Void}
 */
export const authWithFacebook = async (onSuccess, onError) => {
  try {
    const result = await Expo.Facebook.logInWithReadPermissionsAsync(
      '<APP_ID>',
      {
        permissions: ['public_profile', 'email']
      }
    );

    if (result.type === 'success') {
      const {token} = result;
      const credential = firebase.auth.FacebookAuthProvider.credential(
        token
      );

      firebase
        .auth()
        .signInAndRetrieveDataWithCredential(credential)
        .then(onSuccess)
        .catch(onError);
    }
  } catch (error) {
    onError(error);
  }
};