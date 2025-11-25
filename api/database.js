import {
  arrayUnion,
  arrayRemove,
  collection,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { firestore } from '$firebase';
import { slugify } from '$utils/utils';

/*
  Models
*/
export async function addModelToCollection(collectionId, modelFilename) {
  const collectionRef = doc(firestore, 'collections', collectionId);
  await updateDoc(collectionRef, {
    models: arrayUnion(modelFilename),
  });
  return {
    success: true,
    message: 'Model added to collection successfully',
    data: null,
  };
}

export async function deleteModelFromCollection(collectionId, modelFilename) {
  const collectionRef = doc(firestore, 'collections', collectionId);
  await updateDoc(collectionRef, {
    models: arrayRemove(modelFilename),
  });
  return {
    success: true,
    message: 'Model removed from collection successfully',
    data: null,
  };
}




/*
  Collections
*/

export async function createCollection(creator, coll) {
  const { title, description, access } = coll;
  const slug = slugify(title);
  const newCollection = {
    creator,
    title,
    description,
    timeStamp: Date.now(),
    lastEdit: Date.now(),
    slug,
    access,
    models: [],
  };
  const collectionsRef = collection(firestore, 'collections');
  await addDoc(collectionsRef, newCollection);
  return { success: true, message: 'Collection created successfully' };
}

export async function deleteCollection(collectionId) {
  await deleteDoc(doc(firestore, 'collections', collectionId));

  const relatedCollections = ['annotations', 'comments', 'learning-pathways'];

  for (const collectionName of relatedCollections) {
    const q = query(
      collection(firestore, collectionName),
      where('collectionId', '==', collectionId)
    );

    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  }

  return {
    success: true,
    message: 'Collection and related documents deleted successfully',
  };
}

export async function fetchCollections(userName = null) {
  const collectionsRef = collection(firestore, 'collections');
  let q;

  if (userName) {
    q = query(
      collectionsRef,
      where('creator', '==', userName),
      orderBy('timeStamp', 'desc')
    );
  } else {
    q = query(collectionsRef, orderBy('timeStamp', 'desc'));
  }

  const snapshot = await getDocs(q);
  const collections = snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  return {
    success: true,
    message: 'Collections fetched successfully',
    data: collections,
  };
}

export async function fetchCollection(collectionId) {
  const documentRef = doc(firestore, 'collections', collectionId);
  const documentSnapshot = await getDoc(documentRef);
  if (documentSnapshot.exists()) {
    const collection = { ...documentSnapshot.data(), id: documentSnapshot.id };
    return {
      success: true,
      message: 'Collection fetched successfully',
      data: collection,
    };
  } else {
    return { success: false, message: 'Collection not found' };
  }
}

export async function postCollectionDescription(categoryId, description) {
  const collectionRef = doc(firestore, 'collections', categoryId);

  const updatedDescription = {
    title: description.title,
    description: description.description,
    lastEdit: Date.now(),
  };

  if (description.access !== undefined) {
    updatedDescription.access = description.access;
  }
  await updateDoc(collectionRef, updatedDescription);
  return {
    success: true,
    message: 'Collection description updated successfully',
  };
}

/*
  Notes annotations 
*/

export async function fetchNotesAnnotations(collectionId) {
  const annotationsRef = collection(firestore, 'annotations');
  const q = query(
    annotationsRef,
    where('collectionId', '==', collectionId),
    orderBy('timeStamp', 'desc')
  );
  const snapshot = await getDocs(q);
  const annotations = snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  return {
    success: true,
    message: 'Annotations fetched successfully',
    data: annotations,
  };
}

export async function postNotesAnnotation(userName, collectionId, annotation) {
  const annotationRef = collection(firestore, 'annotations');
  const annotationData = {
    name: userName,
    title: annotation.title,
    annotation: annotation.content,
    date: new Date().toLocaleString('nl-NL').split(',')[0],
    timeStamp: Date.now(),
    collectionId: collectionId,
    comments: [],
  };
  await addDoc(annotationRef, annotationData);
  return { success: true, message: 'Annotation added successfully' };
}

export async function postNotesAnnotationUpdate(
  collectionId,
  annotationId,
  annotation
) {
  const collectionRef = doc(firestore, 'collections', collectionId);
  const annotationRef = doc(firestore, 'annotations', annotationId);
  const collectionData = {
    lastEdit: Date.now(),
  };
  const annotationData = {
    title: annotation.title,
    annotation: annotation.annotation,
  };

  await Promise.all([
    updateDoc(collectionRef, collectionData),
    updateDoc(annotationRef, annotationData),
  ]);

  return { success: true, message: 'Annotation updated successfully' };
}

export async function deleteNotesAnnotation(annotationId) {
  // Delete the annotation
  await deleteDoc(doc(firestore, 'annotations', annotationId));

  // Delete associated comments
  const commentsRef = collection(firestore, 'comments');
  const q = query(commentsRef, where('collectionId', '==', annotationId));
  const snapshot = await getDocs(q);

  const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletePromises);

  return {
    success: true,
    message: 'Annotation and associated comments deleted successfully',
  };
}

