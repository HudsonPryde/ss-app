import { supabase } from "../lib/initSupabase.js";

/*
description: bulk create notes
props: 
  - notes: array of notes to create
*/
export const createNotes = async (notes) => {
  notes.map(async (note) => {
    const { error } = await supabase.from("Notes").insert(note);
    if (error) {
      console.error(error);
      return error;
    }
  });
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
