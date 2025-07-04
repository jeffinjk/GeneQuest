// updateUsers.js
import admin from 'firebase-admin';
import serviceAccount from 'C:\\Users\\jeffi\\Documents\\coding\\project\\GeneQuest\\GeneQuest\\genequest-2a0a4-34bc050d3fa6.json';


// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const updateAllUsers = async () => {
  try {
    const usersCollection = db.collection('users');
    const usersSnapshot = await usersCollection.get();

    if (usersSnapshot.empty) {
      console.log('No users found.');
      return;
    }

    // Loop through all user documents
    usersSnapshot.forEach(async (userDoc) => {
      const userRef = usersCollection.doc(userDoc.id);

      // Update the document with new fields
      await userRef.update({
        goalsCompleted: 0, // Add goalsCompleted field
        achievementsUnlocked: 0, // Add achievementsUnlocked field
        learningTime: 0, // Add learningTime field
      });

      console.log(`Updated user: ${userDoc.id}`);
    });

    console.log('All users updated with new fields.');
  } catch (error) {
    console.error('Error updating users:', error);
  }
};

// Run the update function
updateAllUsers();