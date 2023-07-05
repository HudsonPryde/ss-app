import { supabase } from "../lib/initSupabase.js";

/*
description: create a new notebook
props: 
  - user_id: id of the user creating the notebook
  - name: name of the notebook
  - colour?: colour of the notebook (optinal)
*/
export const createStudySet = async (user_id, name, colour) => {
  const { data, error } = await supabase
    .from("Notebooks")
    .insert({ user_id: user_id, name: name, colour: colour })
    .select();
  if (error) {
    console.error(error);
    return error;
  }
  return data[0];
};

// return an object containing all user study sets
export const getStudySets = async (user_id) => {
  let { data: Notebooks, error } = await supabase
    .from("Notebooks")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    return error;
  }
  return Notebooks;
};

/*
description: retrieve a notebook by its id
props: 
 - notebook_id: id of the notebook to retrieve
*/
export const getStudySet = async (notebook_id) => {
  const { data, error } = await supabase
    .from("Notebooks")
    .select("*")
    .eq("id", notebook_id);
  if (error) {
    console.error(error);
    return error;
  }
  return data;
};

/*
description: remove a notebook by its id
props: 
 - notebook_id: id of the notebook to remove
*/
export const removeStudySet = async (notebook_id) => {
  const { error } = await supabase
    .from("Notebooks")
    .delete()
    .eq("id", notebook_id);
  if (error) {
    console.error(error);
    return error;
  }
};

/*
description: update a notebook by its id using the options provided
props: 
 - notebook_id: id of the notebook to remove
 - options: object containing the fields to update
*/
export const updateStudySet = async (notebook_id, options) => {
  const { data, error } = await supabase
    .from("Notebooks")
    .update(options)
    .eq("id", notebook_id)
    .select();
  if (error) {
    console.error(error);
    return error;
  }
  return data;
};

/*
description: count the sections belonging to a notebook
props:
  - notebook_id: id of the notebook to count the sections of
*/
export const countSections = async (notebook_id) => {
  const { data, error } = await supabase
    .from("Sections")
    .select("id")
    .eq("notebook_id", notebook_id);
  if (error) {
    console.error(error);
    return error;
  }
  return data.length;
};
