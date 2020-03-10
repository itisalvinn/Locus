import {Notifications} from 'expo';
import * as Permissions from 'expo-permissions';
import * as firebase from "firebase";

export default async function registerForPushNotificationsAsync(userID) {
  const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  // only asks if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  // On Android, permissions are granted on app installation, so
  // `askAsync` will never prompt the user

  // Stop here if the user did not grant permissions
  if (status !== 'granted') {
    alert('No notification permissions!');
    return;
  }

  // Get the token that identifies this device
  let token = await Notifications.getExpoPushTokenAsync();
  console.log("Push notification token for this device: ", token)

  const dataRef = 'users/' + userID + '/notification_token';

  firebase
    .database()
    .ref(dataRef)
    .set(token)
    .then(() => {
      console.log('Saved token');
    })
    .catch((error) => {
      console.log(error);
    });
}