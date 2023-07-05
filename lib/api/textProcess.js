const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

// extract the text from an image
const createNotes = async (imgText) => {
  text = await imgText;
  const sysMessage = {
    role: "system",
    content: "Act as a research assistant.",
  };
  const promptMessage = {
    role: "user",
    content:
      "I want you to act as a research asistant. You will write five useful notes from the following text:",
  };
  const newMessage = { role: "user", content: text };

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [sysMessage, promptMessage, newMessage],
  });
  message_string = response.data["choices"][0]["message"]["content"];
  // response is inconsistent with use of new lines so replace '\n\n' with '\n'
  message_string = message_string.replaceAll("\n\n", "\n");
  note_list = message_string.split("\n");
  for (let i = 0; i < note_list.length; i++) {
    note_list[i] = note_list[i].replace(/^\d+\. /, "");
  }
  return note_list;
};

const createFlashcards = async (note) => {
  try {
    const sysMessage = {
      role: "system",
      content: "Act as a research assistant.",
    };
    const promptMessage = {
      role: "user",
      content:
        "I want you to restructure this text into a question and answer in a way that is easily parsed via regex. This is an example of the format I want you to use: \n\nQ: What is the capital of France? \nA: Paris",
    };
    // make messages from notes list

    const newMessage = { role: "user", content: note.text };
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [sysMessage, promptMessage, newMessage],
    });
    message_string = response.data["choices"][0]["message"]["content"];
    console.log(message_string);
    // parse the response, epected format is: Q: question \nA: answer
    // model is inconsistent with use of new lines so replace '\n\n' with '\n'
    // sometimes multiple pairs are made, always treat reponse as list
    // always return as list to make code easier to handle
    const formatted_string = message_string.replaceAll("\n\n", "\n");
    const pairs = formatted_string.split("\n");
    // sometimes the response is empty, so we check for that
    if (pairs.length === 0) {
      return [{ question: "", answer: "", note_id: note.id }];
    }
    // sometimes the response is a single pair, so we check for that
    if (pairs.length === 2) {
      const question = pairs[0].replace("Q: ", "");
      const answer = pairs[1].replace("A: ", "");
      return [{ question: question, answer: answer, note_id: note.id }];
    }
    // reponse is multiple pairs so map the pairs to a list of objects
    let result = [];
    // if multiple pairs were made length will be even
    if (pairs.length % 2 !== 0) {
      // if odd something went wrong, so raise an error
      throw new Error("Response from GPT-3 was not in expected format");
    }
    // if even go by two's and make a pairs
    for (let i = 0; i < pairs.length; i += 2) {
      const question = pairs[i].replace("Q: ", "");
      const answer = pairs[i + 1].replace("A: ", "");
      result.push({ question: question, answer: answer, note_id: note.id });
    }
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
};

module.exports = {
  createNotes,
  createFlashcards,
};
