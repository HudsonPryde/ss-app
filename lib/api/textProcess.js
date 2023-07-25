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
    content: "Answer in a consistent style.",
  };
  const exampleMessage = {
    role: "user",
    content: `Use the text delimited by triple quotes to write useful study notes. 
              """As you saw in the previous chapter, most eukaryote
              genes contain both expressed nucleotide sequences
              or exons (which form part of the instructions for
              protein synthesis) and intervening non-coding
              nucleotide sequences or introns. The RNA
              polymerase does not distinguish between introns
              and exons as it transcribes a gene. The initial
              mRNA transcript therefore contains long stretches
              of nucleotides that must be removed before the
              transcript is used to construct a polypeptide.
              The molecule that accomplishes this splicing act
              is called a spliceosome. This large molecule is
              formed from two components: proteins that are
              joined to nucleic acids of a type of RNA called
              small nuclear RNA (or snRNA) and other proteins.
              The spliceosome cleaves the pre-mRNA at the ends
              of each intron and then splices the remaining
              exons. This process is illustrated in Figure 8.11."""`,
  };
  const exampleResponse = {
    role: "assistant",
    content: `Genes in eukaryotes contain both exons and introns.\nExons: These are the coding regions of the gene, and they carry the instructions necessary for protein synthesis.\nIntrons: These are non-coding regions that do not directly participate in protein synthesis.\nDuring the process of transcription, RNA polymerase reads the entire gene, including both exons and introns, and synthesizes a complementary RNA molecule called pre-mRNA.\nThe pre-mRNA contains both exon and intron sequences, and these introns need to be removed before the mRNA can be used for protein synthesis.\nSplicing is the process of precisely removing the introns and joining the exons together to form mature mRNA.\nThe spliceosome is a large and complex molecular machine responsible for carrying out the splicing process.\nSmall Nuclear RNA (snRNA): The spliceosome contains snRNA, which is a type of RNA that associates with proteins to form small nuclear ribonucleoprotein particles (snRNPs).\nThe spliceosome cleaves the pre-mRNA at the junctions between exons and introns, and then it splices together the remaining exons to create mature mRNA.\nSplicing occurs at specific sites, namely the 5' and 3' ends of each intron. The spliceosome recognizes these splice sites and catalyzes the removal of introns. The exons are ligated together, and the mature mRNA is now ready for translation.`,
  };
  const promptMessage = {
    role: "user",
    content: `Use the text delimited by triple quotes to write useful study notes. """${text}"""`,
  };
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [sysMessage, exampleMessage, exampleResponse, promptMessage],
    });
    message_string = response.data["choices"][0]["message"]["content"];
    console.log(text);
    console.log(message_string);
    // response is inconsistent with use of new lines so replace '\n\n' with '\n'
    message_string = message_string.replaceAll("\n\n", "\n");
    note_list = message_string.split("\n");
    for (let i = 0; i < note_list.length; i++) {
      // remove extreneous identifyers from the start of each note
      note_list[i] = note_list[i].replace(/^\w+\s\d+. /, "");
    }

    return note_list;
  } catch (error) {
    console.error(error);
    return error;
  }
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
