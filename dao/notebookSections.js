import { supabase } from "../lib/initSupabase.js";

/*
description: return all sections of a notebook
props:
 - notebook_id: id of the notebook to get the section of
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
description: return all sections of a list of notebook
props:
 - notebook_ids: ids of the notebooks to get the sections of
*/
export const getBulkSections = async (notebook_ids) => {
  const { data, error } = await supabase
    .from("Sections")
    .select()
    .in("notebook_id", notebook_ids);
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
returns:
 - new section contained in an array
*/
export const createSection = async (name, notebook_id) => {
  const { data, error } = await supabase
    .from("Sections")
    .insert({
      name: name,
      notebook_id: notebook_id,
    })
    .select();
  if (error) {
    console.error(error);
    return error;
  }
  return data[0];
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
