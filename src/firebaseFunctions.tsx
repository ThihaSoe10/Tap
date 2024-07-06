import { db } from "./firebase";
import { ref, set, update, get, child } from "firebase/database";

// Function to send user data to Firebase
export const sendUserDataToFirebase = (
  userId: string,
  autoIncrement: number
) => {
  if (!userId) return;

  set(ref(db, "users/" + userId), {
    autoIncrement: autoIncrement,
    timestamp: new Date().toISOString(),
  });
};

// Function to update user's autoIncrement value in Firebase
export const updateUserAutoIncrementInFirebase = (
  userId: string,
  autoIncrement: number
) => {
  if (!userId) return;

  update(ref(db, "users/" + userId), {
    autoIncrement: autoIncrement,
  });
};

// Function to record a referral
export const recordReferral = async (
  referrerUserId: string,
  newUserId: string
) => {
  if (!referrerUserId || !newUserId) return;

  try {
    const referralRef = ref(db, `referrals/${referrerUserId}/referredUsers`);
    const snapshot = await get(referralRef);

    // Check if referredUsers node exists
    if (snapshot.exists()) {
      const referredUsers = snapshot.val();
      referredUsers[newUserId] = true;
      update(referralRef, referredUsers);
    } else {
      // If referredUsers node doesn't exist, create it
      set(referralRef, {
        [newUserId]: true,
      });
    }

    // Update referral count
    const referralCountRef = ref(
      db,
      `referrals/${referrerUserId}/referralCount`
    );
    const referralCountSnapshot = await get(referralCountRef);
    let newCount = 1;
    if (referralCountSnapshot.exists()) {
      newCount = referralCountSnapshot.val() + 1;
    }
    set(referralCountRef, newCount);
  } catch (error) {
    console.error("Error recording referral:", error);
  }
};

// Function to get the count of referred users
export const getReferredUsersCount = async (userId: string) => {
  if (!userId) return 0;

  try {
    const referralCountRef = ref(db, `referrals/${userId}/referralCount`);
    const snapshot = await get(referralCountRef);
    if (snapshot.exists()) {
      return snapshot.val(); // Return the referral count
    } else {
      return 0; // No referrals found
    }
  } catch (error) {
    console.error("Error fetching referred users count:", error);
    return 0;
  }
};