/*
  Notes comments 
*/

export async function fetchNotesComments(collectionId) {
  const commentsRef = collection(firestore, 'comments');
  const q = query(
    commentsRef,
    where('collectionId', '==', collectionId),
    orderBy('timeStamp', 'desc')
  );
  const snapshot = await getDocs(q);
  const comments = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return {
    success: true,
    message: 'Comments fetched successfully',
    data: comments,
  };
}

export async function postNotesComment(
  userName,
  collectionId,
  annotationId,
  comment
) {
  const commentsRef = collection(firestore, 'comments');
  const commmentData = {
    comment: comment.comment,
    date: new Date().toLocaleString('nl-NL').split(',')[0],
    timeStamp: Date.now(),
    name: userName,
    annotationId,
    collectionId,
  };
  await addDoc(commentsRef, commmentData);
  return { success: true, message: 'Comment added successfully' };
}

export async function postNotesCommentUpdate(collectionId, commentId, comment) {
  const collectionRef = doc(firestore, 'collections', collectionId);
  const commentsRef = doc(firestore, 'comments', commentId);
  const collectionData = {
    lastEdit: Date.now(),
  };
  const commentData = { comment: comment.comment };
  await Promise.all([
    updateDoc(collectionRef, collectionData),
    updateDoc(commentsRef, commentData),
  ]);
  return { success: true, message: 'Comment updated successfully' };
}

export async function deleteNotesComment(commentId) {
  const commentRef = doc(firestore, 'comments', commentId);
  await deleteDoc(commentRef);
  return { success: true, message: 'Comment deleted successfully' };
}

/*
  Learning pathways 
*/

export async function fetchLearningPathway(collectionId) {
  const learningPathwaysRef = collection(firestore, 'learning-pathways');
  const q = query(
    learningPathwaysRef,
    where('collectionId', '==', collectionId),
    orderBy('date', 'asc')
  );
  const snapshot = await getDocs(q);
  const learningPathways = snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  return {
    success: true,
    message: 'Learning pathways fetched successfully',
    data: learningPathways,
  };
}

export async function fetchLearningPathwayIds(userName = null) {
  const pathwaysRef = collection(firestore, 'learning-pathways');
  let q;

  if (userName) {
    q = query(pathwaysRef, where('name', '==', userName));
  } else {
    q = query(pathwaysRef);
  }

  const snapshot = await getDocs(q);
  const pathwayIds = snapshot.docs.map((doc) => doc.data().collectionId);
  return {
    success: true,
    message: 'Learning pathway IDs fetched successfully',
    data: pathwayIds,
  };
}
export async function postLearningPathwayParagraph(
  userName,
  collectionId,
  paragraphHeading, 
  paragraphContent,
  paragraphTourLinks
) {
  const learningPathwaysRef = collection(firestore, 'learning-pathways');
  const PathwayParagraphData = {
    heading: paragraphHeading,
    content: paragraphContent,
    date: new Date().toLocaleString('nl-NL').split(',')[0],
    name: userName,
    timeStamp: Date.now(),
    collectionId: collectionId,
    hyperlinks: paragraphTourLinks,
  };

  await addDoc(learningPathwaysRef, PathwayParagraphData);
  return {
    success: true,
    message: 'Learning pathway added successfully',
  };
}


export async function updateLearningPathwayParagraph(
  collectionId, 
  paragraphId, 
  paragraphHeading, 
  paragraphContent,
  paragraphTourLinks
) {
    const collectionRef = doc(firestore, "collections", collectionId)
    await updateDoc(collectionRef, {
        lastEdit: Date.now(),
    });

    const paragraphRef = doc(firestore, "learning-pathways", paragraphId)
    await updateDoc(paragraphRef, {
        timeStamp: Date.now(),
        heading: paragraphHeading,
        content: paragraphContent,
        hyperlinks: paragraphTourLinks, 
    });

    return { success: true, message: 'Learning pathway paragraph updated succesfuly' };
}

export async function deleteLearningPathwayParagraph(paragraphId) {
  const paragraphRef = doc(firestore, "learning-pathways", paragraphId); 
  await deleteDoc(paragraphRef);
  return { success: true, message: 'Learning pathway paragraph deleted succesfuly' };
}

