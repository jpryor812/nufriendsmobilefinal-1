import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';

export const searchUsers = async ({ gender, state, city }: {
  gender?: string;
  state?: string;
  city?: string;
}) => {
  try {
    let userQuery = query(collection(db, 'users'));

    // Add filters based on provided criteria
    if (gender) {
      userQuery = query(userQuery, where('demographics.gender', '==', gender));
    }
    if (state) {
      userQuery = query(userQuery, where('demographics.state', '==', state));
    }
    if (city) {
      userQuery = query(userQuery, where('demographics.city', '==', city));
    }

    // This will fail first time with a link to create the needed index
    const querySnapshot = await getDocs(userQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error: any) {
    console.error('Search error:', error);
    // The error will contain a link to create the required index
    if (error.code === 'failed-precondition') {
      console.log('Click this link to create index:', error.message);
    }
    throw error;
  }
};