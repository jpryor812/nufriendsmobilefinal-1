// utils/achievements.ts
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { avatarStyles } from '@/constants/avatarData';

export const checkMessageAchievements = async (userId: string, messageCount: number) => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  const unlockedItems = userDoc.data()?.avatar?.unlockedItems || [];

  // Check each achievement condition
  if (messageCount === 1) {
    // First message achievement
    const firstMessageOutfit = avatarStyles.find(style => style.achievement === 'FIRST_MESSAGE');
    if (firstMessageOutfit && !unlockedItems.includes(firstMessageOutfit.id)) {
      await unlockOutfit(userId, firstMessageOutfit.id);
      return { unlockedOutfit: firstMessageOutfit.id };
    }
  }

  if (messageCount === 5) {
    // 5 messages achievement
    const fiveMessagesOutfit = avatarStyles.find(style => style.achievement === 'FIVE_MESSAGES');
    if (fiveMessagesOutfit && !unlockedItems.includes(fiveMessagesOutfit.id)) {
      await unlockOutfit(userId, fiveMessagesOutfit.id);
      return { unlockedOutfit: fiveMessagesOutfit.id };
    }
  }

  if (messageCount === 10) {
    // 10 messages achievement
    const tenMessagesOutfit = avatarStyles.find(style => style.achievement === 'TEN_MESSAGES');
    if (tenMessagesOutfit && !unlockedItems.includes(tenMessagesOutfit.id)) {
      await unlockOutfit(userId, tenMessagesOutfit.id);
      return { unlockedOutfit: tenMessagesOutfit.id };
    }
  }

  if (messageCount === 15) {
    const fifteenMessagesOutfit = avatarStyles.find(style => 
      style.achievement === 'FIFTEEN_MESSAGES'
    );
    if (fifteenMessagesOutfit && !unlockedItems.includes(fifteenMessagesOutfit.id)) {
      await unlockOutfit(userId, fifteenMessagesOutfit.id);
      return { unlockedOutfit: fifteenMessagesOutfit.id };
    }
  }

  return null;
};

const unlockOutfit = async (userId: string, outfitId: string) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    'avatar.unlockedItems': arrayUnion(outfitId)
  });
};

// Initialize default unlocked outfits for new users
export const initializeDefaultOutfits = async (userId: string) => {
  const defaultOutfits = avatarStyles
    .filter(style => style.defaultUnlocked)
    .map(style => style.id);

  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    'avatar.unlockedItems': defaultOutfits,
    'avatar.currentOutfit': {
      id: defaultOutfits[0]
    }
  });
};