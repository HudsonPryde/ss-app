import { supabase } from "../lib/initSupabase.js";

/*
description: create a note
props: 
  - note: note to create
*/
export const createNote = async (note) => {
  const { data, error } = await supabase.from("Notes").insert(note).select();
  if (error) {
    console.error(error);
    return error;
  }
  return data[0];
};

/*
description: bulk create notes
props: 
  - notes: array of notes to create
*/
export const createNotes = async (notes) => {
  let result = [];
  for (const note of notes) {
    const { data, error } = await supabase.from("Notes").insert(note).select();
    if (error) {
      console.error(error);
      return error;
    }
    result.push(data[0]);
  }
  return result;
};

/*
description: retrieve all notes from a list of sections
props:
  - sections: array of section ids to retrieve notes from
returns: array of notes
*/
export const getSectionNotes = async (sections) => {
  let { data: Notes, error } = await supabase
    .from("Notes")
    .select("*")
    .in("section_id", sections);
  if (error) {
    console.error(error);
    return error;
  }
  return Notes;
};

/*
description: remove notes from db based on id
props:
  - notes: array of note ids to remove
returns: array of notes
*/
export const removeNotes = async (notes) => {
  const { data, error } = await supabase.from("Notes").delete().in("id", notes);
  if (error) {
    console.error(error);
    return error;
  }
};
