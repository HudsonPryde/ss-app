import { supabase } from '../initSupabase';

const createNotes = async (imgText) => {
  text = await imgText;
  try {
    // data returned should be stringified JSON
    const { data, error } = await supabase.functions.invoke('generate-notes', {
      body: {
        text,
      },
    });
    if (error) {
      if (error instanceof FunctionsHttpError) {
        const errorMessage = await error.context.json();
        console.log('Function returned an error', errorMessage);
      } else if (error instanceof FunctionsRelayError) {
        console.log('Relay error:', error.message);
      } else if (error instanceof FunctionsFetchError) {
        console.log('Fetch error:', error.message);
      }
      throw error;
    }
    let notes_json = JSON.parse(data);
    return Object.values(notes_json);
  } catch (error) {
    console.error(error);
    return error;
  }
};

const createFlashcards = async (note) => {
  try {
    const text = note.text;
    const { data, error } = await supabase.functions.invoke(
      'generate-flashcards',
      {
        body: {
          text,
        },
      }
    );
    if (error) {
      if (error instanceof FunctionsHttpError) {
        const errorMessage = await error.context.json();
        console.log('Function returned an error', errorMessage);
      } else if (error instanceof FunctionsRelayError) {
        console.log('Relay error:', error.message);
      } else if (error instanceof FunctionsFetchError) {
        console.log('Fetch error:', error.message);
      }
      throw error;
    }
    let notes_json = JSON.parse(data);
    return [
      { question: notes_json['Q'], answer: notes_json['A'], note_id: note.id },
    ];
  } catch (error) {
    console.error(error);
    return error;
  }
};

module.exports = {
  createNotes,
  createFlashcards,
};
