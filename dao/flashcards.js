import { supabase } from "../lib/initSupabase.js";

/*
description: return all flashcards of a note
props:
 - note_id: id of the related note
*/
export const getFlashcards = async (note_id) => {
  const { data, error } = await supabase
    .from("Flashcards")
    .select()
    .eq("note_id", note_id);
  if (error) {
    console.error(error);
    return error;
  }
  return data;
};

/*
description: return all flashcards from a list of notes
props:
 - ids: list of note ids
*/
export const getFlashcardsFromNotes = async (ids) => {
  const { data, error } = await supabase
    .from("Flashcards")
    .select()
    .in("note_id", ids);
  if (error) {
    console.error(error);
    return error;
  }
  return data;
};

/*
description: create a flashcard for a corresponding note
props:
    - question: question derived from note
    - answer: answer for question
returns:
 - new flashcard
*/
export const createFlashcard = async (question, answer, note_id) => {
  const { data, error } = await supabase
    .from("Flashcards")
    .insert({
      question: question,
      answer: answer,
      note_id: note_id,
    })
    .select();
  if (error) {
    console.error(error);
    return error;
  }
  return data;
};

/*
description: incerement the number of times a flashcard has been answered correctly
props:
  - flashcards: list of correct flashcards
returns: void
*/
export const bulkInsertFlashcards = async (flashcards) => {
  const { data, error } = await supabase
    .from("Flashcards")
    .insert(flashcards)
    .select();
  if (error) {
    console.error(error);
    return error;
  } else {
    return data;
  }
};

/*
description: incerement the number of times a flashcard has been answered correctly
props:
  - flashcards: list of correct flashcards
returns: void
*/
export const bulkUpsertFlashcards = async (flashcards) => {
  const { data, error } = await supabase
    .from("Flashcards")
    .upsert(flashcards)
    .select();
  if (error) {
    console.error(error);
    return error;
  } else {
    return data;
  }
};
