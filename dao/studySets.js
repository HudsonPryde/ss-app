import { supabase } from "../lib/initSupabase.js";

export const createStudySet = async (user_id, name) => {
  const { error } = await supabase
    .from("Notebooks")
    .insert({ user_id: user_id, name: name });

  if (error) {
    console.error(error);
    return error;
  }
};

// return an object containing all user study sets
export const getStudySets = async (user_id) => {
  let { data: Notebooks, error } = await supabase
    .from("Notebooks")
    .select("*")
    .eq("user_id", user_id);
  if (error) {
    console.error(error);
    return error;
  }
  console.log(await supabase.auth.getSession());
  console.log(Notebooks);
  return Notebooks;
};

/*
description: return all notes for a given list of sections
props:
 - section_ids: array of section ids
*/
export const getSectionNotes = async (section_ids) => {
  const { data, error } = await supabase
    .from("Notes")
    .select()
    .in("section_id", section_ids);
  if (error) {
    console.error(error);
    return error;
  }
  return data;
};

// add a note to a specific set
export const createSetNote = async (
  notebook_id,
  text,
  question,
  answer,
  hint
) => {
  const { error } = await supabase.from("Notes").insert({
    notebook_id: notebook_id,
    text: text,
    question: question,
    answer: answer,
    hint: hint,
  });
  if (error) {
    console.error(error);
    return error;
  }
};

export const removeNotes = async (notebook_id) => {
  const { error } = await supabase
    .from("Notes")
    .delete()
    .eq("notebook_id", notebook_id);
  if (error) {
    console.error(error);
    return error;
  }
};

export const removeStudySet = async (notebook_id) => {
  await removeNotes(notebook_id);
  const { error } = await supabase
    .from("Notebooks")
    .delete()
    .eq("id", notebook_id);
  if (error) {
    console.error(error);
    return error;
  }
};

export const removeSingleNote = async (note_id) => {
  const { error } = await supabase
    .from("Notes")
    .delete()
    .eq("note_id", note_id);
  if (error) {
    console.error(error);
    return error;
  }
};
