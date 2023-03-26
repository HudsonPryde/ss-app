import { supabase } from "../lib/initSupabase.js";

/*
description: return all sections of a notebook
props:
 - notebook_id: id of the notebook to add the section to
*/
export const getSections = async (notebook_id) => {
  const { data, error } = await supabase
    .from("Sections")
    .select()
    .eq("notebook_id", notebook_id);
  if (error) {
    console.error(error);
    return error;
  }
  return data;
};

/*
description: create a notebook section
props:
 - name: user given section name
 - notebook_id: id of the notebook to add the section to
*/
export const createSection = async (name, notebook_id) => {
  const { error } = await supabase.from("Sections").insert({
    name: name,
    notebook_id: notebook_id,
  });
  if (error) {
    console.error(error);
    return error;
  }
  return true;
};

/*
description: delete a notebook section
props:
 - section_id: user given section name
 - notebook_id: id of the notebook to add the section to
*/
export const removeSection = async (section_id) => {
  const { error } = await supabase
    .from("Sections")
    .delete()
    .eq("id", section_id);
  if (error) {
    console.error(error);
    return error;
  }
  return true;
};

/*
description: update the name of a notebook section
props:
 - section_id: user given section name
 - notebook_id: id of the notebook to add the section to
*/
export const renameSection = async (section_id, newName) => {
  const { error } = await supabase
    .from("Sections")
    .update({ name: newName })
    .eq("id", section_id);
  if (error) {
    console.error(error);
    return error;
  }
  return true;
};
