'use server';

import { getFirebaseAdmin } from '@/firebase/admin';
import * as XLSX from 'xlsx';

interface CourseRow {
  'Main Topic': string;
  SubTopic: string;
  'Youtube Video Link': string;
  'Short Description': string;
}

// Very basic youtube video id parser
function extractVideoId(url: string): string {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === 'youtu.be') {
        return urlObj.pathname.slice(1);
      }
      if (urlObj.hostname.includes('youtube.com')) {
        const videoId = urlObj.searchParams.get('v');
        if (videoId) {
          return videoId;
        }
      }
    } catch (e) {
      console.error("Invalid URL:", url, e);
    }
    return ''; // Return empty if parsing fails
}

export async function uploadCourseContent(fileBuffer: ArrayBuffer) {
  const { db } = getFirebaseAdmin();
  if (!db) {
    throw new Error('Firestore is not initialized');
  }

  try {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const courseData: CourseRow[] = XLSX.utils.sheet_to_json(worksheet);

    const coursesMap = new Map<string, any>();

    courseData.forEach((row, index) => {
      const mainTopic = row['Main Topic'];
      if (!mainTopic) return;

      const videoId = extractVideoId(row['Youtube Video Link']);

      const subTopic = {
        id: `${(index + 1)}`,
        title: row.SubTopic,
        videoId: videoId,
        duration: "0:00", // This would ideally be fetched from Youtube API
        transcript: "Transcript not available." // This would be fetched/generated
      };

      if (!coursesMap.has(mainTopic)) {
        coursesMap.set(mainTopic, {
          title: mainTopic,
          description: row['Short Description'] || `A course on ${mainTopic}`,
          enrollmentCount: 0,
          subTopics: [subTopic]
        });
      } else {
        coursesMap.get(mainTopic).subTopics.push(subTopic);
      }
    });

    await db.runTransaction(async (transaction) => {
      coursesMap.forEach((course, title) => {
        const courseRef = db.collection('courses').doc(title);
        transaction.set(courseRef, course, { merge: true });
      });
    });

    return { success: true, message: `Successfully uploaded ${coursesMap.size} courses.` };
  } catch (error: any) {
    console.error('Error uploading course content:', error);
    return { success: false, message: error.message || 'An unknown error occurred.' };
  }
}

export async function getDashboardStats() {
    try {
        const { db, auth } = getFirebaseAdmin();

        const usersPromise = auth.listUsers();
        const coursesPromise = db.collection('courses').count().get();
        const topCoursesPromise = db.collection('courses')
            .orderBy('enrollmentCount', 'desc')
            .limit(5)
            .get();

        const [userRecords, coursesSnapshot, topCoursesSnapshot] = await Promise.all([
            usersPromise,
            coursesPromise,
            topCoursesPromise
        ]);

        const userCount = userRecords.users.length;
        const courseCount = coursesSnapshot.data().count;

        const topCourses = topCoursesSnapshot.docs.map(doc => ({
            name: doc.data().title,
            users: doc.data().enrollmentCount || 0,
        }));

        return { success: true, userCount, courseCount, topCourses };
    } catch (error: any) {
        console.error('Failed to get dashboard stats:', error);
        // This message will be shown in the toast on the client.
        return { success: false, message: error.message || 'The server encountered an error.' };
    }
}
