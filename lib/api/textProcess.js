const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

// extract the text from an image
const createNotes = async (imgText) => {
  text = await imgText;
  console.log(text);
  const sysMessage = {
    role: "system",
    content: "You are a helpful research assistant.",
  };
  const promptMessage = {
    role: "user",
    content: "create 5 study notes from the following text:",
  };
  const newMessage = { role: "user", content: text };

  //   const response = await openai.createChatCompletion({
  //     model: "gpt-3.5-turbo",
  //     messages: [sysMessage, promptMessage, newMessage],
  //   });
  //   message_string = response.data["choices"][0]["message"]["content"];
  const str =
    "1. Feline Calicivirus (FCV) is a common virus that affects the feline upper respiratory system and accounts for approximately 40% of all respiratory diseases in cats.\n2. Symptoms of FCV may include moderate fever, ulcers, and blisters on the tongue. Even after successful treatment, some infected cats may become chronic virus carriers with lifelong clinical signs of sneezing and runny eyes.\n3. Feline Chlamydiosis, formerly known as Feline Pneumonitis, is a relatively mild upper respiratory infection that affects the mucous membranes of the eyes, causing tearing, sneezing, and sometimes nasal discharge.\n4. Rabies is a fatal disease that attacks the nervous system and affects all mammals, including humans. Vaccination against rabies is crucial, and in many cases, required by municipal law and for travel outside Canada.\n5. As a cat owner, it is important to prioritize preventive measures such as vaccinations to protect your feline companion from infectious diseases like FCV, Feline Chlamydiosis, and Rabies.";
  note_list = str.split("\n");
  for (let i = 0; i < note_list.length; i++) {
    note_list[i] = note_list[i].replace(/^\d+\. /, "");
  }
  console.log(note_list);
};

module.exports = {
  createNotes,
};
