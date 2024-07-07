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

export const getReferredUsersCount = async (userId: string): Promise<number> => {
  if (!userId) return 0;

  try {
    const referralsRef = ref(db, "referrals/" + userId);
    const snapshot = await get(referralsRef);

    if (snapshot.exists()) {
      const referralsData = snapshot.val();
      return Object.keys(referralsData).length;
    } else {
      return 0;
    }
  } catch (error) {
    console.error("Error fetching referred users count:", error);
    return 0;
  }
};
